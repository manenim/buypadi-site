// landing-page/app/components/invoice/PublicInvoiceClient.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import Skeleton from '@/app/components/Skeleton';
import { api, getErrorMessage, type Invoice } from '@/app/lib/api';

function formatNaira(n: number | string) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function InvoiceNotFound({
  invoiceCode,
}: {
  invoiceCode?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <svg
          className="h-8 w-8 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm9-3.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="font-display text-lg font-bold text-heading">
          Invoice not found
        </p>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          {invoiceCode ? (
            <>
              We could not find invoice{' '}
              <span className="font-semibold text-heading">{invoiceCode}</span>.
              Double-check the code and try again.
            </>
          ) : (
            'This invoice link may be invalid or expired.'
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * Loading skeleton that mirrors <InvoiceDocument>: the header text, the white
 * invoice card (green banner + bill-to/details + line-item rows + total + pay
 * button) and the "Need help?" card — so the layout doesn't shift when the real
 * invoice arrives.
 */
export function InvoiceDocumentSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex max-w-5xl flex-col gap-6"
    >
      <span className="sr-only">Loading invoice…</span>

      {/* Header text */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-80 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      {/* Invoice card */}
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        {/* Green banner */}
        <div className="bg-primary px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* Bill to / document details */}
        <div className="grid gap-5 border-b border-surface-alt px-5 py-5 sm:grid-cols-2 sm:px-8">
          <div className="space-y-2.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-full max-w-56" />
          </div>
        </div>

        {/* Line items + total */}
        <div className="px-5 py-6 sm:px-8">
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-52 max-w-full" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <div className="flex items-center justify-between border-t-2 border-surface-alt pt-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-7 w-28" />
            </div>
          </div>
        </div>

        {/* Pay button */}
        <div className="px-5 py-6 sm:px-8 sm:pb-8">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </section>

      {/* Need help card */}
      <section className="rounded-[1.75rem] bg-white px-5 py-5 shadow-sm sm:px-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-12 w-full rounded-full sm:w-48" />
          <Skeleton className="h-12 w-full rounded-full sm:w-40" />
        </div>
      </section>
    </div>
  );
}

export function InvoiceDocument({
  invoice,
  paying = false,
  payError,
  onPay,
}: {
  invoice: Invoice;
  paying?: boolean;
  payError?: string | null;
  onPay?: () => void;
}) {
  const isPaid = invoice.status === 'paid';
  const receiptDate = isPaid ? invoice.updatedAt ?? invoice.createdAt : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            {isPaid ? 'Payment receipt' : 'Customer invoice'}
          </p>
          <h1 className="font-display text-3xl font-black leading-tight text-heading sm:text-[2.5rem]">
            {isPaid ? 'Receipt for your BuyPadi payment' : 'BuyPadi service invoice'}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-copy sm:text-base">
            {isPaid
              ? 'This invoice has been paid and can now be used as your official BuyPadi receipt.'
              : 'Review the charges for your inspection and delivery request before proceeding to payment.'}
          </p>
        </div>

      </div>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="bg-primary px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                {isPaid ? 'Receipt' : 'Invoice'}
              </p>
              <p className="font-display text-2xl font-black sm:text-3xl">
                {invoice.invoiceNumber}
              </p>
              <p className="text-sm font-semibold text-lime">
                Order {invoice.orderId}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <span
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold ${
                  isPaid
                    ? 'border-lime/35 bg-lime/20 text-lime'
                    : 'border-amber-300/35 bg-amber-300/15 text-amber-100'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPaid ? 'bg-lime' : 'bg-amber-200'
                  }`}
                />
                {isPaid ? 'PAID' : 'UNPAID'}
              </span>
              <p className="text-xs text-white/60">
                {isPaid
                  ? `Receipt issued ${formatDate(receiptDate)}`
                  : `Due ${formatDate(invoice.dueDate)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-b border-surface-alt px-5 py-5 sm:grid-cols-2 sm:px-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Bill to
            </p>
            <div className="space-y-1">
              <p className="font-display text-base font-bold text-heading">
                {invoice.customerName}
              </p>
              {invoice.customerEmail && (
                <p className="text-sm text-copy">{invoice.customerEmail}</p>
              )}
              <p className="text-sm text-copy">{invoice.customerWhatsapp}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Document details
            </p>
            <dl className="grid gap-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Invoice date</dt>
                <dd className="font-medium text-heading">
                  {formatDate(invoice.createdAt)}
                </dd>
              </div>
              {isPaid && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Payment confirmed</dt>
                  <dd className="font-medium text-heading">
                    {formatDate(receiptDate)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-alt text-xs uppercase tracking-wide text-muted">
                <th className="pb-3 text-left font-semibold">Service</th>
                <th className="pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-alt">
              <tr>
                <td className="py-4">
                  <p className="font-medium text-heading">Item Price</p>
                  <p className="text-xs text-muted">
                    Product amount from the inspection request
                  </p>
                </td>
                <td className="py-4 text-right font-semibold text-heading">
                  {formatNaira(invoice.itemPrice)}
                </td>
              </tr>
              <tr>
                <td className="py-4">
                  <p className="font-medium text-heading">Inspection Fee</p>
                  <p className="text-xs text-muted">
                    Professional physical inspection service
                  </p>
                </td>
                <td className="py-4 text-right font-semibold text-heading">
                  {formatNaira(invoice.inspectionFee)}
                </td>
              </tr>
              <tr>
                <td className="py-4">
                  <p className="font-medium text-heading">Delivery Fee</p>
                  <p className="text-xs text-muted">
                    Logistics and delivery coordination
                  </p>
                </td>
                <td className="py-4 text-right font-semibold text-heading">
                  {formatNaira(invoice.deliveryFee)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-surface-alt">
                <td className="pt-4 text-base font-black text-heading">
                  Total
                </td>
                <td className="pt-4 text-right font-display text-2xl font-black text-heading">
                  {formatNaira(invoice.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {invoice.notes && (
          <div className="px-5 pb-2 sm:px-8">
            <div className="rounded-2xl bg-lime-light px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Note
              </p>
              <p className="mt-1 text-sm leading-relaxed text-primary/80">
                {invoice.notes}
              </p>
            </div>
          </div>
        )}

        <div className="px-5 py-6 sm:px-8 sm:pb-8">
          {!isPaid ? (
            <>
              <button
                type="button"
                onClick={onPay}
                disabled={paying || !onPay}
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-lime px-6 text-center font-display text-lg font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {paying ? 'Redirecting...' : `Pay ${formatNaira(invoice.total)}`}
                {!paying && (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                )}
              </button>
              {payError && (
                <p className="mt-3 text-center text-xs text-red-500">
                  {payError}
                </p>
              )}
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-4 sm:justify-start">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  />
                </svg>
                <span className="text-sm font-semibold text-green-700">
                  Payment received. This page is your receipt.
                </span>
              </div>
              <Link
                href={`/track?orderid=${invoice.orderId}`}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                Track order
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white px-5 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Need help?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-copy">
          If you have any questions about this {isPaid ? 'receipt' : 'invoice'},
          reach out to BuyPadi support and quote{' '}
          <span className="font-semibold text-heading">
            {invoice.invoiceNumber}
          </span>
          .
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/234${invoice.customerWhatsapp.replace(/^0/, '')}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-surface-alt px-5 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
          >
            Message on WhatsApp
          </a>
          <a
            href="mailto:support@buypadi.ng"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Email support
          </a>
        </div>
      </section>
    </div>
  );
}

export default function PublicInvoiceClient({ token }: { token: string }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getInvoiceByToken(token)
      .then(setInvoice)
      .catch(() => setInvoice(null));
  }, [token]);

  async function handlePay() {
    if (!invoice) return;
    setPaying(true);
    setPayError(null);
    try {
      const { redirectUrl } = await api.initiatePayment(invoice.token);
      window.location.href = redirectUrl;
    } catch (err: unknown) {
      setPayError(
        getErrorMessage(err, 'Payment could not be started. Please try again.'),
      );
      setPaying(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        {invoice === undefined ? (
          <InvoiceDocumentSkeleton />
        ) : invoice ? (
          <InvoiceDocument
            invoice={invoice}
            onPay={handlePay}
            paying={paying}
            payError={payError}
          />
        ) : (
          <InvoiceNotFound />
        )}
      </main>
      <Footer />
    </div>
  );
}
