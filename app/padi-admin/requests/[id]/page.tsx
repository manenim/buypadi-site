// landing-page/app/padi-admin/requests/[id]/page.tsx
'use client';

import { use, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import AdminNotFoundState from '@/app/components/admin/AdminNotFoundState';
import ConfirmDialog from '@/app/components/admin/ConfirmDialog';
import Spinner from '@/app/components/Spinner';
import {
  InvoiceStatusBadge,
  RequestStatusBadge,
} from '@/app/components/admin/StatusBadge';
import {
  api,
  getErrorMessage,
  isNotFoundError,
  type CreateInvoicePayload,
  type InspectionRequest,
  type Invoice,
} from '@/app/lib/api';

type InspectionStatus = InspectionRequest['status'];
type StatusAction = {
  status: InspectionStatus;
  label: string;
  description: string;
  tone?: 'default' | 'danger';
};

const WORKFLOW_STEPS: Array<{
  status: InspectionStatus;
  label: string;
  description: string;
  system?: boolean;
}> = [
  {
    status: 'pending',
    label: 'Pending',
    description: 'Request received. Invoice/payment is still outstanding.',
    system: true,
  },
  {
    status: 'payment_confirmed',
    label: 'Payment confirmed',
    description: 'Set automatically when the invoice is paid.',
    system: true,
  },
  {
    status: 'scheduled',
    label: 'Scheduled',
    description: 'Inspector and timing have been arranged.',
  },
  {
    status: 'inspector_en_route',
    label: 'Inspector en route',
    description: 'Inspector is heading to the seller/location.',
  },
  {
    status: 'completed',
    label: 'Completed',
    description: 'Inspection work is finished.',
  },
];

const STATUS_ORDER: Record<InspectionStatus, number> = {
  pending: 0,
  payment_confirmed: 1,
  scheduled: 2,
  inspector_en_route: 3,
  completed: 4,
  cancelled: 5,
};

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

function getWhatsAppUrl(request: InspectionRequest) {
  const digits = (request.buyerWhatsapp ?? '').replace(/\D/g, '');
  const normalized = digits.startsWith('234')
    ? digits
    : digits.startsWith('0')
      ? `234${digits.slice(1)}`
      : digits;
  const message = encodeURIComponent(
    `Hi ${request.buyerFullName}, this is BuyPadi about your inspection request ${request.orderId}.`,
  );

  return `https://wa.me/${normalized}?text=${message}`;
}

function canAssignInspector(status: InspectionStatus) {
  return ['payment_confirmed', 'scheduled', 'inspector_en_route'].includes(status);
}

function getNextActions(request: InspectionRequest): StatusAction[] {
  if (request.status === 'completed' || request.status === 'cancelled') return [];

  const actions: StatusAction[] = [];

  if (request.status === 'payment_confirmed') {
    actions.push({
      status: 'scheduled',
      label: 'Schedule inspection',
      description: 'Move this paid request into the scheduled queue.',
    });
  }

  if (request.status === 'scheduled') {
    actions.push({
      status: 'inspector_en_route',
      label: 'Mark inspector en route',
      description: 'Use when the inspector has started the field visit.',
    });
  }

  if (request.status === 'inspector_en_route') {
    actions.push({
      status: 'completed',
      label: 'Complete request',
      description: 'Use after the inspection has been completed.',
    });
  }

  actions.push({
    status: 'cancelled',
    label: 'Cancel request',
    description: 'Stop this request. This should be used carefully.',
    tone: 'danger',
  });

  return actions;
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

function RequestEvidence({
  request,
  uploading,
  uploadError,
  onUpload,
}: {
  request: InspectionRequest;
  uploading: boolean;
  uploadError: string | null;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Panel title="Product evidence" eyebrow="Customer request">
      <div className="grid gap-5 px-4 py-4 sm:px-5 xl:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)]">
        <div>
          {request.screenshotUrl ? (
            <a
              href={request.screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg border border-surface-alt bg-surface"
            >
              <div
                className="h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${request.screenshotUrl})` }}
                aria-label="Product attachment preview"
              />
            </a>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-dashed border-surface-alt bg-surface px-6 text-center">
              <svg className="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Z" />
              </svg>
              <p className="mt-3 font-display text-sm font-bold text-heading">
                No product image yet
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                Upload a seller/customer product image so admins can review the
                item without leaving this page.
              </p>
            </div>
          )}

          <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90">
            {uploading
              ? 'Uploading...'
              : request.screenshotUrl
                ? 'Replace attachment'
                : 'Upload attachment'}
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              disabled={uploading}
              onChange={onUpload}
            />
          </label>
          {uploadError && (
            <p className="mt-2 text-xs font-medium text-red-600">{uploadError}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Product link"
            value={request.productLink ?? 'Not provided'}
            href={request.productLink}
          />
          <Field label="Item value" value={formatNaira(request.itemPrice)} />
          <Field label="Submitted" value={formatDate(request.createdAt)} />
          <Field label="Last updated" value={formatShortDate(request.updatedAt)} />
          <div className="sm:col-span-2">
            <Field label="Customer comments" value={request.comments} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function WorkflowPanel({ request }: { request: InspectionRequest }) {
  const currentIndex = STATUS_ORDER[request.status];
  const isCancelled = request.status === 'cancelled';

  return (
    <Panel title="Workflow" eyebrow="Status path">
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {isCancelled && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            This request has been cancelled.
          </div>
        )}
        <div className="space-y-3">
          {WORKFLOW_STEPS.map((step) => {
            const stepIndex = STATUS_ORDER[step.status];
            const done = !isCancelled && stepIndex < currentIndex;
            const active = !isCancelled && request.status === step.status;

            return (
              <div key={step.status} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 h-4 w-4 rounded-full border ${
                      active
                        ? 'border-primary bg-primary'
                        : done
                          ? 'border-lime bg-lime'
                          : 'border-surface-alt bg-white'
                    }`}
                  />
                </div>
                <div className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-heading">{step.label}</p>
                    {step.system && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                        Auto
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function PeoplePanel({ request }: { request: InspectionRequest }) {
  return (
    <Panel title="People and location" eyebrow="Buyer / seller">
      <div className="grid gap-6 px-4 py-4 sm:px-5 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="font-display text-sm font-bold text-heading">Customer</p>
          <div className="grid gap-4">
            <Field label="Full name" value={request.buyerFullName} />
            <Field label="WhatsApp" value={request.buyerWhatsapp} />
            <Field label="Email" value={request.buyerEmail} />
          </div>
        </div>
        <div className="space-y-4">
          <p className="font-display text-sm font-bold text-heading">Seller</p>
          <div className="grid gap-4">
            <Field label="Name / store" value={request.sellerName} />
            <Field label="Phone" value={request.sellerPhone} />
            <Field label="Address" value={request.sellerAddress} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function InvoicePanel({
  request,
  invoice,
  creatingInvoice,
  submittingInvoice,
  itemPrice,
  inspectionFee,
  deliveryFee,
  dueDate,
  invoiceNotes,
  onCreateClick,
  onCancelCreate,
  onSubmit,
  onItemPriceChange,
  onInspectionFeeChange,
  onDeliveryFeeChange,
  onDueDateChange,
  onNotesChange,
}: {
  request: InspectionRequest;
  invoice: Invoice | null;
  creatingInvoice: boolean;
  submittingInvoice: boolean;
  itemPrice: string;
  inspectionFee: string;
  deliveryFee: string;
  dueDate: string;
  invoiceNotes: string;
  onCreateClick: () => void;
  onCancelCreate: () => void;
  onSubmit: () => void;
  onItemPriceChange: (value: string) => void;
  onInspectionFeeChange: (value: string) => void;
  onDeliveryFeeChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}) {
  const parsedItemPrice = Number(itemPrice) || 0;
  const parsedInspectionFee = Number(inspectionFee) || 0;
  const parsedDeliveryFee = Number(deliveryFee) || 0;
  const payableTotal = parsedInspectionFee + parsedDeliveryFee;

  return (
    <Panel title="Invoice and payment" eyebrow="Payment gate">
      <div className="px-4 py-4 sm:px-5">
        {invoice ? (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-lg bg-surface px-4 py-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Invoice code</span>
                <span className="font-semibold text-heading">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Order price</span>
                <span className="font-semibold text-heading">{formatNaira(invoice.itemPrice)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Amount due</span>
                <span className="font-semibold text-heading">{formatNaira(invoice.total)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Status</span>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href={`/padi-admin/invoices/${invoice.id}`}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                Manage invoice
              </Link>
              <Link
                href={`/invoice/${invoice.token}`}
                target="_blank"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-alt px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
              >
                Public invoice
              </Link>
            </div>
          </div>
        ) : creatingInvoice ? (
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Order price
              <input
                type="number"
                min="0"
                value={itemPrice}
                onChange={(event) => onItemPriceChange(event.target.value)}
                placeholder="200000"
                className="mt-1 min-h-11 w-full rounded-lg border border-surface-alt bg-surface px-3 text-sm font-medium normal-case tracking-normal text-heading focus:border-lime focus:outline-none"
              />
              <span className="mt-1 block text-[11px] font-medium normal-case tracking-normal text-muted">
                For reference only.
              </span>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Inspection fee
                <input
                  type="number"
                  min="0"
                  value={inspectionFee}
                  onChange={(event) => onInspectionFeeChange(event.target.value)}
                  placeholder="15000"
                  className="mt-1 min-h-11 w-full rounded-lg border border-surface-alt bg-surface px-3 text-sm font-medium normal-case tracking-normal text-heading focus:border-lime focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">
                Delivery fee
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(event) => onDeliveryFeeChange(event.target.value)}
                  placeholder="8000"
                  className="mt-1 min-h-11 w-full rounded-lg border border-surface-alt bg-surface px-3 text-sm font-medium normal-case tracking-normal text-heading focus:border-lime focus:outline-none"
                />
              </label>
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={(event) => onDueDateChange(event.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-surface-alt bg-surface px-3 text-sm font-medium normal-case tracking-normal text-heading focus:border-lime focus:outline-none"
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Notes
              <textarea
                rows={3}
                value={invoiceNotes}
                onChange={(event) => onNotesChange(event.target.value)}
                placeholder="Optional invoice note"
                className="mt-1 w-full resize-none rounded-lg border border-surface-alt bg-surface px-3 py-2 text-sm font-medium normal-case tracking-normal text-heading placeholder:font-normal placeholder:text-subtle focus:border-lime focus:outline-none"
              />
            </label>

            <div className="rounded-lg bg-primary/5 px-4 py-3 text-sm">
              <div className="flex justify-between gap-3 text-muted">
                <span>Order price</span>
                <span>{formatNaira(parsedItemPrice)}</span>
              </div>
              <p className="mt-1 border-b border-primary/10 pb-2 text-[11px] font-medium text-muted">
                Informational only. Excluded from the payable invoice total.
              </p>
              <div className="mt-2 flex justify-between gap-3 text-muted">
                <span>Inspection</span>
                <span>{formatNaira(parsedInspectionFee)}</span>
              </div>
              <div className="mt-1 flex justify-between gap-3 text-muted">
                <span>Delivery</span>
                <span>{formatNaira(parsedDeliveryFee)}</span>
              </div>
              <div className="mt-2 flex justify-between gap-3 border-t border-primary/10 pt-2 font-bold text-heading">
                <span>Amount due</span>
                <span>{formatNaira(payableTotal)}</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={onSubmit}
                disabled={parsedItemPrice <= 0 || payableTotal <= 0 || submittingInvoice}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submittingInvoice ? 'Creating invoice...' : 'Create invoice'}
              </button>
              <button
                type="button"
                onClick={onCancelCreate}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-alt px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-surface px-4 py-4">
              <p className="text-sm font-semibold text-heading">No invoice yet</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Create an invoice for {request.buyerFullName}. Payment will move
                the request from pending to payment confirmed automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-lime px-4 text-sm font-bold text-primary transition-colors hover:bg-lime-bright"
            >
              Create invoice
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}

function InspectorPanel({
  request,
  inspectorName,
  saving,
  onChange,
  onSave,
}: {
  request: InspectionRequest;
  inspectorName: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  const enabled = canAssignInspector(request.status);

  return (
    <Panel title="Inspector assignment" eyebrow="Field work">
      <div className="space-y-3 px-4 py-4 sm:px-5">
        {!enabled && (
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
            Inspector assignment unlocks after payment is confirmed.
          </div>
        )}
        <input
          type="text"
          value={inspectorName}
          onChange={(event) => onChange(event.target.value)}
          disabled={!enabled || saving}
          placeholder="Inspector name"
          className="min-h-11 w-full rounded-lg border border-surface-alt bg-surface px-3 text-sm font-medium text-heading placeholder:font-normal placeholder:text-subtle focus:border-lime focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          onClick={onSave}
          disabled={!enabled || saving}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Saving inspector...' : 'Save inspector'}
        </button>
      </div>
    </Panel>
  );
}

function StatusActionsPanel({
  request,
  onAction,
}: {
  request: InspectionRequest;
  onAction: (status: InspectionStatus) => void;
}) {
  const actions = getNextActions(request);

  return (
    <Panel title="Status controls" eyebrow="Admin actions">
      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div className="rounded-lg bg-surface px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <RequestStatusBadge status={request.status} />
            {request.status === 'pending' && (
              <span className="text-xs font-medium text-muted">
                Waiting for invoice payment.
              </span>
            )}
          </div>
        </div>

        {actions.length === 0 ? (
          <p className="text-sm text-muted">
            This request is terminal. No further status changes are available.
          </p>
        ) : (
          actions.map((action) => {
            const needsInspector =
              action.status === 'scheduled' && !request.assignedInspectorName;
            const paymentMissing =
              request.status === 'pending' && action.status !== 'cancelled';
            const disabled = needsInspector || paymentMissing;

            return (
              <button
                key={action.status}
                type="button"
                onClick={() => onAction(action.status)}
                disabled={disabled}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                  action.tone === 'danger'
                    ? 'border-red-100 bg-red-50 text-red-700 hover:border-red-200'
                    : 'border-surface-alt bg-surface text-heading hover:border-primary/20 hover:bg-surface-alt'
                }`}
              >
                <p className="text-sm font-bold">{action.label}</p>
                <p className="mt-1 text-xs leading-relaxed opacity-75">
                  {needsInspector
                    ? 'Assign an inspector before scheduling.'
                    : paymentMissing
                      ? 'Payment must be confirmed first.'
                      : action.description}
                </p>
              </button>
            );
          })
        )}
      </div>
    </Panel>
  );
}

function CustomerMessageButton({ request }: { request: InspectionRequest }) {
  return (
    <a
      href={getWhatsAppUrl(request)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#128C4A] px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0F7C42]"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.142-4.03 7.5-9 7.5a10.26 10.26 0 0 1-3.03-.453L3 21l1.953-4.884A6.75 6.75 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z" />
      </svg>
      Message customer
    </a>
  );
}

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = use(params);

  const [request, setRequest] = useState<InspectionRequest | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<InspectionStatus | null>(null);

  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [itemPrice, setItemPrice] = useState('');
  const [inspectionFee, setInspectionFee] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const [inspectorName, setInspectorName] = useState('');
  const [savingInspector, setSavingInspector] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    setNotFound(false);

    Promise.all([api.getRequest(orderId), api.getInvoiceByRequest(orderId)])
      .then(([req, inv]) => {
        setRequest(req);
        setInvoice(inv);
        setInspectorName(req.assignedInspectorName ?? '');
        setItemPrice(String(Number(req.itemPrice) || ''));
      })
      .catch((err: unknown) => {
        if (isNotFoundError(err)) {
          setNotFound(true);
          return;
        }

        setFetchError(getErrorMessage(err, 'Failed to load request.'));
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  function flashSuccess(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 2500);
  }

  async function executeStatusChange(status: InspectionStatus) {
    if (!request) return;
    setMutationError(null);

    try {
      const updated = await api.updateRequestStatus(request.orderId, status);
      setRequest(updated);
      flashSuccess('Request status updated.');
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to update status.'));
    }
  }

  async function handleCreateInvoice() {
    if (!request) return;

    const parsedItemPrice = Number(itemPrice) || 0;
    const parsedInspectionFee = Number(inspectionFee) || 0;
    const parsedDeliveryFee = Number(deliveryFee) || 0;

    if (parsedItemPrice <= 0 || parsedInspectionFee + parsedDeliveryFee <= 0) return;

    setMutationError(null);
    setSubmittingInvoice(true);
    try {
      const payload: CreateInvoicePayload = {
        requestId: request.orderId,
        orderId: request.orderId,
        itemPrice: parsedItemPrice,
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
      flashSuccess('Invoice created.');
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to create invoice.'));
    } finally {
      setSubmittingInvoice(false);
    }
  }

  async function handleSaveInspector() {
    if (!request) return;

    setMutationError(null);
    setSavingInspector(true);
    try {
      const updated = await api.updateRequestStatus(
        request.orderId,
        request.status,
        inspectorName.trim(),
      );
      setRequest(updated);
      setInspectorName(updated.assignedInspectorName ?? '');
      flashSuccess('Inspector assignment saved.');
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to save inspector.'));
    } finally {
      setSavingInspector(false);
    }
  }

  async function handleUploadAttachment(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';

    if (!file || !request) return;

    setUploadError(null);
    setUploadingAttachment(true);

    try {
      const { url } = await api.uploadFile(file);
      const updated = await api.updateRequest(request.orderId, { screenshotUrl: url });
      setRequest(updated);
      flashSuccess('Product attachment uploaded.');
    } catch (err: unknown) {
      setUploadError(getErrorMessage(err, 'Could not upload attachment.'));
    } finally {
      setUploadingAttachment(false);
    }
  }

  if (loading) {
    return <Spinner label="Loading request…" className="py-32" />;
  }

  if (notFound) {
    return (
      <AdminNotFoundState
        eyebrow="Request lookup"
        title="This inspection request is not in the queue."
        message="The order ID may be wrong, the request may have been deleted, or you may be using an old admin link. Head back to the queue to continue from the current records."
        resourceId={orderId}
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

  if (!request) {
    return (
      <AdminNotFoundState
        eyebrow="Request lookup"
        title="This inspection request is not in the queue."
        message="The order ID may be wrong, the request may have been deleted, or you may be using an old admin link. Head back to the queue to continue from the current records."
        resourceId={orderId}
        primaryHref="/padi-admin/requests"
        primaryLabel="Back to request queue"
      />
    );
  }

  const pendingStatusLabel =
    WORKFLOW_STEPS.find((step) => step.status === pendingStatus)?.label ??
    (pendingStatus === 'cancelled' ? 'Cancelled' : pendingStatus);

  return (
    <>
      {pendingStatus && (
        <ConfirmDialog
          title={`Update status to ${pendingStatusLabel}?`}
          message={
            pendingStatus === 'cancelled'
              ? 'This will cancel the inspection request. Use this only when the request should stop.'
              : `This will move ${request.orderId} forward in the inspection workflow.`
          }
          confirmLabel="Update status"
          variant={pendingStatus === 'cancelled' ? 'warning' : 'default'}
          onConfirm={async () => {
            const status = pendingStatus;
            setPendingStatus(null);
            await executeStatusChange(status);
          }}
          onCancel={() => setPendingStatus(null)}
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
              Inspection request
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-black text-heading sm:text-3xl">
                {request.orderId}
              </h1>
              <RequestStatusBadge status={request.status} />
              {invoice && <InvoiceStatusBadge status={invoice.status} />}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Submitted by {request.buyerFullName} on {formatDate(request.createdAt)}.
              Item value is{' '}
              <span className="font-semibold text-heading">
                {formatNaira(request.itemPrice)}
              </span>
              . {invoice
                ? `Linked invoice ${invoice.invoiceNumber} is ${invoice.status}.`
                : 'No invoice has been created yet.'}{' '}
              Payment-confirmed status is controlled by the linked invoice.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <CustomerMessageButton request={request} />
            {invoice && (
              <Link
                href={`/invoice/${invoice.token}`}
                target="_blank"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
              >
                Open public invoice
              </Link>
            )}
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.75fr)]">
          <div className="space-y-6">
            <RequestEvidence
              request={request}
              uploading={uploadingAttachment}
              uploadError={uploadError}
              onUpload={handleUploadAttachment}
            />
            <PeoplePanel request={request} />
            <WorkflowPanel request={request} />
          </div>

          <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <InvoicePanel
              request={request}
              invoice={invoice}
              creatingInvoice={creatingInvoice}
              submittingInvoice={submittingInvoice}
              itemPrice={itemPrice}
              inspectionFee={inspectionFee}
              deliveryFee={deliveryFee}
              dueDate={dueDate}
              invoiceNotes={invoiceNotes}
              onCreateClick={() => setCreatingInvoice(true)}
              onCancelCreate={() => setCreatingInvoice(false)}
              onSubmit={handleCreateInvoice}
              onItemPriceChange={setItemPrice}
              onInspectionFeeChange={setInspectionFee}
              onDeliveryFeeChange={setDeliveryFee}
              onDueDateChange={setDueDate}
              onNotesChange={setInvoiceNotes}
            />
            <InspectorPanel
              request={request}
              inspectorName={inspectorName}
              saving={savingInspector}
              onChange={setInspectorName}
              onSave={handleSaveInspector}
            />
            <StatusActionsPanel
              request={request}
              onAction={(status) => setPendingStatus(status)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
