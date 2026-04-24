// landing-page/app/components/invoice/PublicInvoiceClient.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { api, type Invoice } from '@/app/lib/api';

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InvoiceNotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[1.875rem] bg-white px-6 py-10 text-center shadow-sm sm:px-8">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-alt text-primary">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm9-3.75a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-black text-heading">Invoice not found</h1>
            <p className="text-sm leading-relaxed text-copy sm:text-base">
              This invoice link may be invalid or expired.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
              Go to homepage
            </Link>
            <a href="mailto:support@buypadi.ng"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-surface-alt px-6 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary">
              Contact support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PublicInvoiceClient({ token }: { token: string }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    api.getInvoiceByToken(token)
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
    } catch (err: any) {
      setPayError(err.message ?? 'Payment could not be started. Please try again.');
      setPaying(false);
    }
  }

  if (invoice === undefined) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-12 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-3xl rounded-[1.875rem] bg-white px-6 py-10 shadow-sm sm:px-8">
            <p className="text-sm text-muted">Loading invoice…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!invoice) return <InvoiceNotFound />;

  const isPaid = invoice.status === 'paid';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Customer invoice</p>
            <h1 className="font-display text-3xl font-black leading-tight text-heading sm:text-[2.5rem]">
              BuyPadi service invoice
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-copy sm:text-base">
              Review the charges for your inspection and delivery request before proceeding to payment.
            </p>
          </div>

          <div className="overflow-hidden rounded-4xl bg-white shadow-sm">
            <div className="bg-primary px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Invoice</p>
                  <p className="font-display text-2xl font-black text-white sm:text-3xl">{invoice.invoiceNumber}</p>
                  <p className="text-sm font-semibold text-lime">Order {invoice.orderId}</p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold ${
                    isPaid ? 'border-lime/30 bg-lime/20 text-lime' : 'border-orange-400/30 bg-orange-400/20 text-orange-200'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${isPaid ? 'bg-lime' : 'bg-orange-300'}`} />
                    {isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                  <p className="text-xs text-white/60">Due {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 border-b border-surface-alt px-5 py-5 sm:grid-cols-2 sm:px-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Bill to</p>
                <div className="space-y-1">
                  <p className="font-display text-base font-bold text-heading">{invoice.customerName}</p>
                  {invoice.customerEmail && <p className="text-sm text-copy">{invoice.customerEmail}</p>}
                  <p className="text-sm text-copy">{invoice.customerWhatsapp}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Service summary</p>
                <div className="space-y-1">
                  <p className="text-sm text-copy">Inspection and delivery coordination by BuyPadi.ng</p>
                  <p className="text-sm font-medium text-heading">Invoice date: {formatDate(invoice.createdAt)}</p>
                </div>
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
                      <p className="font-medium text-heading">Inspection Fee</p>
                      <p className="text-xs text-muted">Professional physical inspection service</p>
                    </td>
                    <td className="py-4 text-right font-semibold text-heading">{formatNaira(invoice.inspectionFee)}</td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <p className="font-medium text-heading">Delivery Fee</p>
                      <p className="text-xs text-muted">Logistics and delivery coordination</p>
                    </td>
                    <td className="py-4 text-right font-semibold text-heading">{formatNaira(invoice.deliveryFee)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-surface-alt">
                    <td className="pt-4 text-base font-black text-heading">Total</td>
                    <td className="pt-4 text-right font-display text-2xl font-black text-heading">{formatNaira(invoice.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {invoice.notes && (
              <div className="px-5 pb-2 sm:px-8">
                <div className="rounded-2xl bg-lime-light px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">Note</p>
                  <p className="mt-1 text-sm leading-relaxed text-primary/80">{invoice.notes}</p>
                </div>
              </div>
            )}

            <div className="px-5 py-6 sm:px-8 sm:pb-8">
              {!isPaid ? (
                <>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={paying}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-lime px-6 text-center font-display text-lg font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {paying ? 'Redirecting…' : `Pay ${formatNaira(invoice.total)}`}
                    {!paying && (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                  </button>
                  {payError && (
                    <p className="mt-3 text-center text-xs text-red-500">{payError}</p>
                  )}
                </>
              ) : (
                <div className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-4">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">Payment received. Thank you.</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white px-5 py-5 shadow-sm sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Need help?</p>
            <p className="mt-2 text-sm leading-relaxed text-copy">
              If you have any questions about this invoice, reach out to BuyPadi support and quote{' '}
              <span className="font-semibold text-heading">{invoice.invoiceNumber}</span>.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a href={`https://wa.me/234${invoice.customerWhatsapp.replace(/^0/, '')}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-surface-alt px-5 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary">
                Message on WhatsApp
              </a>
              <a href="mailto:support@buypadi.ng"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                Email support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
