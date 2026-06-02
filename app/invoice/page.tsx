'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import Spinner from '@/app/components/Spinner';
import {
  InvoiceDocument,
  InvoiceDocumentSkeleton,
  InvoiceNotFound,
} from '@/app/components/invoice/PublicInvoiceClient';
import { api, getErrorMessage, type Invoice } from '@/app/lib/api';

function InvoiceLookupEmpty() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (trimmed) router.push(`/invoice?code=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <svg
            viewBox="0 0 220 180"
            className="h-44 w-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="110" cy="90" r="78" fill="#EEFFD8" />
            <rect x="62" y="34" width="96" height="120" rx="14" fill="white" />
            <path
              d="M82 64h56M82 84h44M82 104h56M82 124h32"
              stroke="#D8E5D0"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <rect x="82" y="140" width="58" height="9" rx="4.5" fill="#8DC342" />
            <circle cx="158" cy="126" r="28" fill="#063B27" />
            <path
              d="m148 126 7 7 14-16"
              stroke="#8DC342"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-dark">
              Invoice lookup
            </p>
            <h1 className="font-display text-3xl font-black text-heading sm:text-4xl">
              Find your invoice or receipt
            </h1>
            <p className="text-sm leading-relaxed text-copy sm:text-base">
              Enter your secure invoice code to view payment details, outstanding
              charges, or your paid receipt.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. BPINV-A7K9-Q2T8-J4XR-6P3A"
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
            Looking for an inspection request instead?{' '}
            <Link href="/track" className="font-semibold text-primary hover:underline">
              Track an order
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InvoiceLookupView({ invoiceCode }: { invoiceCode: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(invoiceCode);
  const [invoiceState, setInvoiceState] = useState<{
    invoiceCode: string;
    invoice: Invoice | null;
    notFound: boolean;
  }>({ invoiceCode: '', invoice: null, notFound: false });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getInvoiceByCode(invoiceCode)
      .then((invoice) => {
        if (!cancelled) {
          setInvoiceState({ invoiceCode, invoice, notFound: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInvoiceState({ invoiceCode, invoice: null, notFound: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [invoiceCode]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim().toUpperCase();
    if (trimmed && trimmed !== invoiceCode) {
      setPayError(null);
      router.push(`/invoice?code=${encodeURIComponent(trimmed)}`);
    }
  }

  async function handlePay() {
    if (!invoiceState.invoice) return;
    setPaying(true);
    setPayError(null);
    try {
      const { redirectUrl } = await api.initiatePayment(invoiceState.invoice.token);
      window.location.href = redirectUrl;
    } catch (err: unknown) {
      setPayError(
        getErrorMessage(err, 'Payment could not be started. Please try again.'),
      );
      setPaying(false);
    }
  }

  const loading = invoiceState.invoiceCode !== invoiceCode;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <div className="mx-auto mb-8 max-w-5xl">
          <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Invoice code"
              className="min-h-11 flex-1 rounded-full border border-surface-alt bg-white px-5 text-sm font-semibold text-heading placeholder:font-normal placeholder:text-subtle focus:border-primary focus:outline-none sm:max-w-xs"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <InvoiceDocumentSkeleton />
        ) : invoiceState.notFound ? (
          <InvoiceNotFound invoiceCode={invoiceCode} />
        ) : invoiceState.invoice ? (
          <InvoiceDocument
            invoice={invoiceState.invoice}
            onPay={handlePay}
            paying={paying}
            payError={payError}
          />
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

function InvoicePageInner() {
  const searchParams = useSearchParams();
  const invoiceCode =
    searchParams.get('code')?.trim().toUpperCase() ??
    searchParams.get('number')?.trim().toUpperCase() ??
    '';

  if (!invoiceCode) return <InvoiceLookupEmpty />;
  return <InvoiceLookupView invoiceCode={invoiceCode} />;
}

export default function InvoiceLookupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-surface">
          <Navbar />
          <main className="flex flex-1 items-center justify-center">
            <Spinner label="Loading invoice…" />
          </main>
          <Footer />
        </div>
      }
    >
      <InvoicePageInner />
    </Suspense>
  );
}
