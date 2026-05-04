'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getErrorMessage, type QuestionnaireLeadStatus, type QuestionnaireResponse } from '@/app/lib/api';

const STATUS_OPTIONS: { value: QuestionnaireLeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'not_interested', label: 'Not Interested' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="border-b border-surface-alt py-3 last:border-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm leading-relaxed text-heading">
        {value || <span className="italic text-subtle">-</span>}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-surface-alt bg-surface px-5 py-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-heading">{title}</h2>
      </div>
      <dl className="px-5 py-2">{children}</dl>
    </section>
  );
}

function listValue(items?: string[]) {
  return items?.length ? items.join(', ') : undefined;
}

export default function AdminQuestionnaireDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [response, setResponse] = useState<QuestionnaireResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getQuestionnaireResponse(id)
      .then(setResponse)
      .catch((err: Error) => setFetchError(err.message ?? 'Failed to load questionnaire response.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function saveManagement(formData: FormData) {
    if (!response) return;
    setMutationError(null);
    setSaved(false);

    try {
      const updated = await api.updateQuestionnaireResponse(response.id, {
        leadStatus: String(formData.get('leadStatus')) as QuestionnaireLeadStatus,
        freeInspectionCredits: Number(formData.get('freeInspectionCredits') ?? 0),
        freeDeliveryCredits: Number(formData.get('freeDeliveryCredits') ?? 0),
        adminNotes: String(formData.get('adminNotes') ?? ''),
      });
      setResponse(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setMutationError(getErrorMessage(err, 'Failed to update response.'));
    }
  }

  if (loading) return <div className="flex items-center justify-center py-32 text-sm text-muted">Loading...</div>;
  if (fetchError) return <div className="flex items-center justify-center py-32 text-sm text-red-500">{fetchError}</div>;
  if (!response) return <div className="flex items-center justify-center py-32 text-sm text-muted">Response not found.</div>;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-1">
        <Link href="/admin/questionnaire" className="inline-flex min-h-10 items-center text-xs text-muted transition-colors hover:text-primary sm:min-h-0">
          ← Questionnaire responses
        </Link>
        <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">{response.fullName}</h1>
        <p className="text-sm text-muted">Submitted {formatDate(response.createdAt)}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)] lg:gap-6">
        <div className="flex flex-col gap-5">
          <Section title="Contact">
            <DetailRow label="Full name" value={response.fullName} />
            <DetailRow label="Phone number" value={response.phoneNumber} />
            <DetailRow label="City / Location" value={response.city} />
            <DetailRow label="User type" value={response.userType} />
          </Section>

          <Section title="Platform and Trading Behavior">
            <DetailRow label="Trade categories" value={listValue(response.tradeCategories)} />
            <DetailRow label="Other trade category" value={response.tradeCategoryOther} />
            <DetailRow label="Current platform" value={response.currentPlatform} />
            <DetailRow label="Other platform" value={response.currentPlatformOther} />
            <DetailRow label="Why preferred" value={response.platformPreferenceReason} />
          </Section>

          <Section title="Trust and Scam Experience">
            <DetailRow label="Scam experience" value={response.scamExperience} />
            <DetailRow label="Loss amount" value={response.lossAmount} />
            <DetailRow label="Biggest issue" value={response.biggestIssue} />
            <DetailRow label="Other issue" value={response.biggestIssueOther} />
            <DetailRow label="Biggest fear" value={response.biggestFear} />
          </Section>

          <Section title="Pricing, Logistics, Speed">
            <DetailRow label="Escrow interest" value={response.escrowInterest} />
            <DetailRow label="Maximum fee" value={response.maxFee} />
            <DetailRow label="Delivery time" value={response.deliveryTime} />
            <DetailRow label="Delivery frustration" value={response.deliveryFrustration} />
            <DetailRow label="Transaction completion time" value={response.transactionCompletionTime} />
            <DetailRow label="What slows transactions" value={response.transactionSlowdown} />
          </Section>

          <Section title="Features and Intent">
            <DetailRow label="Trust features" value={listValue(response.trustFeatures)} />
            <DetailRow label="Pay extra for inspection" value={response.payExtraForInspection} />
            <DetailRow label="Likelihood to use" value={response.likelihoodToUse} />
            <DetailRow label="Immediate trigger" value={response.immediateUseReason} />
          </Section>
        </div>

        <aside className="lg:sticky lg:top-30">
          <form action={saveManagement} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-heading">Management</h2>
              {saved && <span className="text-xs font-semibold text-lime-dark">Saved</span>}
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted">Lead status</label>
            <select
              name="leadStatus"
              defaultValue={response.leadStatus}
              className="mt-2 min-h-11 w-full rounded-xl border border-surface-alt bg-surface px-3 text-sm font-medium text-heading focus:border-lime focus:outline-none"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted">Inspection credits</label>
                <input
                  name="freeInspectionCredits"
                  type="number"
                  min="0"
                  defaultValue={response.freeInspectionCredits}
                  className="mt-2 min-h-11 w-full rounded-xl border border-surface-alt bg-surface px-3 text-sm font-medium text-heading focus:border-lime focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted">Delivery credits</label>
                <input
                  name="freeDeliveryCredits"
                  type="number"
                  min="0"
                  defaultValue={response.freeDeliveryCredits}
                  className="mt-2 min-h-11 w-full rounded-xl border border-surface-alt bg-surface px-3 text-sm font-medium text-heading focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">Admin notes</label>
            <textarea
              name="adminNotes"
              rows={5}
              defaultValue={response.adminNotes ?? ''}
              className="mt-2 w-full resize-none rounded-xl border border-surface-alt bg-surface px-3 py-3 text-sm text-heading placeholder:text-subtle focus:border-lime focus:outline-none"
              placeholder="Add internal follow-up notes..."
            />

            {mutationError && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{mutationError}</p>}

            <button
              type="submit"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Save changes
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
