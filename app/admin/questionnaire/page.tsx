'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api, type QuestionnaireLeadStatus, type QuestionnaireResponse } from '@/app/lib/api';

const STATUS_LABELS: Record<QuestionnaireLeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
  not_interested: 'Not Interested',
};

const STATUS_STYLES: Record<QuestionnaireLeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  not_interested: 'bg-surface text-muted border-surface-alt',
};

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

export default function AdminQuestionnairePage() {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getQuestionnaireResponses()
      .then(setResponses)
      .catch((err: Error) => setFetchError(err.message ?? 'Failed to load questionnaire responses.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return responses;
    return responses.filter((response) =>
      response.fullName.toLowerCase().includes(q) ||
      response.phoneNumber.toLowerCase().includes(q) ||
      response.city.toLowerCase().includes(q) ||
      response.currentPlatform.toLowerCase().includes(q),
    );
  }, [responses, search]);

  const rewardOutstanding = responses.filter(
    (response) => response.freeInspectionCredits > 0 || response.freeDeliveryCredits > 0,
  ).length;

  if (loading) return <div className="flex items-center justify-center py-32 text-sm text-muted">Loading questionnaire responses...</div>;
  if (fetchError) return <div className="flex items-center justify-center py-32 text-sm text-red-500">{fetchError}</div>;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">Questionnaire Responses</h1>
          <p className="mt-1 text-sm text-muted">
            {filtered.length} of {responses.length} responses. {rewardOutstanding} with reward credits left.
          </p>
        </div>
        <Link
          href="/questionnaire"
          target="_blank"
          className="inline-flex min-h-10 w-fit items-center justify-center rounded-full border border-surface-alt bg-white px-5 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
        >
          Open public form
        </Link>
      </div>

      <div className="rounded-[1.75rem] bg-white p-4 shadow-sm sm:p-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, city, or platform..."
          className="min-h-12 w-full rounded-2xl border border-surface-alt bg-surface px-4 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted">No responses match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-alt bg-surface text-left">
                <tr>
                  {['Name', 'Type', 'Platform', 'Likelihood', 'Rewards', 'Status', 'Date'].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-alt">
                {filtered.map((response) => (
                  <tr key={response.id} className="transition-colors hover:bg-surface/60">
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={`/admin/questionnaire/${response.id}`} className="font-semibold text-primary hover:underline">
                        {response.fullName}
                      </Link>
                      <div className="text-xs text-muted">{response.phoneNumber} · {response.city}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 capitalize text-copy">{response.userType}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-copy">{response.currentPlatform}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-copy">{response.likelihoodToUse}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-copy">
                      {response.freeInspectionCredits} inspection / {response.freeDeliveryCredits} delivery
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <LeadStatusBadge status={response.leadStatus} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{formatDate(response.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
