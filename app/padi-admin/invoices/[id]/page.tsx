// landing-page/app/padi-admin/invoices/[id]/page.tsx
'use client';

import { use, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import AdminNotFoundState from '@/app/components/admin/AdminNotFoundState';
import ConfirmDialog from '@/app/components/admin/ConfirmDialog';
import Skeleton from '@/app/components/Skeleton';
import {
  InvoiceStatusBadge,
  RequestStatusBadge,
} from '@/app/components/admin/StatusBadge';
import {
  api,
  getErrorMessage,
  isNotFoundError,
  type InspectionRequest,
  type Invoice,
} from '@/app/lib/api';

type InvoiceAction = 'paid' | 'unpaid';

function formatNaira(n: number | string) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isOverdue(invoice: Invoice) {
  return invoice.status === 'unpaid' && new Date(invoice.dueDate).getTime() < Date.now();
}

function getDaysUntilDue(invoice: Invoice) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(invoice.dueDate);
  due.setHours(0, 0, 0, 0);

  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function getWhatsAppUrl(invoice: Invoice) {
  const digits = (invoice.customerWhatsapp ?? '').replace(/\D/g, '');
  const normalized = digits.startsWith('234')
    ? digits
    : digits.startsWith('0')
      ? `234${digits.slice(1)}`
      : digits;
  const message = encodeURIComponent(
    `Hi ${invoice.customerName}, this is BuyPadi about invoice ${invoice.invoiceNumber} for order ${invoice.orderId}.`,
  );

  return `https://wa.me/${normalized}?text=${message}`;
}

function Panel({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-surface-alt bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-surface-alt px-4 py-4 sm:px-5">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 font-display text-base font-bold text-heading">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value?: ReactNode;
  href?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      {href && typeof value === 'string' ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block truncate text-sm font-semibold text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <div className="mt-1 break-words text-sm font-medium text-heading">
          {value || <span className="italic text-subtle">Not provided</span>}
        </div>
      )}
    </div>
  );
}

function CopyButton({
  value,
  children,
  onCopied,
}: {
  value: string;
  children: ReactNode;
  onCopied: (label: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        onCopied('Copied');
      }}
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
    >
      {children}
    </button>
  );
}

function InvoiceDocumentPanel({ invoice }: { invoice: Invoice }) {
  const lines = [
    {
      label: 'Item price',
      description: 'Customer declared product amount',
      amount: invoice.itemPrice,
    },
    {
      label: 'Inspection fee',
      description: 'Professional product inspection and verification',
      amount: invoice.inspectionFee,
    },
    {
      label: 'Delivery fee',
      description: 'Delivery coordination and logistics support',
      amount: invoice.deliveryFee,
    },
  ];

  return (
    <Panel title="Invoice document" eyebrow="Line items">
      <div className="px-4 py-4 sm:px-5">
        <div className="overflow-hidden rounded-lg border border-surface-alt">
          <div className="grid grid-cols-[minmax(0,1fr)_9rem] bg-surface px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="divide-y divide-surface-alt">
            {lines.map((line) => (
              <div
                key={line.label}
                className="grid grid-cols-[minmax(0,1fr)_9rem] gap-4 px-4 py-4"
              >
                <div>
                  <p className="text-sm font-bold text-heading">{line.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {line.description}
                  </p>
                </div>
                <p className="text-right text-sm font-semibold text-heading">
                  {formatNaira(line.amount)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-4 border-t border-surface-alt bg-primary px-4 py-4 text-white">
            <p className="font-display text-base font-black">Total due</p>
            <p className="text-right font-display text-xl font-black">
              {formatNaira(invoice.total)}
            </p>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-4 rounded-lg bg-lime-light px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Invoice note
            </p>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">
              {invoice.notes}
            </p>
          </div>
        )}
      </div>
    </Panel>
  );
}

function PaymentControlPanel({
  invoice,
  busy,
  onConfirm,
}: {
  invoice: Invoice;
  busy: boolean;
  onConfirm: (action: InvoiceAction) => void;
}) {
  const paid = invoice.status === 'paid';

  return (
    <Panel title="Payment controls" eyebrow="Reconciliation">
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <div
          className={`rounded-lg px-4 py-3 ${
            paid ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
          }`}
        >
          <p className="text-sm font-bold">
            {paid ? 'Payment is confirmed' : 'Payment is outstanding'}
          </p>
          <p className="mt-1 text-xs leading-relaxed opacity-80">
            {paid
              ? 'The linked request is eligible to move into scheduling.'
              : 'Keep this unpaid unless you have verified payment outside the gateway.'}
          </p>
        </div>

        <div className="grid gap-2">
          {paid ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onConfirm('unpaid')}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark as unpaid
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => onConfirm('paid')}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark as paid
            </button>
          )}
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Manual changes sync the linked inspection request payment state. Use
          this only for reconciled bank/gateway issues.
        </p>
      </div>
    </Panel>
  );
}

function SharePanel({
  invoice,
  copiedLabel,
  onCopied,
}: {
  invoice: Invoice;
  copiedLabel: string | null;
  onCopied: (label: string) => void;
}) {
  const publicPath = `/invoice/${invoice.token}`;
  const publicUrl =
    typeof window === 'undefined' ? publicPath : `${window.location.origin}${publicPath}`;

  return (
    <Panel title="Share and actions" eyebrow="Customer link">
      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div className="rounded-lg bg-surface px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Public invoice URL
          </p>
          <p className="mt-2 break-all font-mono text-xs text-copy">{publicPath}</p>
        </div>

        {copiedLabel && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
            {copiedLabel}
          </p>
        )}

        <div className="grid gap-2">
          <Link
            href={publicPath}
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Open public invoice
          </Link>
          <CopyButton value={publicUrl} onCopied={onCopied}>
            Copy public link
          </CopyButton>
          <CopyButton value={invoice.invoiceNumber} onCopied={onCopied}>
            Copy invoice code
          </CopyButton>
          <a
            href={getWhatsAppUrl(invoice)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#128C4A] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0F7C42]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.142-4.03 7.5-9 7.5a10.26 10.26 0 0 1-3.03-.453L3 21l1.953-4.884A6.75 6.75 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z" />
            </svg>
            Message customer
          </a>
        </div>
      </div>
    </Panel>
  );
}

function CustomerPanel({ invoice }: { invoice: Invoice }) {
  return (
    <Panel title="Customer and invoice details" eyebrow="Billing record">
      <div className="grid gap-5 px-4 py-4 sm:grid-cols-2 sm:px-5">
        <Field label="Customer" value={invoice.customerName} />
        <Field label="WhatsApp" value={invoice.customerWhatsapp} />
        <Field
          label="Email"
          value={invoice.customerEmail ?? 'Not provided'}
          href={invoice.customerEmail ? `mailto:${invoice.customerEmail}` : undefined}
        />
        <Field label="Invoice code" value={invoice.invoiceNumber} />
        <Field label="Created" value={formatDate(invoice.createdAt)} />
        <Field label="Due date" value={formatDate(invoice.dueDate)} />
      </div>
    </Panel>
  );
}

function RelatedRequestPanel({
  invoice,
  request,
}: {
  invoice: Invoice;
  request: InspectionRequest | null;
}) {
  return (
    <Panel
      title="Linked request"
      eyebrow="Operational sync"
      action={
        <Link
          href={`/padi-admin/requests/${invoice.requestId}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Open request
        </Link>
      }
    >
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-5">
        <Field label="Order ID" value={invoice.orderId} />
        {request ? (
          <>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                Request status
              </p>
              <div className="mt-1">
                <RequestStatusBadge status={request.status} />
              </div>
            </div>
            <Field label="Inspector" value={request.assignedInspectorName ?? 'Unassigned'} />
            <Field label="Item value" value={formatNaira(request.itemPrice)} />
          </>
        ) : (
          <p className="text-sm text-muted sm:col-span-2">
            The invoice loaded, but the linked request could not be fetched.
          </p>
        )}
      </div>
    </Panel>
  );
}

function TimelinePanel({ invoice }: { invoice: Invoice }) {
  const steps = [
    {
      label: 'Invoice created',
      detail: formatDate(invoice.createdAt),
      done: true,
    },
    {
      label: invoice.status === 'paid' ? 'Payment confirmed' : 'Payment pending',
      detail:
        invoice.status === 'paid'
          ? formatDate(invoice.updatedAt)
          : `Due ${formatDate(invoice.dueDate)}`,
      done: invoice.status === 'paid',
    },
    {
      label: 'Request sync',
      detail:
        invoice.status === 'paid'
          ? 'Inspection request can be scheduled'
          : 'Request remains payment-gated',
      done: invoice.status === 'paid',
    },
  ];

  return (
    <Panel title="Invoice timeline" eyebrow="Audit view">
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {steps.map((step) => (
          <div key={step.label} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
            <span
              className={`mt-1 h-3 w-3 rounded-full ${
                step.done ? 'bg-lime' : 'bg-surface-alt'
              }`}
            />
            <div>
              <p className="text-sm font-bold text-heading">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

/** Bordered card matching the `Panel` chrome, with skeleton header + body rows. */
function SkeletonPanel({ bodyRows = 3 }: { bodyRows?: number }) {
  return (
    <section className="rounded-lg border border-surface-alt bg-white shadow-sm">
      <div className="border-b border-surface-alt px-4 py-4 sm:px-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-5 w-44" />
      </div>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {Array.from({ length: bodyRows }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full max-w-xs" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mirrors the AdminInvoicePage layout (header + two-column panel grid) while
 *  the invoice loads, so the page doesn't jump when real data arrives. */
function InvoiceSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-6">
      <span className="sr-only">Loading invoice…</span>

      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-28" />
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-11 w-40 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
      </div>

      {/* Panel grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.75fr)]">
        <div className="space-y-6">
          <SkeletonPanel bodyRows={4} />
          <SkeletonPanel bodyRows={3} />
          <SkeletonPanel bodyRows={2} />
        </div>
        <div className="space-y-6">
          <SkeletonPanel bodyRows={3} />
          <SkeletonPanel bodyRows={3} />
          <SkeletonPanel bodyRows={3} />
        </div>
      </div>
    </div>
  );
}

export default function AdminInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [request, setRequest] = useState<InspectionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ action: InvoiceAction } | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInvoice() {
      setLoading(true);
      setFetchError(null);
      setNotFound(false);
      try {
        const loadedInvoice = await api.getInvoice(id);
        if (cancelled) return;

        setInvoice(loadedInvoice);
        try {
          const linkedRequest = await api.getRequest(loadedInvoice.requestId);
          if (!cancelled) setRequest(linkedRequest);
        } catch {
          if (!cancelled) setRequest(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (isNotFoundError(err)) {
            setNotFound(true);
            return;
          }

          setFetchError(getErrorMessage(err, 'Failed to load invoice.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInvoice();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function flashSuccess(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2500);
  }

  function handleCopied(label: string) {
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  }

  async function executeStatusChange(status: InvoiceAction) {
    if (!invoice) return;

    setMutationError(null);
    setSaving(true);
    try {
      const updated = await api.updateInvoiceStatus(invoice.id, status);
      setInvoice(updated);
      try {
        const linkedRequest = await api.getRequest(updated.requestId);
        setRequest(linkedRequest);
      } catch {
        setRequest(null);
      }
      flashSuccess(
        status === 'paid'
          ? 'Invoice marked as paid and request sync updated.'
          : 'Invoice marked as unpaid and request sync updated.',
      );
    } catch (err: unknown) {
      setMutationError(
        getErrorMessage(err, 'Failed to update invoice status. Please try again.'),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <InvoiceSkeleton />;
  }

  if (notFound) {
    return (
      <AdminNotFoundState
        eyebrow="Invoice lookup"
        title="This invoice record could not be found."
        message="The invoice ID may be wrong, the invoice may have been removed, or the link may point to an old record. Return to the request queue to find the current invoice from its linked order."
        resourceId={id}
        primaryHref="/padi-admin/requests"
        primaryLabel="Back to request queue"
      />
    );
  }

  if (fetchError) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-lg border border-red-100 bg-red-50 px-4 text-center text-sm font-medium text-red-600">
        {fetchError}
      </div>
    );
  }

  if (!invoice) {
    return (
      <AdminNotFoundState
        eyebrow="Invoice lookup"
        title="This invoice record could not be found."
        message="The invoice ID may be wrong, the invoice may have been removed, or the link may point to an old record. Return to the request queue to find the current invoice from its linked order."
        resourceId={id}
        primaryHref="/padi-admin/requests"
        primaryLabel="Back to request queue"
      />
    );
  }

  const overdue = isOverdue(invoice);
  const dueDelta = getDaysUntilDue(invoice);
  const dueText =
    invoice.status === 'paid'
      ? `Paid ${formatShortDate(invoice.updatedAt)}`
      : dueDelta < 0
        ? `${Math.abs(dueDelta)} day${Math.abs(dueDelta) === 1 ? '' : 's'} overdue`
        : dueDelta === 0
          ? 'Due today'
          : `Due in ${dueDelta} day${dueDelta === 1 ? '' : 's'}`;

  return (
    <>
      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'paid' ? 'Mark invoice as paid?' : 'Mark invoice as unpaid?'}
          message={
            confirm.action === 'paid'
              ? `Only do this after confirming payment for ${invoice.invoiceNumber}. The linked request will be moved to payment confirmed when eligible.`
              : `This will make ${invoice.invoiceNumber} outstanding again. If the request is only payment-confirmed, it will return to pending.`
          }
          confirmLabel={confirm.action === 'paid' ? 'Mark as paid' : 'Mark as unpaid'}
          variant={confirm.action === 'unpaid' ? 'warning' : 'default'}
          onConfirm={async () => {
            const action = confirm.action;
            setConfirm(null);
            await executeStatusChange(action);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Link
              href="/padi-admin/requests"
              className="inline-flex min-h-9 items-center text-xs font-semibold text-muted transition-colors hover:text-primary"
            >
              Back to request queue
            </Link>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-lime-dark">
              Manage invoice
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-black text-heading sm:text-3xl">
                {invoice.invoiceNumber}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
              {request && <RequestStatusBadge status={request.status} />}
              {overdue && (
                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                  Overdue
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Payment record for order {invoice.orderId}. Total{' '}
              <span className="font-semibold text-heading">
                {formatNaira(invoice.total)}
              </span>
              , due {formatShortDate(invoice.dueDate)} ({dueText}). Manual
              payment changes sync with the linked inspection request.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/invoice/${invoice.token}`}
              target="_blank"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              Open public invoice
            </Link>
            <Link
              href={`/padi-admin/requests/${invoice.requestId}`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
            >
              Linked request
            </Link>
          </div>
        </div>

        {mutationError && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {mutationError}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.75fr)]">
          <div className="space-y-6">
            <InvoiceDocumentPanel invoice={invoice} />
            <CustomerPanel invoice={invoice} />
            <RelatedRequestPanel invoice={invoice} request={request} />
          </div>

          <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <PaymentControlPanel
              invoice={invoice}
              busy={saving}
              onConfirm={(action) => setConfirm({ action })}
            />
            <SharePanel
              invoice={invoice}
              copiedLabel={copiedLabel}
              onCopied={handleCopied}
            />
            <TimelinePanel invoice={invoice} />
          </div>
        </div>
      </div>
    </>
  );
}
