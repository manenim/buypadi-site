// landing-page/app/admin/requests/[id]/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { InvoiceStatusBadge, RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import ConfirmDialog from '@/app/components/admin/ConfirmDialog';
import { api, getErrorMessage, type InspectionRequest, type Invoice, type CreateInvoicePayload } from '@/app/lib/api';

// ─── Status config ────────────────────────────────────────────────────────────

// System-managed — admin cannot manually set these
const SYSTEM_STATUSES = new Set(['pending', 'payment_confirmed']);

// Numeric order for forward-only enforcement
const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  payment_confirmed: 1,
  scheduled: 2,
  inspector_en_route: 3,
  completed: 4,
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'scheduled', label: 'Inspection Scheduled' },
  { value: 'inspector_en_route', label: 'Inspector En Route' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

/** Can the admin transition from `from` to `to`? */
function canTransition(from: string, to: string): boolean {
  if (SYSTEM_STATUSES.has(to)) return false;                   // system-managed
  if (from === 'completed' || from === 'cancelled') return false; // terminal
  if (to === 'cancelled') return true;                          // always cancellable
  const fromIdx = STATUS_INDEX[from] ?? -1;
  const toIdx = STATUS_INDEX[to] ?? -1;
  return toIdx > fromIdx;                                       // forward-only
}

// ─── Product link row ─────────────────────────────────────────────────────────

function ProductLinkRow({ url }: { url?: string | null }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!url) {
    return (
      <div className="flex flex-col gap-1 border-b border-surface-alt py-3 last:border-0 sm:flex-row sm:gap-3">
        <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:w-36 sm:pt-0.5">
          Product Link
        </dt>
        <dd className="text-sm italic text-subtle">—</dd>
      </div>
    );
  }

  const display = url.length > 48 ? `${url.slice(0, 45)}…` : url;

  return (
    <div className="flex flex-col gap-1 border-b border-surface-alt py-3 last:border-0 sm:flex-row sm:gap-3">
      <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:w-36 sm:pt-0.5">
        Product Link
      </dt>
      <dd className="flex min-w-0 flex-1 items-center gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={url}
          className="min-w-0 flex-1 truncate text-sm font-medium text-primary hover:underline"
        >
          {display}
        </a>
        <button
          type="button"
          onClick={copyLink}
          title="Copy link"
          className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-heading"
        >
          {copied ? (
            <svg className="h-4 w-4 text-lime-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.375" />
            </svg>
          )}
        </button>
      </dd>
    </div>
  );
}

// ─── Shared InfoRow ───────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);

  const [request, setRequest] = useState<InspectionRequest | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Confirmation state: which status the admin wants to transition to
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const [inspectionFee, setInspectionFee] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  useEffect(() => {
    Promise.all([api.getRequest(orderId), api.getInvoiceByRequest(orderId)])
      .then(([req, inv]) => { setRequest(req); setInvoice(inv); })
      .catch((err: Error) => setFetchError(err.message ?? 'Failed to load request.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function executeStatusChange(status: string) {
    if (!request) return;
    setMutationError(null);
    try {
      const updated = await api.updateRequestStatus(request.orderId, status);
      setRequest(updated);
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to update status. Please try again.'));
    }
  }

  async function handleInspectorChange(name: string) {
    if (!request) return;
    setMutationError(null);
    try {
      const updated = await api.updateRequestStatus(request.orderId, request.status, name || undefined);
      setRequest(updated);
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to update inspector. Please try again.'));
    }
  }

  async function handleSaveNotes() {
    // internalNotes not yet a backend entity field; UI-only for now
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleCreateInvoice() {
    if (!request) return;
    const parsedInspectionFee = parseFloat(inspectionFee) || 0;
    const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
    if (parsedInspectionFee + parsedDeliveryFee === 0) return;

    setMutationError(null);
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
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to create invoice. Please try again.'));
    } finally {
      setSubmittingInvoice(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-sm text-muted">Loading…</div>;
  if (fetchError) return <div className="flex items-center justify-center py-32 text-sm text-red-500">{fetchError}</div>;
  if (!request) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-muted">
        Request not found.
        <Link href="/admin/requests" className="ml-1 text-primary hover:underline">← Back</Link>
      </div>
    );
  }

  const isTerminal = request.status === 'completed' || request.status === 'cancelled';
  const parsedInspectionFee = parseFloat(inspectionFee) || 0;
  const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
  const pendingStatusLabel = STATUS_OPTIONS.find((o) => o.value === pendingStatus)?.label ?? pendingStatus;

  return (
    <>
      {/* Confirmation dialog for status change */}
      {pendingStatus && (
        <ConfirmDialog
          title={`Update status to "${pendingStatusLabel}"?`}
          message={
            pendingStatus === 'cancelled'
              ? 'This will cancel the inspection request. This action cannot be undone.'
              : `Move this request to "${pendingStatusLabel}". Status changes cannot be reversed.`
          }
          confirmLabel="Yes, update status"
          variant={pendingStatus === 'cancelled' ? 'warning' : 'default'}
          onConfirm={async () => {
            const status = pendingStatus;
            setPendingStatus(null);
            await executeStatusChange(status);
          }}
          onCancel={() => setPendingStatus(null)}
        />
      )}

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
          {/* ── Left column ── */}
          <div className="order-2 flex flex-col gap-5 lg:order-1">
            <Section title="Item Information">
              <ProductLinkRow url={request.productLink} />
              <InfoRow label="Item Price" value={`₦${Number(request.itemPrice).toLocaleString('en-NG')}`} />
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
                <textarea rows={5} placeholder="Add internal notes visible only to admins…"
                  onBlur={() => handleSaveNotes()}
                  className="w-full resize-none rounded-xl border border-surface-alt bg-surface px-4 py-3 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none" />
                <p className="mt-1 text-xs text-subtle">Not yet persisted to backend</p>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="order-1 flex flex-col gap-5 lg:order-2 lg:sticky lg:top-28 lg:self-start">

            {/* Status panel */}
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Update Status</h3>

              {isTerminal ? (
                <p className="rounded-xl bg-surface px-3 py-3 text-xs text-muted">
                  This request is <span className="font-semibold text-heading">{request.status}</span> — no further status changes.
                </p>
              ) : (
                <>
                  {/* Desktop buttons */}
                  <div className="hidden flex-col gap-2 sm:flex">
                    {STATUS_OPTIONS.map(({ value, label }) => {
                      const isCurrent = request.status === value;
                      const isSystem = SYSTEM_STATUSES.has(value);
                      const canDo = canTransition(request.status, value);

                      if (isCurrent) {
                        return (
                          <div key={value}
                            className="rounded-xl border border-primary bg-primary px-3 py-2.5 text-sm font-medium text-white">
                            {label}
                          </div>
                        );
                      }

                      if (isSystem) {
                        return (
                          <div key={value}
                            className="flex items-center justify-between rounded-xl border border-surface-alt px-3 py-2.5 opacity-40">
                            <span className="text-sm text-copy">{label}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Auto</span>
                          </div>
                        );
                      }

                      if (!canDo) {
                        return (
                          <div key={value}
                            className="rounded-xl border border-surface-alt px-3 py-2.5 text-sm text-subtle opacity-50 cursor-not-allowed">
                            {label}
                          </div>
                        );
                      }

                      return (
                        <button key={value}
                          onClick={() => setPendingStatus(value)}
                          className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                            value === 'cancelled'
                              ? 'border-red-100 bg-surface text-copy hover:border-red-300 hover:bg-red-50 hover:text-red-600'
                              : 'border-surface-alt bg-surface text-copy hover:border-primary/30 hover:bg-surface-alt'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile select — only shows valid transitions */}
                  <select
                    value={request.status}
                    onChange={(e) => {
                      if (canTransition(request.status, e.target.value)) {
                        setPendingStatus(e.target.value);
                      }
                    }}
                    className="w-full min-h-12 rounded-xl border border-surface-alt bg-surface px-3 text-sm font-medium text-heading transition-colors focus:border-lime focus:outline-none sm:hidden"
                  >
                    {STATUS_OPTIONS.filter(
                      ({ value }) => value === request.status || canTransition(request.status, value)
                    ).map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {/* Inspector */}
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Assign Inspector</h3>
              <input type="text" defaultValue={request.assignedInspectorName ?? ''}
                onBlur={(e) => handleInspectorChange(e.target.value)}
                placeholder="Inspector name…"
                className="w-full min-h-12 rounded-xl border border-surface-alt bg-surface px-3 text-sm text-heading transition-colors focus:border-lime focus:outline-none" />
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
                      <span className="font-semibold text-heading">₦{Number(invoice.total).toLocaleString('en-NG')}</span>
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
                        <span>Inspection</span><span>₦{parsedInspectionFee.toLocaleString('en-NG')}</span>
                      </div>
                      <div className="mt-1 flex justify-between gap-3 text-muted">
                        <span>Delivery</span><span>₦{parsedDeliveryFee.toLocaleString('en-NG')}</span>
                      </div>
                      <div className="mt-2 flex justify-between gap-3 border-t border-primary/10 pt-2 font-bold text-heading">
                        <span>Total</span><span>₦{(parsedInspectionFee + parsedDeliveryFee).toLocaleString('en-NG')}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button onClick={handleCreateInvoice}
                      disabled={parsedInspectionFee + parsedDeliveryFee === 0 || submittingInvoice}
                      className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">
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

            {mutationError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">{mutationError}</p>
            )}

            <a href={`https://wa.me/234${(request.buyerWhatsapp ?? '').replace(/^0/, '')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
              <span>💬</span> Message Customer
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
