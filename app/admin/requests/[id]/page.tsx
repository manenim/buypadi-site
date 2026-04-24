// landing-page/app/admin/requests/[id]/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { InvoiceStatusBadge, RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import { api, type InspectionRequest, type Invoice, type CreateInvoicePayload } from '@/app/lib/api';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'scheduled', label: 'Inspection Scheduled' },
  { value: 'inspector_en_route', label: 'Inspector En Route' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-b border-surface-alt py-3 last:border-0 sm:flex-row sm:gap-3">
      <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:w-36 sm:pt-0.5">
        {label}
      </dt>
      <dd className="flex-1 break-words text-sm text-heading">
        {value || <span className="italic text-subtle">—</span>}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-surface-alt bg-surface px-5 py-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-heading">{title}</h2>
      </div>
      <div className="px-5 py-4"><dl>{children}</dl></div>
    </div>
  );
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);

  const [request, setRequest] = useState<InspectionRequest | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);

  const [inspectionFee, setInspectionFee] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  useEffect(() => {
    Promise.all([
      api.getRequest(orderId),
      api.getInvoiceByRequest(orderId),
    ])
      .then(([req, inv]) => {
        setRequest(req);
        setInvoice(inv);
      })
      .catch((err: Error) => {
        setFetchError(err.message ?? 'Failed to load request.');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleStatusChange(status: string) {
    if (!request) return;
    try {
      const updated = await api.updateRequestStatus(request.orderId, status);
      setRequest(updated);
    } catch (err: any) {
      console.error('Status update failed:', err);
    }
  }

  async function handleInspectorChange(name: string) {
    if (!request) return;
    try {
      // Reuse updateRequestStatus — UpdateStatusDto accepts assignedInspectorName without changing status
      const updated = await api.updateRequestStatus(request.orderId, request.status, name || undefined);
      setRequest(updated);
    } catch (err: any) {
      console.error('Inspector update failed:', err);
    }
  }

  async function handleSaveNotes(_notes: string) {
    // internalNotes not yet a backend entity field; UI-only for now
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleCreateInvoice() {
    if (!request) return;
    const parsedInspectionFee = parseFloat(inspectionFee) || 0;
    const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
    if (parsedInspectionFee + parsedDeliveryFee === 0) return;

    setSubmittingInvoice(true);
    try {
      const payload: CreateInvoicePayload = {
        requestId: request.orderId,
        orderId: request.orderId,
        inspectionFee: parsedInspectionFee,
        deliveryFee: parsedDeliveryFee,
        dueDate: new Date(dueDate).toISOString(),
        notes: invoiceNotes || undefined,
        customerName: request.buyerFullName,
        customerEmail: request.buyerEmail || undefined,
        customerWhatsapp: request.buyerWhatsapp,
      };
      const newInvoice = await api.createInvoice(payload);
      setInvoice(newInvoice);
      setCreatingInvoice(false);
    } catch (err: any) {
      console.error('Invoice creation failed:', err);
    } finally {
      setSubmittingInvoice(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-muted">Loading…</div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-red-500">
        {fetchError}
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-muted">
        Request not found.
        <Link href="/admin/requests" className="ml-1 text-primary hover:underline">← Back</Link>
      </div>
    );
  }

  const parsedInspectionFee = parseFloat(inspectionFee) || 0;
  const parsedDeliveryFee = parseFloat(deliveryFee) || 0;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-1">
        <Link href="/admin/requests" className="inline-flex min-h-10 items-center text-xs text-muted transition-colors hover:text-primary sm:min-h-0">
          ← All Requests
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">{request.orderId}</h1>
          <RequestStatusBadge status={request.status} />
          {invoice && <InvoiceStatusBadge status={invoice.status} />}
        </div>
        <p className="text-sm text-muted">
          Submitted{' '}
          {new Date(request.createdAt).toLocaleDateString('en-NG', {
            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)] lg:gap-6">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <Section title="Item Information">
            <InfoRow label="Product Link" value={request.productLink} />
            <InfoRow label="Item Price" value={formatNaira(request.itemPrice)} />
            <InfoRow label="Comments" value={request.comments} />
            {request.screenshotUrl && (
              <div className="py-3">
                <dt className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Screenshot</dt>
                <a href={request.screenshotUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface px-3 text-xs font-semibold text-primary hover:underline">
                  View attachment ↗
                </a>
              </div>
            )}
          </Section>

          <Section title="Buyer Information">
            <InfoRow label="Full Name" value={request.buyerFullName} />
            <InfoRow label="WhatsApp" value={request.buyerWhatsapp} />
            <InfoRow label="Email" value={request.buyerEmail} />
          </Section>

          <Section title="Seller Information">
            <InfoRow label="Store / Name" value={request.sellerName} />
            <InfoRow label="Phone" value={request.sellerPhone} />
            <InfoRow label="Address" value={request.sellerAddress} />
          </Section>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-alt bg-surface px-5 py-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Internal Notes</h2>
              {saved && <span className="text-xs font-semibold text-lime-dark">Saved ✓</span>}
            </div>
            <div className="px-5 py-4">
              <textarea
                rows={5}
                placeholder="Add internal notes visible only to admins…"
                onBlur={(e) => handleSaveNotes(e.target.value)}
                className="w-full resize-none rounded-xl border border-surface-alt bg-surface px-4 py-3 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none"
              />
              <p className="mt-1 text-xs text-subtle">Not yet persisted to backend</p>
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col gap-5 lg:order-2 lg:sticky lg:top-28 lg:self-start">
          {/* Status */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Update Status</h3>
            <div className="hidden flex-col gap-2 sm:flex">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleStatusChange(value)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    request.status === value
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-alt bg-surface text-copy hover:border-primary/30 hover:bg-surface-alt'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <select
              value={request.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full min-h-12 rounded-xl border border-surface-alt bg-surface px-3 text-sm font-medium text-heading transition-colors focus:border-lime focus:outline-none sm:hidden"
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Inspector */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Assign Inspector</h3>
            <input
              type="text"
              defaultValue={request.assignedInspectorName ?? ''}
              onBlur={(e) => handleInspectorChange(e.target.value)}
              placeholder="Inspector name…"
              className="w-full min-h-12 rounded-xl border border-surface-alt bg-surface px-3 text-sm text-heading transition-colors focus:border-lime focus:outline-none"
            />
          </div>

          {/* Invoice */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Invoice</h3>

            {invoice ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 rounded-xl bg-surface p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Number</span>
                    <span className="font-semibold text-heading">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Total</span>
                    <span className="font-semibold text-heading">{formatNaira(invoice.total)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Status</span>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                </div>
                <Link href={`/admin/invoices/${invoice.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary/20 py-2 text-center text-xs font-semibold text-primary transition-colors hover:bg-primary/5">
                  View Admin Invoice →
                </Link>
                <Link href={`/invoice/${invoice.token}`} target="_blank"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-lime/30 py-2 text-center text-xs font-semibold text-lime-dark transition-colors hover:bg-lime/5">
                  View Public Invoice ↗
                </Link>
              </div>
            ) : creatingInvoice ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Inspection Fee (₦)</label>
                  <input type="number" value={inspectionFee} onChange={(e) => setInspectionFee(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full min-h-11 rounded-xl border border-surface-alt bg-surface px-3 text-sm text-heading transition-colors focus:border-lime focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Delivery Fee (₦)</label>
                  <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)}
                    placeholder="e.g. 8000"
                    className="w-full min-h-11 rounded-xl border border-surface-alt bg-surface px-3 text-sm text-heading transition-colors focus:border-lime focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full min-h-11 rounded-xl border border-surface-alt bg-surface px-3 text-sm text-heading transition-colors focus:border-lime focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Notes (optional)</label>
                  <textarea rows={3} value={invoiceNotes} onChange={(e) => setInvoiceNotes(e.target.value)}
                    placeholder="Payment instructions, etc."
                    className="w-full resize-none rounded-xl border border-surface-alt bg-surface px-3 py-2 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none" />
                </div>

                {(parsedInspectionFee > 0 || parsedDeliveryFee > 0) && (
                  <div className="rounded-xl bg-primary/5 px-3 py-3 text-sm">
                    <div className="flex justify-between gap-3 text-muted">
                      <span>Inspection</span><span>{formatNaira(parsedInspectionFee)}</span>
                    </div>
                    <div className="mt-1 flex justify-between gap-3 text-muted">
                      <span>Delivery</span><span>{formatNaira(parsedDeliveryFee)}</span>
                    </div>
                    <div className="mt-2 flex justify-between gap-3 border-t border-primary/10 pt-2 font-bold text-heading">
                      <span>Total</span><span>{formatNaira(parsedInspectionFee + parsedDeliveryFee)}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={handleCreateInvoice}
                    disabled={parsedInspectionFee + parsedDeliveryFee === 0 || submittingInvoice}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submittingInvoice ? 'Creating…' : 'Create Invoice'}
                  </button>
                  <button onClick={() => setCreatingInvoice(false)}
                    className="min-h-11 rounded-xl border border-surface-alt px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted">No invoice created yet for this request.</p>
                <button onClick={() => setCreatingInvoice(true)}
                  className="min-h-11 rounded-xl bg-lime py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-dark">
                  + Create Invoice
                </button>
              </div>
            )}
          </div>

          <a href={`https://wa.me/234${request.buyerWhatsapp.replace(/^0/, '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
            <span>💬</span> Message Customer
          </a>
        </div>
      </div>
    </div>
  );
}
