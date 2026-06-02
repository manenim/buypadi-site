'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { api, type Invoice } from '@/app/lib/api';

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 20;

type VerificationState = 'verifying' | 'successful' | 'failed';

function formatNaira(n: number | string) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function StatusIcon({ state }: { state: VerificationState }) {
  if (state === 'verifying') {
    return (
      <span className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-lime-light">
        <span className="absolute h-full w-full animate-ping rounded-full bg-lime/20" />
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lime">
          <svg
            className="h-8 w-8 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </span>
      </span>
    );
  }

  if (state === 'successful') {
    return (
      <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-lime-light text-primary">
        <svg
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.4}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-700">
      <svg
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.4}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8.25v4.5m0 3h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </span>
  );
}

function InvoiceSummary({ invoice }: { invoice: Invoice }) {
  return (
    <dl className="grid w-full gap-4 border-y border-primary/10 py-5 text-left sm:grid-cols-3">
      <div className="space-y-1">
        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Invoice code
        </dt>
        <dd className="font-display text-base font-bold text-heading">
          {invoice.invoiceNumber}
        </dd>
      </div>
      <div className="space-y-1">
        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Order
        </dt>
        <dd className="font-display text-base font-bold text-heading">
          {invoice.orderId}
        </dd>
      </div>
      <div className="space-y-1 sm:text-right">
        <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Amount
        </dt>
        <dd className="font-display text-xl font-black text-heading">
          {formatNaira(invoice.total)}
        </dd>
      </div>
    </dl>
  );
}

export default function PaymentConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [state, setState] = useState<VerificationState>('verifying');
  const [attempts, setAttempts] = useState(0);
  const [pollRun, setPollRun] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function checkPaymentStatus(attempt: number) {
      try {
        const result = await api.getPaymentStatus(token);
        if (cancelled) return;

        setInvoice(result.invoice);
        setAttempts(attempt);

        if (result.paymentStatus === 'successful') {
          setState('successful');
          return;
        }

        if (result.paymentStatus === 'failed' || attempt >= MAX_ATTEMPTS) {
          setState('failed');
          return;
        }
      } catch {
        if (cancelled) return;

        setAttempts(attempt);
        if (attempt >= MAX_ATTEMPTS) {
          setState('failed');
          return;
        }
      }

      timer = setTimeout(
        () => checkPaymentStatus(attempt + 1),
        POLL_INTERVAL_MS,
      );
    }

    void checkPaymentStatus(1);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pollRun, token]);

  function handleRetry() {
    setState('verifying');
    setAttempts(0);
    setPollRun((value) => value + 1);
  }

  const copy = {
    verifying: {
      eyebrow: 'Payment verification',
      title: 'Confirming your payment',
      body: 'We are checking the payment update from Accelerate. This usually takes a few seconds.',
    },
    successful: {
      eyebrow: 'Payment confirmed',
      title: 'Payment successful',
      body: 'Your payment has been saved and your BuyPadi inspection request is now being processed.',
    },
    failed: {
      eyebrow: 'Payment not confirmed',
      title: 'We could not confirm this payment',
      body: 'If your account was debited, please contact support with your invoice code so we can reconcile it quickly.',
    },
  }[state];

  const progress = Math.min(100, Math.round((attempts / MAX_ATTEMPTS) * 100));

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-12">
        <section
          className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-sm lg:grid-cols-[0.82fr_1.18fr]"
          aria-live="polite"
        >
          <div className="flex min-h-[18rem] flex-col justify-between bg-primary px-6 py-7 text-white sm:px-8 lg:px-10">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime">
                BuyPadi checkout
              </p>
              <h1 className="max-w-sm font-display text-3xl font-black leading-tight sm:text-4xl">
                Secure payment confirmation
              </h1>
            </div>
            <div className="mt-10 space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-lime transition-all duration-500"
                  style={{ width: `${state === 'successful' ? 100 : progress}%` }}
                />
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                {state === 'verifying'
                  ? `Verification attempt ${Math.max(attempts, 1)} of ${MAX_ATTEMPTS}`
                  : 'Verification complete'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10 lg:px-12">
            <StatusIcon state={state} />

            <div className="max-w-xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-dark">
                {copy.eyebrow}
              </p>
              <h2 className="font-display text-3xl font-black leading-tight text-heading sm:text-4xl">
                {copy.title}
              </h2>
              <p className="text-sm leading-relaxed text-copy sm:text-base">
                {copy.body}
              </p>
            </div>

            {invoice && <InvoiceSummary invoice={invoice} />}

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              {state === 'successful' ? (
                <Link
                  href="/track"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-8 font-display text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90"
                >
                  Track your order
                </Link>
              ) : state === 'failed' ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-8 font-display text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90"
                >
                  Check again
                </button>
              ) : null}

              <Link
                href={`/invoice/${token}`}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-surface-alt px-8 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
              >
                Back to invoice
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
