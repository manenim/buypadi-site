'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { api, type Invoice } from '@/app/lib/api';

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

export default function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    api.getInvoiceByToken(token)
      .then(setInvoice)
      .catch(() => null);
  }, [token]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-black text-heading sm:text-4xl">
              Payment successful!
            </h1>
            <p className="text-sm leading-relaxed text-copy sm:text-base">
              Thank you for your payment. Your BuyPadi inspection request is now being processed.
            </p>
          </div>

          {invoice && (
            <div className="w-full rounded-2xl bg-white px-5 py-5 shadow-sm text-left space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Invoice</span>
                <span className="font-semibold text-heading">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Order</span>
                <span className="font-semibold text-heading">{invoice.orderId}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm border-t border-surface-alt pt-3">
                <span className="text-muted">Amount paid</span>
                <span className="font-display text-xl font-black text-heading">{formatNaira(invoice.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
            <Link
              href="/track"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-8 font-display text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90"
            >
              Track your order
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-surface-alt px-8 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
