// landing-page/app/padi-admin/requests/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import AdminPagination from '@/app/components/admin/AdminPagination';
import { RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import { api, type InspectionRequest, type Invoice } from '@/app/lib/api';

type InspectionStatus = InspectionRequest['status'];
type StatusFilter = InspectionStatus | 'all';
const PAGE_SIZE = 10;

const STATUS_CARDS: Array<{
  value: StatusFilter;
  label: string;
  description: string;
  accent: string;
}> = [
  {
    value: 'all',
    label: 'All requests',
    description: 'Complete queue',
    accent: 'bg-primary',
  },
  {
    value: 'pending',
    label: 'Pending',
    description: 'Needs review',
    accent: 'bg-amber-400',
  },
  {
    value: 'payment_confirmed',
    label: 'Payment confirmed',
    description: 'Ready to schedule',
    accent: 'bg-blue-500',
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    description: 'Booked inspections',
    accent: 'bg-indigo-500',
  },
  {
    value: 'inspector_en_route',
    label: 'En route',
    description: 'Field movement',
    accent: 'bg-orange-500',
  },
  {
    value: 'completed',
    label: 'Completed',
    description: 'Finished work',
    accent: 'bg-lime',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Stopped requests',
    accent: 'bg-red-400',
  },
];

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

function SummaryCard({
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
        <div className="mt-4 h-7 w-24 animate-pulse rounded-md bg-surface-alt" />
      ) : (
        <p className="mt-3 font-display text-2xl font-black leading-none text-heading">
          {value}
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted">{detail}</p>
    </div>
  );
}

function StatusFilterCard({
  label,
  description,
  count,
  total,
  accent,
  active,
  onClick,
}: {
  label: string;
  description: string;
  count: number;
  total: number;
  accent: string;
  active: boolean;
  onClick: () => void;
}) {
  const percent = total ? Math.round((count / total) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md ${
        active ? 'border-primary ring-2 ring-primary/10' : 'border-surface-alt'
      }`}
      aria-pressed={active}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-black leading-none text-heading">
            {count}
          </p>
        </div>
        <span className={`mt-1 h-3 w-3 rounded-full ${accent}`} />
      </div>
      <p className="mt-3 text-xs font-medium text-muted">{description}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-alt">
        <div
          className={`h-full rounded-full ${accent}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-subtle">
        {percent}% of queue
      </p>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-14 text-center sm:px-5">
      <p className="font-display text-base font-bold text-heading">
        No requests match your filters
      </p>
      <p className="mt-1 text-sm text-muted">
        Try another status category or search term.
      </p>
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([api.getRequests(), api.getInvoices()])
      .then(([reqs, invs]) => {
        setRequests(reqs);
        setInvoices(invs);
      })
      .catch((err: Error) => {
        setFetchError(err.message ?? 'Failed to load requests. Please refresh.');
      })
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

  const statusCounts = useMemo(() => {
    const counts = STATUS_CARDS.reduce(
      (acc, status) => ({ ...acc, [status.value]: 0 }),
      {} as Record<StatusFilter, number>,
    );

    requests.forEach((request) => {
      counts.all += 1;
      counts[request.status] += 1;
    });

    return counts;
  }, [requests]);

  const summary = useMemo(() => {
    const active = requests.filter(
      (request) => request.status !== 'completed' && request.status !== 'cancelled',
    );
    const unassigned = requests.filter(
      (request) =>
        !request.assignedInspectorName &&
        request.status !== 'completed' &&
        request.status !== 'cancelled',
    );
    const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
    const unpaidInvoices = invoices.filter((invoice) => invoice.status === 'unpaid');
    const activeValue = active.reduce((sum, request) => sum + Number(request.itemPrice), 0);

    return {
      active,
      unassigned,
      paidInvoices,
      unpaidInvoices,
      activeValue,
    };
  }, [invoices, requests]);

  const filtered = useMemo(() => {
    return requests
      .filter((request) => statusFilter === 'all' || request.status === statusFilter)
      .filter((request) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const invoice = invoiceMap[request.orderId];

        return (
          request.orderId.toLowerCase().includes(q) ||
          request.buyerFullName.toLowerCase().includes(q) ||
          request.buyerEmail.toLowerCase().includes(q) ||
          request.sellerName.toLowerCase().includes(q) ||
          (request.productLink ?? '').toLowerCase().includes(q) ||
          (invoice?.invoiceNumber ?? '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoiceMap, requests, search, statusFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

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
            Inspection operations
          </p>
          <h1 className="mt-2 font-display text-2xl font-black text-heading sm:text-3xl">
            Request queue
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Review new inspection requests, follow paid jobs into scheduling,
            and keep the field queue moving.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/request"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
          >
            Public request form
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active requests"
          value={summary.active.length}
          detail="Open work excluding completed and cancelled"
          loading={loading}
        />
        <SummaryCard
          label="Unassigned"
          value={summary.unassigned.length}
          detail="Active requests without an inspector"
          loading={loading}
        />
        <SummaryCard
          label="Paid invoices"
          value={summary.paidInvoices.length}
          detail={`${summary.unpaidInvoices.length} invoice${summary.unpaidInvoices.length === 1 ? '' : 's'} outstanding`}
          loading={loading}
        />
        <SummaryCard
          label="Active item value"
          value={formatNaira(summary.activeValue)}
          detail="Combined item value in the open queue"
          loading={loading}
        />
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-bold text-heading">
              Status categories
            </h2>
            <p className="mt-1 text-sm text-muted">
              Click a card to filter the request table.
            </p>
          </div>
          <p className="hidden text-sm font-medium text-muted sm:block">
            {filtered.length} of {requests.length} shown
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
          {STATUS_CARDS.map((status) => (
            <StatusFilterCard
              key={status.value}
              label={status.label}
              description={status.description}
              count={statusCounts[status.value]}
              total={requests.length}
              accent={status.accent}
              active={statusFilter === status.value}
              onClick={() => {
                setStatusFilter(status.value);
                setPage(1);
              }}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-surface-alt bg-white shadow-sm">
        <div className="grid gap-3 border-b border-surface-alt px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="font-display text-base font-bold text-heading">
              Requests table
            </h2>
            <p className="mt-1 text-sm text-muted">
              {loading
                ? 'Loading queue records...'
                : `${filtered.length} of ${requests.length} request${requests.length === 1 ? '' : 's'} visible`}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order, customer, seller, item, invoice..."
              className="min-h-10 w-full rounded-lg border border-surface-alt bg-surface px-4 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none sm:w-80"
            />
            {(search || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setPage(1);
                }}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-surface-alt px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
              >
                Reset
              </button>
            )}
          </div>
        </div>

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
        ) : (
          <>
            <div className="divide-y divide-surface-alt md:hidden">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                paginated.map((request) => {
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
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {request.buyerEmail}
                          </p>
                        </div>
                        <RequestStatusBadge status={request.status} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted">Seller</p>
                          <p className="mt-0.5 truncate font-semibold text-heading">
                            {request.sellerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Item value</p>
                          <p className="mt-0.5 font-semibold text-heading">
                            {formatNaira(request.itemPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Inspector</p>
                          <p className="mt-0.5 truncate font-semibold text-heading">
                            {request.assignedInspectorName ?? 'Unassigned'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Invoice</p>
                          <p className="mt-0.5 truncate font-semibold text-heading">
                            {invoice ? invoice.invoiceNumber : 'Not created'}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-muted">
                        Submitted {formatDate(request.createdAt)}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-alt bg-surface text-left">
                  <tr>
                    {['Order', 'Customer', 'Product', 'Seller', 'Item value', 'Date', 'Inspector', 'Invoice', 'Status'].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-alt">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9}>
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((request) => {
                      const invoice = invoiceMap[request.orderId];

                      return (
                        <tr key={request.id} className="transition-colors hover:bg-surface/70">
                          <td className="whitespace-nowrap px-5 py-4">
                            <Link
                              href={`/padi-admin/requests/${request.orderId}`}
                              className="font-mono text-xs font-bold text-primary hover:underline"
                            >
                              {request.orderId}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="font-semibold text-heading">
                              {request.buyerFullName}
                            </div>
                            <div className="text-xs text-muted">{request.buyerEmail}</div>
                          </td>
                          <td className="max-w-52 px-5 py-4">
                            <div className="truncate text-copy">{request.productLink ?? '—'}</div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-copy">
                            {request.sellerName}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-copy">
                            {formatNaira(request.itemPrice)}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-xs text-copy">
                            {request.assignedInspectorName ?? (
                              <span className="italic text-subtle">Unassigned</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-xs">
                            {invoice ? (
                              <Link
                                href={`/padi-admin/invoices/${invoice.id}`}
                                className="font-semibold text-primary hover:underline"
                              >
                                {invoice.invoiceNumber}
                              </Link>
                            ) : (
                              <span className="italic text-subtle">None</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <RequestStatusBadge status={request.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              itemLabel="requests"
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
