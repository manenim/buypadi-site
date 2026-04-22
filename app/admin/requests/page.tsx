'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import { MOCK_INSPECTORS } from '@/app/lib/mock-data';
import { getAllInvoices, getAllRequests, seedIfEmpty } from '@/app/lib/mock-store';
import type { InspectionRequest, InspectionStatus } from '@/app/lib/types';

const ALL_STATUSES: { value: InspectionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'inspector_en_route', label: 'En Route' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RequestsPage() {
  const [requests] = useState<InspectionRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    seedIfEmpty();
    return getAllRequests();
  });
  const [invoices] = useState(() => {
    if (typeof window === 'undefined') return [];
    seedIfEmpty();
    return getAllInvoices();
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | 'all'>('all');

  const inspectorMap = useMemo(
    () => Object.fromEntries(MOCK_INSPECTORS.map((inspector) => [inspector.id, inspector.name])),
    []
  );

  const invoiceMap = useMemo(
    () => Object.fromEntries(invoices.map((invoice) => [invoice.requestId, invoice])),
    [invoices]
  );

  const filtered = useMemo(() => {
    return requests
      .filter((request) => statusFilter === 'all' || request.status === statusFilter)
      .filter((request) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
          request.orderId.toLowerCase().includes(query) ||
          request.buyerFullName.toLowerCase().includes(query) ||
          request.itemDescription.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, search, statusFilter]);

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">
          Inspection Requests
        </h1>
        <p className="mt-1 text-sm text-muted sm:text-base">
          {filtered.length} of {requests.length} requests
        </p>
      </div>

      <div className="rounded-[1.75rem] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer, or item…"
              className="min-h-12 flex-1 rounded-2xl border border-surface-alt bg-surface px-4 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InspectionStatus | 'all')}
              className="min-h-12 rounded-2xl border border-surface-alt bg-surface px-4 text-sm font-medium text-heading transition-colors focus:border-lime focus:outline-none sm:hidden"
            >
              {ALL_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden flex-wrap gap-2 sm:flex">
            {ALL_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value as InspectionStatus | 'all')}
                className={`min-h-11 rounded-full border px-4 text-xs font-semibold transition-colors ${
                  statusFilter === status.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-alt bg-surface text-muted hover:border-primary/30 hover:text-primary'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm md:hidden">
        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-muted">
            No requests match your filters.
          </div>
        )}

        <div className="divide-y divide-surface-alt">
          {filtered.map((request) => {
            const invoice = invoiceMap[request.id];

            return (
              <Link
                key={request.id}
                href={`/admin/requests/${request.id}`}
                className="block px-4 py-4 transition-colors hover:bg-surface/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-primary">{request.orderId}</p>
                    <p className="mt-1 text-sm font-semibold text-heading">{request.buyerFullName}</p>
                  </div>
                  <RequestStatusBadge status={request.status} />
                </div>

                <p className="mt-3 text-sm font-medium text-copy">{request.itemDescription}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="uppercase tracking-wide text-subtle">Seller</p>
                    <p className="mt-1 font-medium text-heading">{request.sellerName}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-subtle">Price</p>
                    <p className="mt-1 font-medium text-heading">{formatNaira(request.itemPrice)}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-subtle">Inspector</p>
                    <p className="mt-1 font-medium text-heading">
                      {request.assignedInspectorId
                        ? (inspectorMap[request.assignedInspectorId] ?? 'Assigned')
                        : 'Unassigned'}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-subtle">Invoice</p>
                    <p className="mt-1 font-medium text-heading">
                      {invoice ? invoice.invoiceNumber : 'Not created'}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted">
                  Submitted {formatDate(request.createdAt)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[1.75rem] bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-surface-alt bg-surface text-left">
              <tr>
                {['Order ID', 'Customer', 'Item', 'Seller', 'Price', 'Date', 'Inspector', 'Invoice', 'Status'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-alt">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted">
                    No requests match your filters.
                  </td>
                </tr>
              )}

              {filtered.map((request) => {
                const invoice = invoiceMap[request.id];

                return (
                  <tr key={request.id} className="transition-colors hover:bg-surface/60">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/admin/requests/${request.id}`} className="font-mono text-xs font-bold text-primary hover:underline">
                        {request.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-heading">{request.buyerFullName}</div>
                      <div className="text-xs text-muted">{request.buyerEmail}</div>
                    </td>
                    <td className="px-4 py-3 max-w-40">
                      <div className="truncate font-medium text-copy">{request.itemDescription}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-copy">{request.sellerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-copy">{formatNaira(request.itemPrice)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">{formatDate(request.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-copy">
                      {request.assignedInspectorId
                        ? (inspectorMap[request.assignedInspectorId] ?? '—')
                        : <span className="italic text-subtle">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {invoice ? (
                        <Link href={`/admin/invoices/${invoice.id}`} className="font-semibold text-primary hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      ) : (
                        <span className="italic text-subtle">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <RequestStatusBadge status={request.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
