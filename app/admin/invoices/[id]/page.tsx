// landing-page/app/admin/invoices/[id]/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { InvoiceStatusBadge } from '@/app/components/admin/StatusBadge';
import ConfirmDialog from '@/app/components/admin/ConfirmDialog';
import { api, getErrorMessage, type Invoice } from '@/app/lib/api';

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Confirmation dialog state
  const [confirm, setConfirm] = useState<{ action: 'paid' | 'unpaid' } | null>(null);

  useEffect(() => {
    api.getInvoice(id)
      .then(setInvoice)
      .catch((err: Error) => {
        setFetchError(err.message ?? 'Failed to load invoice.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function executeStatusChange(status: 'paid' | 'unpaid') {
    if (!invoice) return;
    setMutationError(null);
    try {
      const updated = await api.updateInvoiceStatus(invoice.id, status);
      setInvoice(updated);
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to update status. Please try again.'));
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-32 text-sm text-muted">Loading…</div>;
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-red-500">
        {fetchError}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-muted">
        Invoice not found.
        <Link href="/admin/requests" className="ml-1 text-primary hover:underline">← Back to Requests</Link>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation dialog */}
      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'paid' ? 'Mark invoice as paid?' : 'Mark invoice as unpaid?'}
          message={
            confirm.action === 'paid'
              ? `This will mark invoice ${invoice.invoiceNumber} as paid. Only do this if you have verified the payment.`
              : `This will mark invoice ${invoice.invoiceNumber} as unpaid again. The customer will see it as outstanding.`
          }
          confirmLabel={confirm.action === 'paid' ? 'Yes, mark as paid' : 'Yes, mark as unpaid'}
          variant={confirm.action === 'unpaid' ? 'warning' : 'default'}
          onConfirm={async () => {
            const action = confirm.action;
            setConfirm(null);
            await executeStatusChange(action);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex max-w-4xl flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/requests" className="inline-flex min-h-10 items-center text-xs text-muted transition-colors hover:text-primary sm:min-h-0">
            ← Requests
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">{invoice.invoiceNumber}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-sm text-muted">For order {invoice.orderId} · Created {formatDate(invoice.createdAt)}</p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-surface-alt bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Invoice Details</h2>
            <div className="flex items-center gap-2">
              {invoice.status === 'unpaid' ? (
                <button
                  onClick={() => setConfirm({ action: 'paid' })}
                  className="min-h-10 rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-200"
                >
                  Mark as Paid
                </button>
              ) : (
                <button
                  onClick={() => setConfirm({ action: 'unpaid' })}
                  className="min-h-10 rounded-full border border-surface-alt bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-surface-alt"
                >
                  Mark as Unpaid
                </button>
              )}
            </div>
          </div>

          {mutationError && (
            <div className="mx-4 mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 sm:mx-6">
              {mutationError}
            </div>
          )}

          <div className="grid gap-x-8 gap-y-3 px-4 py-5 sm:grid-cols-2 sm:px-6">
            {[
              { label: 'Invoice Number', value: invoice.invoiceNumber },
              { label: 'Order ID', value: invoice.orderId },
              { label: 'Customer', value: invoice.customerName },
              { label: 'Email', value: invoice.customerEmail ?? '—' },
              { label: 'WhatsApp', value: invoice.customerWhatsapp },
              { label: 'Due Date', value: formatDate(invoice.dueDate) },
              { label: 'Created', value: formatDate(invoice.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
                <span className="text-sm font-medium text-heading">{value}</span>
              </div>
            ))}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Status</span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>

          {invoice.notes && (
            <div className="px-4 pb-5 sm:px-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Notes</span>
              <p className="mt-1 text-sm text-copy">{invoice.notes}</p>
            </div>
          )}

          <div className="mx-4 border-t border-surface-alt pt-4 pb-5 sm:mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted">
                  <th className="py-1 text-left font-semibold">Description</th>
                  <th className="py-1 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-alt">
                <tr>
                  <td className="py-3 text-copy">Inspection Fee</td>
                  <td className="py-3 text-right font-medium text-heading">{formatNaira(invoice.inspectionFee)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-copy">Delivery Fee</td>
                  <td className="py-3 text-right font-medium text-heading">{formatNaira(invoice.deliveryFee)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-surface-alt">
                  <td className="pt-3 font-bold text-heading">Total</td>
                  <td className="pt-3 text-right font-display text-xl font-black text-heading">{formatNaira(invoice.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Shareable Links</h3>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Public Invoice URL</p>
            <div className="flex flex-col gap-2 rounded-xl bg-surface px-3 py-3 sm:flex-row sm:items-center">
              <span className="flex-1 break-all font-mono text-xs text-copy">/invoice/{invoice.token}</span>
              <Link href={`/invoice/${invoice.token}`} target="_blank"
                className="shrink-0 text-xs font-semibold text-lime-dark hover:underline">
                Open ↗
              </Link>
            </div>
          </div>
          <Link href={`/admin/requests/${invoice.requestId}`}
            className="mt-1 text-xs font-semibold text-primary hover:underline">
            ← View Request {invoice.orderId}
          </Link>
        </div>
      </div>
    </>
  );
}
