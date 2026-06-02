'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import { api, type InspectionRequest, type Invoice } from '@/app/lib/api';

type InspectionStatus = InspectionRequest['status'];

const REQUEST_STATUS_LABELS: Record<InspectionStatus, string> = {
  pending: 'Pending',
  payment_confirmed: 'Payment confirmed',
  scheduled: 'Scheduled',
  inspector_en_route: 'En route',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<InspectionStatus, string> = {
  pending: 'bg-amber-400',
  payment_confirmed: 'bg-blue-500',
  scheduled: 'bg-indigo-500',
  inspector_en_route: 'bg-orange-500',
  completed: 'bg-lime',
  cancelled: 'bg-red-400',
};

function formatNaira(n: number | string) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function getActionLabel(status: InspectionStatus) {
  const labels: Record<InspectionStatus, string> = {
    pending: 'Review and issue invoice',
    payment_confirmed: 'Assign schedule',
    scheduled: 'Confirm field handoff',
    inspector_en_route: 'Monitor field visit',
    completed: 'Review completed request',
    cancelled: 'Review cancellation',
  };

  return labels[status];
}

function DashboardMetric({
  label,
  value,
  detail,
  loading,
}: {
  label: string;
  value: ReactNode;
  detail: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-surface-alt bg-white px-4 py-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      {loading ? (
        <div className="mt-4 h-8 w-20 animate-pulse rounded-md bg-surface-alt" />
      ) : (
        <p className="mt-3 font-display text-2xl font-black leading-none text-heading">
          {value}
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted">{detail}</p>
    </div>
  );
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

function RequestStatusChart({
  counts,
  total,
  loading,
}: {
  counts: Record<InspectionStatus, number>;
  total: number;
  loading: boolean;
}) {
  const statuses = Object.keys(REQUEST_STATUS_LABELS) as InspectionStatus[];

  return (
    <Panel title="Request status mix" eyebrow="Queue health">
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded bg-surface-alt" />
              <div className="h-2.5 animate-pulse rounded-full bg-surface-alt" />
            </div>
          ))
        ) : total === 0 ? (
          <p className="py-8 text-sm text-muted">No request data yet.</p>
        ) : (
          statuses.map((status) => {
            const count = counts[status];
            const percent = total ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-copy">{REQUEST_STATUS_LABELS[status]}</span>
                  <span className="text-xs font-semibold text-muted">
                    {count} ({percent}%)
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className={`h-full rounded-full ${STATUS_COLORS[status]}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}

function IntakeChart({
  data,
  loading,
}: {
  data: Array<{ label: string; count: number }>;
  loading: boolean;
}) {
  const maxCount = Math.max(1, ...data.map((item) => item.count));

  return (
    <Panel title="7-day request intake" eyebrow="Demand">
      <div className="flex h-64 items-end gap-3 px-4 pb-4 pt-6 sm:px-5">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                <div className="h-36 w-full animate-pulse rounded-md bg-surface-alt" />
                <div className="h-3 w-10 animate-pulse rounded bg-surface-alt" />
              </div>
            ))
          : data.map((item) => {
              const height = Math.max(8, (item.count / maxCount) * 100);

              return (
                <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                  <div className="flex h-40 w-full items-end rounded-md bg-surface">
                    <div
                      className="w-full rounded-md bg-primary transition-all"
                      style={{ height: `${height}%` }}
                      title={`${item.count} request${item.count === 1 ? '' : 's'}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-heading">{item.count}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{item.label}</p>
                  </div>
                </div>
              );
            })}
      </div>
    </Panel>
  );
}

function PaymentSnapshot({
  paidCount,
  unpaidCount,
  paidValue,
  unpaidValue,
  loading,
}: {
  paidCount: number;
  unpaidCount: number;
  paidValue: number;
  unpaidValue: number;
  loading: boolean;
}) {
  const totalValue = paidValue + unpaidValue;
  const paidPercent = totalValue ? Math.round((paidValue / totalValue) * 100) : 0;

  return (
    <Panel
      title="Payment snapshot"
      eyebrow="Invoices"
      action={
        <Link href="/padi-admin/requests" className="text-sm font-semibold text-primary hover:underline">
          Manage
        </Link>
      }
    >
      <div className="px-4 py-4 sm:px-5">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 w-36 animate-pulse rounded-md bg-surface-alt" />
            <div className="h-3 animate-pulse rounded-full bg-surface-alt" />
            <div className="h-20 animate-pulse rounded-md bg-surface-alt" />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                Collected
              </p>
              <p className="mt-2 font-display text-3xl font-black text-heading">
                {formatNaira(paidValue)}
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-surface-alt">
              <div className="h-full rounded-full bg-lime" style={{ width: `${paidPercent}%` }} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-surface-alt pt-4 text-sm">
              <div>
                <p className="text-muted">Paid invoices</p>
                <p className="mt-1 font-display text-xl font-black text-heading">{paidCount}</p>
              </div>
              <div>
                <p className="text-muted">Outstanding</p>
                <p className="mt-1 font-display text-xl font-black text-heading">{unpaidCount}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted">Outstanding value</p>
                <p className="mt-1 font-semibold text-heading">{formatNaira(unpaidValue)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

function AttentionQueue({
  items,
  loading,
}: {
  items: InspectionRequest[];
  loading: boolean;
}) {
  return (
    <Panel
      title="Needs attention"
      eyebrow="Next actions"
      action={
        <Link href="/padi-admin/requests" className="text-sm font-semibold text-primary hover:underline">
          View queue
        </Link>
      }
    >
      {loading ? (
        <div className="divide-y divide-surface-alt">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-4 py-4 sm:px-5">
              <div className="h-4 w-40 animate-pulse rounded bg-surface-alt" />
              <div className="mt-3 h-3 w-64 animate-pulse rounded bg-surface-alt" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-10 text-sm text-muted sm:px-5">
          No active requests need action right now.
        </div>
      ) : (
        <div className="divide-y divide-surface-alt">
          {items.map((request) => (
            <Link
              key={request.id}
              href={`/padi-admin/requests/${request.orderId}`}
              className="grid gap-3 px-4 py-4 transition-colors hover:bg-surface/70 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs font-bold text-primary">{request.orderId}</p>
                  <RequestStatusBadge status={request.status} />
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-heading">
                  {request.buyerFullName}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {getActionLabel(request.status)} · {formatTimeAgo(request.createdAt)}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">Open</span>
            </Link>
          ))}
        </div>
      )}
    </Panel>
  );
}

function RecentRequestsTable({
  recent,
  invoiceMap,
  loading,
}: {
  recent: InspectionRequest[];
  invoiceMap: Record<string, Invoice>;
  loading: boolean;
}) {
  return (
    <Panel
      title="Recent requests"
      eyebrow="Latest activity"
      action={
        <Link href="/padi-admin/requests" className="text-sm font-semibold text-primary hover:underline">
          View all
        </Link>
      }
    >
      {loading ? (
        <div className="divide-y divide-surface-alt">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid gap-4 px-4 py-4 sm:grid-cols-[7rem_1fr_8rem_7rem] sm:px-5">
              <div className="h-4 animate-pulse rounded bg-surface-alt" />
              <div className="h-4 animate-pulse rounded bg-surface-alt" />
              <div className="h-4 animate-pulse rounded bg-surface-alt" />
              <div className="h-4 animate-pulse rounded bg-surface-alt" />
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="px-4 py-12 text-center sm:px-5">
          <p className="font-display font-bold text-heading">No requests yet</p>
          <p className="mt-1 text-sm text-muted">Inspection requests will appear here once submitted.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-surface-alt lg:hidden">
            {recent.map((request) => {
              const invoice = invoiceMap[request.orderId];

              return (
                <Link
                  key={request.id}
                  href={`/padi-admin/requests/${request.orderId}`}
                  className="block px-4 py-4 transition-colors hover:bg-surface/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-primary">{request.orderId}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-heading">
                        {request.buyerFullName}
                      </p>
                    </div>
                    <RequestStatusBadge status={request.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-muted">Value</p>
                      <p className="mt-0.5 font-semibold text-heading">{formatNaira(request.itemPrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted">Invoice</p>
                      <p className="mt-0.5 truncate font-semibold text-heading">
                        {invoice ? invoice.status : 'None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Created</p>
                      <p className="mt-0.5 font-semibold text-heading">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-alt bg-surface text-left">
                <tr>
                  {['Order', 'Customer', 'Item value', 'Invoice', 'Created', 'Status'].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-alt">
                {recent.map((request) => {
                  const invoice = invoiceMap[request.orderId];

                  return (
                    <tr key={request.id} className="transition-colors hover:bg-surface/70">
                      <td className="whitespace-nowrap px-5 py-4">
                        <Link href={`/padi-admin/requests/${request.orderId}`} className="font-mono text-xs font-bold text-primary hover:underline">
                          {request.orderId}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-heading">{request.buyerFullName}</p>
                        <p className="mt-0.5 text-xs text-muted">{request.buyerWhatsapp}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-copy">
                        {formatNaira(request.itemPrice)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {invoice ? (
                          <Link href={`/padi-admin/invoices/${invoice.id}`} className="text-xs font-semibold capitalize text-primary hover:underline">
                            {invoice.status}
                          </Link>
                        ) : (
                          <span className="text-xs text-muted">Not created</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <RequestStatusBadge status={request.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getRequests(), api.getInvoices()])
      .then(([reqs, invs]) => {
        setRequests(reqs);
        setInvoices(invs);
      })
      .catch((err: Error) => setFetchError(err.message ?? 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const invoiceMap = useMemo(() => {
    const map: Record<string, Invoice> = {};

    invoices.forEach((invoice) => {
      map[invoice.requestId] = invoice;
      map[invoice.orderId] = invoice;
    });

    return map;
  }, [invoices]);

  const metrics = useMemo(() => {
    const counts = requests.reduce(
      (acc, request) => {
        acc[request.status] += 1;
        return acc;
      },
      {
        pending: 0,
        payment_confirmed: 0,
        scheduled: 0,
        inspector_en_route: 0,
        completed: 0,
        cancelled: 0,
      } as Record<InspectionStatus, number>,
    );

    const active = requests.filter(
      (request) => request.status !== 'completed' && request.status !== 'cancelled',
    );
    const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
    const unpaidInvoices = invoices.filter((invoice) => invoice.status === 'unpaid');
    const paidValue = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const unpaidValue = unpaidInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const pipelineValue = active.reduce((sum, request) => sum + Number(request.itemPrice), 0);
    const completionRate = requests.length
      ? Math.round((counts.completed / requests.length) * 100)
      : 0;

    return {
      counts,
      active,
      paidInvoices,
      unpaidInvoices,
      paidValue,
      unpaidValue,
      pipelineValue,
      completionRate,
    };
  }, [invoices, requests]);

  const recent = useMemo(
    () =>
      [...requests]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
    [requests],
  );

  const attentionItems = useMemo(() => {
    const priority: Record<InspectionStatus, number> = {
      payment_confirmed: 1,
      pending: 2,
      scheduled: 3,
      inspector_en_route: 4,
      completed: 5,
      cancelled: 6,
    };

    return [...requests]
      .filter((request) => request.status !== 'completed' && request.status !== 'cancelled')
      .sort((a, b) => {
        const priorityDiff = priority[a.status] - priority[b.status];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .slice(0, 5);
  }, [requests]);

  const intakeData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));

      const count = requests.filter((request) => {
        const createdAt = new Date(request.createdAt);
        return (
          createdAt.getFullYear() === day.getFullYear() &&
          createdAt.getMonth() === day.getMonth() &&
          createdAt.getDate() === day.getDate()
        );
      }).length;

      return {
        label: day.toLocaleDateString('en-NG', { weekday: 'short' }),
        count,
      };
    });
  }, [requests]);

  if (fetchError) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-lg border border-red-100 bg-red-50 px-4 text-center text-sm font-medium text-red-600">
        {fetchError}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime-dark">
            BuyPadi operations
          </p>
          <h1 className="mt-2 font-display text-2xl font-black text-heading sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            A first-glance view of inspection demand, payment health, and the
            requests that need the next admin action.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/padi-admin/requests"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Open request queue
          </Link>
          <Link
            href="/padi-admin/waitlist"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
          >
            View waitlist
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric
          label="Active requests"
          value={metrics.active.length}
          detail="Requests still moving through the operation"
          loading={loading}
        />
        <DashboardMetric
          label="Ready to schedule"
          value={metrics.counts.payment_confirmed}
          detail="Paid requests waiting for inspection timing"
          loading={loading}
        />
        <DashboardMetric
          label="Pipeline value"
          value={formatNaira(metrics.pipelineValue)}
          detail="Item value in active inspection requests"
          loading={loading}
        />
        <DashboardMetric
          label="Completion rate"
          value={`${metrics.completionRate}%`}
          detail={`${metrics.counts.completed} completed of ${requests.length} total`}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
        <div className="grid gap-6 lg:grid-cols-2">
          <RequestStatusChart
            counts={metrics.counts}
            total={requests.length}
            loading={loading}
          />
          <IntakeChart data={intakeData} loading={loading} />
        </div>

        <PaymentSnapshot
          paidCount={metrics.paidInvoices.length}
          unpaidCount={metrics.unpaidInvoices.length}
          paidValue={metrics.paidValue}
          unpaidValue={metrics.unpaidValue}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(22rem,0.85fr)_minmax(0,1.45fr)]">
        <AttentionQueue items={attentionItems} loading={loading} />
        <RecentRequestsTable
          recent={recent}
          invoiceMap={invoiceMap}
          loading={loading}
        />
      </div>
    </div>
  );
}
