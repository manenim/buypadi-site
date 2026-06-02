'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AdminPagination from '@/app/components/admin/AdminPagination';
import { api, type QuestionnaireLeadStatus, type QuestionnaireResponse } from '@/app/lib/api';

type StatusFilter = QuestionnaireLeadStatus | 'all';
const PAGE_SIZE = 10;

const STATUS_LABELS: Record<QuestionnaireLeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
  not_interested: 'Not interested',
};

const STATUS_STYLES: Record<QuestionnaireLeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  not_interested: 'bg-surface text-muted border-surface-alt',
};

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value: value as QuestionnaireLeadStatus,
    label,
  })),
];

function LeadStatusBadge({ status }: { status: QuestionnaireLeadStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function EmptyState() {
  return (
    <div className="px-4 py-14 text-center sm:px-5">
      <p className="font-display text-base font-bold text-heading">
        No questionnaire responses match your filters
      </p>
      <p className="mt-1 text-sm text-muted">
        Try another lead status or search term.
      </p>
    </div>
  );
}

export default function AdminQuestionnairePage() {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .getQuestionnaireResponses()
      .then(setResponses)
      .catch((err: Error) =>
        setFetchError(err.message ?? 'Failed to load questionnaire responses.'),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return responses
      .filter((response) => statusFilter === 'all' || response.leadStatus === statusFilter)
      .filter((response) => {
        if (!q) return true;
        return (
          response.fullName.toLowerCase().includes(q) ||
          response.phoneNumber.toLowerCase().includes(q) ||
          response.city.toLowerCase().includes(q) ||
          response.currentPlatform.toLowerCase().includes(q) ||
          response.userType.toLowerCase().includes(q) ||
          response.likelihoodToUse.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [responses, search, statusFilter]);

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
            Customer discovery
          </p>
          <h1 className="mt-2 font-display text-2xl font-black text-heading sm:text-3xl">
            Questionnaire responses
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Review customer intent, trading behavior, trust concerns, and
            follow-up status from the BuyPadi questionnaire.
          </p>
        </div>

        <Link
          href="/questionnaire"
          target="_blank"
          className="inline-flex min-h-10 w-fit items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
        >
          Open public form
        </Link>
      </div>

      <section className="rounded-lg border border-surface-alt bg-white shadow-sm">
        <div className="grid gap-3 border-b border-surface-alt px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="font-display text-base font-bold text-heading">
              Response table
            </h2>
            <p className="mt-1 text-sm text-muted">
              {loading
                ? 'Loading questionnaire responses...'
                : `${filtered.length} of ${responses.length} response${responses.length === 1 ? '' : 's'} visible`}
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
              placeholder="Search name, phone, city, platform, intent..."
              className="min-h-10 w-full rounded-lg border border-surface-alt bg-surface px-4 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none sm:w-96"
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
              <div key={index} className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_8rem_8rem_8rem] sm:px-5">
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
                paginated.map((response) => (
                  <Link
                    key={response.id}
                    href={`/padi-admin/questionnaire/${response.id}`}
                    className="block px-4 py-4 transition-colors hover:bg-surface/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-heading">
                          {response.fullName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {response.phoneNumber} · {response.city}
                        </p>
                      </div>
                      <LeadStatusBadge status={response.leadStatus} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted">User type</p>
                        <p className="mt-0.5 font-semibold capitalize text-heading">{response.userType}</p>
                      </div>
                      <div>
                        <p className="text-muted">Platform</p>
                        <p className="mt-0.5 truncate font-semibold text-heading">
                          {response.currentPlatform}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted">Likelihood</p>
                        <p className="mt-0.5 truncate font-semibold text-heading">
                          {response.likelihoodToUse}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted">Date</p>
                        <p className="mt-0.5 font-semibold text-heading">
                          {formatDate(response.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-alt bg-surface text-left">
                  <tr>
                    {['Name', 'Type', 'Platform', 'Likelihood', 'Status', 'Date'].map((heading) => (
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
                    paginated.map((response) => (
                      <tr key={response.id} className="transition-colors hover:bg-surface/70">
                        <td className="whitespace-nowrap px-5 py-4">
                          <Link
                            href={`/padi-admin/questionnaire/${response.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {response.fullName}
                          </Link>
                          <div className="text-xs text-muted">
                            {response.phoneNumber} · {response.city}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 capitalize text-copy">
                          {response.userType}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-copy">
                          {response.currentPlatform}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-copy">
                          {response.likelihoodToUse}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <LeadStatusBadge status={response.leadStatus} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                          {formatDate(response.createdAt)}
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
              itemLabel="responses"
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
