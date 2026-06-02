'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminPagination from '@/app/components/admin/AdminPagination';
import {
  api,
  type WaitlistAdminUpdatePayload,
  type WaitlistEntry,
  type WaitlistStatus,
} from '@/app/lib/api';

type StatusFilter = WaitlistStatus | 'all';
const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: WaitlistStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'invited', label: 'Invited' },
];

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...STATUS_OPTIONS,
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function WaitlistStatusBadge({ status }: { status: WaitlistStatus }) {
  const styles: Record<WaitlistStatus, string> = {
    new: 'border-blue-200 bg-blue-50 text-blue-700',
    contacted: 'border-amber-200 bg-amber-50 text-amber-700',
    invited: 'border-green-200 bg-green-50 text-green-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-14 text-center sm:px-5">
      <p className="font-display text-base font-bold text-heading">
        No waitlist entries match your filters
      </p>
      <p className="mt-1 text-sm text-muted">
        Try another status category or search term.
      </p>
    </div>
  );
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getWaitlistEntries()
      .then(setEntries)
      .catch((err: Error) => setFetchError(err.message ?? 'Failed to load waitlist.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return entries
      .filter((entry) => statusFilter === 'all' || entry.status === statusFilter)
      .filter((entry) => {
        if (!q) return true;
        return (
          entry.fullName.toLowerCase().includes(q) ||
          entry.email.toLowerCase().includes(q) ||
          entry.phoneNumber.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [entries, search, statusFilter]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  async function updateEntry(entry: WaitlistEntry, body: WaitlistAdminUpdatePayload) {
    setSavingId(entry.id);
    try {
      const updated = await api.updateWaitlistEntry(entry.id, body);
      setEntries((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } finally {
      setSavingId(null);
    }
  }

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
            Early access
          </p>
          <h1 className="mt-2 font-display text-2xl font-black text-heading sm:text-3xl">
            Waitlist
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Manage launch interest, contact status, and the reward credits
            attached to waitlist submissions.
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-surface-alt bg-white shadow-sm">
        <div className="grid gap-3 border-b border-surface-alt px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="font-display text-base font-bold text-heading">
              Waitlist table
            </h2>
            <p className="mt-1 text-sm text-muted">
              {loading
                ? 'Loading waitlist entries...'
                : `${filtered.length} of ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} visible`}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                setPage(1);
              }}
              className="min-h-10 rounded-lg border border-surface-alt bg-surface px-3 text-sm font-semibold text-heading focus:border-lime focus:outline-none"
            >
              {STATUS_FILTER_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or phone..."
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
              <div key={index} className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_1fr_7rem_8rem] sm:px-5">
                <div className="h-4 animate-pulse rounded bg-surface-alt" />
                <div className="h-4 animate-pulse rounded bg-surface-alt" />
                <div className="h-4 animate-pulse rounded bg-surface-alt" />
                <div className="h-4 animate-pulse rounded bg-surface-alt" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="divide-y divide-surface-alt lg:hidden">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                paginated.map((entry) => (
                  <div key={entry.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-heading">
                          {entry.fullName}
                        </p>
                        <a
                          href={`mailto:${entry.email}`}
                          className="mt-0.5 block truncate text-xs text-muted hover:text-primary hover:underline"
                        >
                          {entry.email}
                        </a>
                      </div>
                      <WaitlistStatusBadge status={entry.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted">Phone</p>
                        <p className="mt-0.5 font-semibold text-heading">{entry.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted">Joined</p>
                        <p className="mt-0.5 font-semibold text-heading">{formatDate(entry.createdAt)}</p>
                      </div>
                      <label className="text-muted">
                        <span>Inspection credits</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue={entry.freeInspectionCredits ?? 0}
                          disabled={savingId === entry.id}
                          onBlur={(e) =>
                            updateEntry(entry, {
                              freeInspectionCredits: Number(e.target.value),
                            })
                          }
                          className="mt-1 h-9 w-full rounded-lg border border-surface-alt bg-surface px-2 text-xs font-semibold text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                        />
                      </label>
                      <label className="text-muted">
                        <span>Delivery credits</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue={entry.freeDeliveryCredits ?? 0}
                          disabled={savingId === entry.id}
                          onBlur={(e) =>
                            updateEntry(entry, {
                              freeDeliveryCredits: Number(e.target.value),
                            })
                          }
                          className="mt-1 h-9 w-full rounded-lg border border-surface-alt bg-surface px-2 text-xs font-semibold text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                        />
                      </label>
                    </div>

                    <select
                      value={entry.status}
                      disabled={savingId === entry.id}
                      onChange={(e) =>
                        updateEntry(entry, {
                          status: e.target.value as WaitlistStatus,
                        })
                      }
                      className="mt-4 min-h-10 w-full rounded-lg border border-surface-alt bg-surface px-3 text-xs font-semibold capitalize text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-alt bg-surface text-left">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Rewards', 'Status', 'Date'].map((heading) => (
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
                      <td colSpan={6}>
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    paginated.map((entry) => (
                      <tr key={entry.id} className="transition-colors hover:bg-surface/70">
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-heading">
                          {entry.fullName}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-copy">
                          <a href={`mailto:${entry.email}`} className="hover:text-primary hover:underline">
                            {entry.email}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-copy">
                          {entry.phoneNumber}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex gap-2">
                            <label className="flex items-center gap-1 text-xs text-muted">
                              <span>Inspection</span>
                              <input
                                type="number"
                                min="0"
                                defaultValue={entry.freeInspectionCredits ?? 0}
                                disabled={savingId === entry.id}
                                onBlur={(e) =>
                                  updateEntry(entry, {
                                    freeInspectionCredits: Number(e.target.value),
                                  })
                                }
                                className="h-9 w-16 rounded-lg border border-surface-alt bg-surface px-2 text-xs font-semibold text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                              />
                            </label>
                            <label className="flex items-center gap-1 text-xs text-muted">
                              <span>Delivery</span>
                              <input
                                type="number"
                                min="0"
                                defaultValue={entry.freeDeliveryCredits ?? 0}
                                disabled={savingId === entry.id}
                                onBlur={(e) =>
                                  updateEntry(entry, {
                                    freeDeliveryCredits: Number(e.target.value),
                                  })
                                }
                                className="h-9 w-16 rounded-lg border border-surface-alt bg-surface px-2 text-xs font-semibold text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                              />
                            </label>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <select
                            value={entry.status}
                            disabled={savingId === entry.id}
                            onChange={(e) =>
                              updateEntry(entry, {
                                status: e.target.value as WaitlistStatus,
                              })
                            }
                            className="min-h-10 rounded-lg border border-surface-alt bg-surface px-3 text-xs font-semibold capitalize text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                          {formatDate(entry.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              itemLabel="entries"
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
