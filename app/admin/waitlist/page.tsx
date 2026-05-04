'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, type WaitlistEntry, type WaitlistStatus } from '@/app/lib/api';

const STATUS_OPTIONS: { value: WaitlistStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'invited', label: 'Invited' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    api.getWaitlistEntries()
      .then(setEntries)
      .catch((err: Error) => setFetchError(err.message ?? 'Failed to load waitlist.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) =>
      entry.fullName.toLowerCase().includes(q) ||
      entry.email.toLowerCase().includes(q) ||
      entry.phoneNumber.toLowerCase().includes(q),
    );
  }, [entries, search]);

  async function updateStatus(entry: WaitlistEntry, status: WaitlistStatus) {
    setSavingId(entry.id);
    try {
      const updated = await api.updateWaitlistEntry(entry.id, { status });
      setEntries((current) => current.map((item) => item.id === updated.id ? updated : item));
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-sm text-muted">Loading waitlist...</div>;
  if (fetchError) return <div className="flex items-center justify-center py-32 text-sm text-red-500">{fetchError}</div>;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">Waitlist</h1>
        <p className="mt-1 text-sm text-muted">{filtered.length} of {entries.length} entries</p>
      </div>

      <div className="rounded-[1.75rem] bg-white p-4 shadow-sm sm:p-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="min-h-12 w-full rounded-2xl border border-surface-alt bg-surface px-4 text-sm text-heading placeholder:text-subtle transition-colors focus:border-lime focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted">No waitlist entries match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-alt bg-surface text-left">
                <tr>
                  {['Name', 'Email', 'Phone', 'Status', 'Date'].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-alt">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="transition-colors hover:bg-surface/60">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-heading">{entry.fullName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-copy">
                      <a href={`mailto:${entry.email}`} className="hover:text-primary hover:underline">{entry.email}</a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-copy">{entry.phoneNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <select
                        value={entry.status}
                        disabled={savingId === entry.id}
                        onChange={(e) => updateStatus(entry, e.target.value as WaitlistStatus)}
                        className="min-h-10 rounded-xl border border-surface-alt bg-surface px-3 text-xs font-semibold capitalize text-heading focus:border-lime focus:outline-none disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{formatDate(entry.createdAt)}</td>
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
