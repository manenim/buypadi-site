'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { api, type InspectionRequest } from '@/app/lib/api';
import type { InspectionStatus } from '@/app/lib/types';

// ─── Timeline helpers ────────────────────────────────────────────────────────

const STEPS: { key: InspectionStatus | 'pending'; label: string; description: string }[] = [
  { key: 'pending', label: 'Request Received', description: 'Your inspection request has been logged.' },
  { key: 'payment_confirmed', label: 'Payment Confirmed', description: 'Payment has been verified.' },
  { key: 'scheduled', label: 'Inspection Scheduled', description: 'An inspector has been assigned.' },
  { key: 'inspector_en_route', label: 'Inspector En Route', description: 'Your inspector is heading to the seller.' },
  { key: 'completed', label: 'Inspection Complete', description: 'The inspection report is ready.' },
];

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  payment_confirmed: 1,
  scheduled: 2,
  inspector_en_route: 3,
  completed: 4,
};

function stepState(stepKey: string, currentStatus: string): 'done' | 'active' | 'upcoming' {
  const stepIdx = STATUS_ORDER[stepKey] ?? 0;
  const currentIdx = STATUS_ORDER[currentStatus] ?? 0;
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'upcoming';
}

function StepDot({ state }: { state: 'done' | 'active' | 'upcoming' }) {
  if (state === 'done') {
    return (
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 ring-4 ring-blue-100">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt">
      <span className="h-2.5 w-2.5 rounded-full bg-subtle/40" />
    </div>
  );
}

function statusLabel(status: string) {
  return STEPS.find((s) => s.key === status)?.label ?? status;
}

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (trimmed) router.push(`/track?orderid=${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center">

          {/* SVG illustration */}
          <svg viewBox="0 0 200 180" className="h-44 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle */}
            <circle cx="100" cy="90" r="80" fill="#F4F6F3" />

            {/* Clipboard body */}
            <rect x="58" y="45" width="84" height="105" rx="10" fill="white" stroke="#E2E6DF" strokeWidth="2" />

            {/* Clipboard top clip */}
            <rect x="78" y="36" width="44" height="18" rx="9" fill="#E2E6DF" />
            <rect x="88" y="40" width="24" height="10" rx="5" fill="white" />

            {/* Lines representing content */}
            <rect x="72" y="72" width="56" height="6" rx="3" fill="#E2E6DF" />
            <rect x="72" y="86" width="40" height="6" rx="3" fill="#E2E6DF" />
            <rect x="72" y="100" width="48" height="6" rx="3" fill="#E2E6DF" />
            <rect x="72" y="114" width="30" height="6" rx="3" fill="#E2E6DF" />

            {/* Search magnifier */}
            <circle cx="138" cy="130" r="22" fill="#1E4D2B" opacity="0.9" />
            <circle cx="134" cy="126" r="10" stroke="white" strokeWidth="2.5" fill="none" />
            <line x1="141" y1="133" x2="148" y2="140" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

            {/* Small dots decoration */}
            <circle cx="48" cy="60" r="5" fill="#D4E6C3" />
            <circle cx="160" cy="55" r="3.5" fill="#D4E6C3" />
            <circle cx="155" cy="145" r="4" fill="#D4E6C3" />
            <circle cx="42" cy="135" r="3" fill="#D4E6C3" />
          </svg>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-black text-heading sm:text-4xl">Track your order</h1>
            <p className="text-sm leading-relaxed text-copy sm:text-base">
              Enter your Order ID below to see the real-time status of your inspection.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. BP-XA93KL"
              className="min-h-14 flex-1 rounded-2xl border border-surface-alt bg-white px-5 text-sm font-semibold text-heading placeholder:font-normal placeholder:text-subtle focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-8 font-display font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 sm:shrink-0"
            >
              Search
            </button>
          </form>

          <p className="text-xs text-muted">
            Your Order ID was sent to your WhatsApp and email after submitting.{' '}
            <Link href="/request" className="font-semibold text-primary hover:underline">
              Submit a new request →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Tracking view ───────────────────────────────────────────────────────────

function TrackingView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [request, setRequest] = useState<InspectionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState(orderId);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.getRequest(orderId)
      .then(setRequest)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim().toUpperCase();
    if (trimmed && trimmed !== orderId) router.push(`/track?orderid=${trimmed}`);
  }

  const isCancelled = request?.status === 'cancelled';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-6xl">

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8 flex gap-2 sm:gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Order ID"
              className="min-h-11 flex-1 rounded-full border border-surface-alt bg-white px-5 text-sm font-semibold text-heading placeholder:font-normal placeholder:text-subtle focus:border-primary focus:outline-none sm:max-w-xs"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </form>

          {loading ? (
            <div className="flex flex-col gap-5">
              <div className="h-8 w-48 animate-pulse rounded-xl bg-white shadow-sm" />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
                <div className="h-96 animate-pulse rounded-[1.875rem] bg-white shadow-sm" />
                <div className="h-64 animate-pulse rounded-[1.875rem] bg-white shadow-sm" />
              </div>
            </div>
          ) : notFound ? (
            <div className="flex flex-col items-center gap-5 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-heading">Order not found</p>
                <p className="mt-1 text-sm text-muted">
                  We couldn't find order <span className="font-semibold text-heading">{orderId}</span>. Double-check the ID and try again.
                </p>
              </div>
            </div>
          ) : request ? (
            <>
              {/* Page header */}
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-surface-alt bg-white px-3.5 py-1.5 shadow-sm">
                    <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    <span className="text-xs font-semibold text-muted">Order {request.orderId}</span>
                  </div>
                  <h1 className="font-display text-2xl font-black leading-tight text-heading sm:text-3xl lg:text-[2.5rem]">
                    Track your inspection
                  </h1>
                  <p className="max-w-md text-sm leading-relaxed text-copy sm:text-base">
                    {isCancelled
                      ? 'This inspection request has been cancelled.'
                      : 'Live status updates as your inspection progresses.'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1.5 md:items-end">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">Current Status</span>
                  {isCancelled ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                      Cancelled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-display text-sm font-bold text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
                      {statusLabel(request.status)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
                {/* Timeline */}
                <div className="rounded-[1.875rem] bg-white px-6 py-8 shadow-sm sm:px-8 lg:px-10">
                  <h2 className="mb-8 font-display text-lg font-bold text-heading">Journey Timeline</h2>
                  <div className="relative flex flex-col">
                    <div className="absolute left-[17px] top-5 bottom-5 w-0.5 bg-surface-alt" />
                    {STEPS.map((step, idx) => {
                      const state = isCancelled && step.key !== 'pending'
                        ? 'upcoming'
                        : stepState(step.key, request.status);
                      const isLast = idx === STEPS.length - 1;
                      return (
                        <div key={step.key} className={`flex gap-5 ${isLast ? '' : 'pb-8'}`}>
                          <StepDot state={state} />
                          <div className="pt-1.5">
                            <h3 className={`font-display text-base font-bold ${
                              state === 'active' ? 'text-blue-600' : state === 'done' ? 'text-heading' : 'text-muted'
                            }`}>
                              {step.label}
                            </h3>
                            <p className={`mt-0.5 text-sm ${state === 'upcoming' ? 'text-subtle' : 'text-muted'}`}>
                              {step.description}
                            </p>
                            {state === 'active' && request.assignedInspectorName && (
                              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-surface-alt px-4 py-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                  <svg className="h-5 w-5 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Assigned Inspector</p>
                                  <p className="text-sm font-semibold text-heading">{request.assignedInspectorName}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Side cards */}
                <div className="flex flex-col gap-4">
                  {/* Item details */}
                  <div className="rounded-[1.875rem] bg-white shadow-sm">
                    {request.screenshotUrl ? (
                      <img
                        src={request.screenshotUrl}
                        alt="Item screenshot"
                        className="h-44 w-full rounded-t-[1.875rem] object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-t-[1.875rem] bg-surface-alt">
                        <svg className="h-14 w-14 text-subtle/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col gap-4 px-6 py-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Item</p>
                        <p className="mt-1 font-display text-base font-bold text-heading line-clamp-2">
                          {request.productLink ?? 'Item details not provided'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-surface-alt px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Price</p>
                          <p className="mt-0.5 text-sm font-semibold text-heading">{formatNaira(request.itemPrice)}</p>
                        </div>
                        <div className="rounded-xl bg-surface-alt px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Seller</p>
                          <p className="mt-0.5 truncate text-sm font-semibold text-heading">{request.sellerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Need help */}
                  <a
                    href={`https://wa.me/2348000000000?text=Hi, I need help with order ${request.orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-[1.875rem] bg-white px-6 py-5 shadow-sm transition-colors hover:bg-surface-alt/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15">
                      <svg className="h-5 w-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.118 1.528 5.845L.057 23.454a.5.5 0 00.61.61l5.609-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.932 9.932 0 01-5.064-1.391l-.364-.216-3.768.988.988-3.768-.216-.364A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-sm font-bold text-heading">Need help?</p>
                      <p className="text-xs text-muted">Chat with a support officer</p>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Page entry ──────────────────────────────────────────────────────────────

function TrackPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderid')?.trim().toUpperCase() ?? '';

  if (!orderId) return <EmptyState />;
  return <TrackingView orderId={orderId} />;
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-alt border-t-primary" />
        </main>
        <Footer />
      </div>
    }>
      <TrackPageInner />
    </Suspense>
  );
}
