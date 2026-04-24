'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import { api, type InspectionRequest, type Invoice } from '@/app/lib/api';

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatCard({
  label,
  value,
  description,
  colorClass,
  dotClass,
  loading,
}: {
  label: string;
  value: number;
  description: string;
  colorClass: string;
  dotClass: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-3xl border border-surface-alt bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${colorClass}`}>
          {label}
        </span>
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
      </div>
      {loading ? (
        <div className="mt-5 h-9 w-14 animate-pulse rounded-xl bg-surface-alt" />
      ) : (
        <p className="mt-5 font-display text-3xl font-black leading-none text-heading sm:text-[2.1rem]">
          {value}
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">{description}</p>
    </div>
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

  const invoiceMap = useMemo(
    () => Object.fromEntries(invoices.map((inv) => [inv.requestId, inv])),
    [invoices],
  );

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const inProgress = requests.filter(
    (r) => r.status === 'scheduled' || r.status === 'inspector_en_route' || r.status === 'payment_confirmed',
  ).length;
  const completed = requests.filter((r) => r.status === 'completed').length;

  const recent = useMemo(
    () =>
      [...requests]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [requests],
  );

  const stats = [
    { label: 'Total', value: total, description: 'All submissions in the queue', colorClass: 'bg-primary/10 text-primary', dotClass: 'bg-primary' },
    { label: 'Pending', value: pending, description: 'Waiting for next action', colorClass: 'bg-yellow-50 text-yellow-700', dotClass: 'bg-yellow-400' },
    { label: 'In Progress', value: inProgress, description: 'Moving through inspection', colorClass: 'bg-blue-50 text-blue-700', dotClass: 'bg-blue-500' },
    { label: 'Completed', value: completed, description: 'Finished and archived', colorClass: 'bg-lime-light text-primary', dotClass: 'bg-lime' },
  ];

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-red-500">{fetchError}</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">Dashboard</h1>
          <p className="mt-1 max-w-lg text-sm text-muted">
            Overview of inspection activity. Jump into the request queue for detailed management.
          </p>
        </div>
        <Link
          href="/admin/requests"
          className="inline-flex min-h-10 w-fit items-center justify-center rounded-full border border-surface-alt bg-white px-5 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
        >
          Open request queue →
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={loading} />
        ))}
      </div>

      {/* Recent requests */}
      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-surface-alt px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-base font-bold text-heading sm:text-lg">
              Recent requests
            </h2>
            <p className="mt-0.5 text-xs text-muted sm:text-sm">
              Latest 10 submissions across the queue.
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs font-semibold text-lime-dark hover:underline sm:text-sm"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-surface-alt">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                <div className="h-4 w-24 animate-pulse rounded bg-surface-alt" />
                <div className="h-4 flex-1 animate-pulse rounded bg-surface-alt" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-surface-alt" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
              <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-heading">No requests yet</p>
              <p className="mt-1 text-sm text-muted">Inspection requests will appear here once submitted.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="divide-y divide-surface-alt lg:hidden">
              {recent.map((request) => {
                const invoice = invoiceMap[request.orderId];
                return (
                  <Link
                    key={request.id}
                    href={`/admin/requests/${request.orderId}`}
                    className="block px-4 py-4 transition-colors hover:bg-surface/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-bold text-primary">{request.orderId}</p>
                        <p className="mt-1 text-sm font-semibold text-heading">{request.buyerFullName}</p>
                      </div>
                      <RequestStatusBadge status={request.status} />
                    </div>
                    <p className="mt-2 truncate text-sm text-copy">{request.productLink ?? '—'}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
                      <div>
                        <p className="uppercase tracking-wide text-subtle">Price</p>
                        <p className="mt-0.5 font-medium text-heading">{formatNaira(request.itemPrice)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-subtle">Invoice</p>
                        <p className="mt-0.5 font-medium text-heading">{invoice ? invoice.invoiceNumber : '—'}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-subtle">Date</p>
                        <p className="mt-0.5 font-medium text-heading">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-alt bg-surface text-left">
                  <tr>
                    {['Order ID', 'Customer', 'Product', 'Price', 'Invoice', 'Date', 'Status'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-alt">
                  {recent.map((request) => {
                    const invoice = invoiceMap[request.orderId];
                    return (
                      <tr key={request.id} className="transition-colors hover:bg-surface/50">
                        <td className="whitespace-nowrap px-6 py-3">
                          <Link href={`/admin/requests/${request.orderId}`} className="font-mono text-xs font-bold text-primary hover:underline">
                            {request.orderId}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 font-medium text-heading">
                          {request.buyerFullName}
                        </td>
                        <td className="max-w-45 px-6 py-3">
                          <p className="truncate text-copy">{request.productLink ?? '—'}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-copy">
                          {formatNaira(request.itemPrice)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          {invoice ? (
                            <Link href={`/admin/invoices/${invoice.id}`} className="text-xs font-semibold text-primary hover:underline">
                              {invoice.invoiceNumber}
                            </Link>
                          ) : (
                            <span className="text-xs italic text-subtle">None</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-xs text-muted">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
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
      </div>
    </div>
  );
}
