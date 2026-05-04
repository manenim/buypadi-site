'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import QuestionnaireHeader from '@/app/components/questionnaire/QuestionnaireHeader';
import { api, getErrorMessage, type QuestionnairePayload, type ScamExperience, type TernaryAnswer, type UserType } from '@/app/lib/api';

const tradeOptions = [
  'Phones & Electronics',
  'Fashion (Clothes, Shoes, Bags)',
  'Gadgets & Accessories',
  'Cars / High-value items',
  'Home appliances',
  'Digital products/services',
];

const platformOptions = [
  'Facebook Marketplace',
  'Instagram',
  'WhatsApp',
  'Telegram',
  'Jiji.ng',
  'Personal referrals',
];

const lossOptions = ['₦1,000 - ₦10,000', '₦10,000 - ₦50,000', '₦50,000 - ₦200,000', '₦200,000+'];
const issueOptions = ['Paid but did not receive item', 'Fake/different item', 'Seller disappeared', 'Buyer refused to pay', 'Delivery issues'];
const fearOptions = ['Losing money', 'Fake products', 'No accountability', 'Delivery issues', 'Time wasting'];
const feeOptions = ['1%', '2%', '3%', '4%+', 'Would not pay'];
const deliveryTimeOptions = ['Same day', '1-2 days', '3-5 days', '1 week+'];
const deliveryFrustrationOptions = ['Delays', 'Damaged goods', 'No tracking', 'Rider issues', 'High cost'];
const transactionTimeOptions = ['Same day', '1-3 days', '3-7 days', '1 week+'];
const trustFeatureOptions = ['Escrow', 'Verified sellers', 'Product inspection', 'Pay on delivery', 'Buyer protection', 'Ratings & reviews'];
const likelihoodOptions = ['Very likely', 'Likely', 'Not sure', 'Unlikely'];

const inputClass =
  'w-full rounded-2xl border border-surface-alt bg-white px-4 py-3 text-sm text-heading placeholder:text-subtle shadow-sm transition-colors focus:border-lime focus:outline-none';

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime-dark">{eyebrow}</p>
      <h2 className="mt-2 font-display text-xl font-black text-heading sm:text-2xl">{title}</h2>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-heading">{label}</p>
      {children}
    </div>
  );
}

function RadioGroup({
  name,
  options,
  required = true,
}: {
  name: string;
  options: { label: string; value: string }[] | string[];
  required?: boolean;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const label = typeof option === 'string' ? option : option.label;
        const value = typeof option === 'string' ? option : option.value;
        return (
          <label
            key={value}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-surface-alt bg-surface px-4 py-3 text-sm font-semibold text-copy transition-colors has-[:checked]:border-primary has-[:checked]:bg-lime-light has-[:checked]:text-primary"
          >
            <input type="radio" name={name} value={value} required={required} className="h-4 w-4 accent-primary" />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxGroup({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-surface-alt bg-surface px-4 py-3 text-sm font-semibold text-copy transition-colors has-[:checked]:border-primary has-[:checked]:bg-lime-light has-[:checked]:text-primary"
        >
          <input type="checkbox" name={name} value={option} className="h-4 w-4 rounded accent-primary" />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function getText(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim();
}

function getList(formData: FormData, name: string) {
  return formData.getAll(name).map(String).map((item) => item.trim()).filter(Boolean);
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const tradeCategories = getList(formData, 'tradeCategories');
    const trustFeatures = getList(formData, 'trustFeatures');

    if (tradeCategories.length === 0 || trustFeatures.length === 0) {
      setError('Please select at least one trade category and one trust feature.');
      return;
    }

    const payload: QuestionnairePayload = {
      userType: getText(formData, 'userType') as UserType,
      tradeCategories,
      tradeCategoryOther: getText(formData, 'tradeCategoryOther') || undefined,
      currentPlatform: getText(formData, 'currentPlatform'),
      currentPlatformOther: getText(formData, 'currentPlatformOther') || undefined,
      platformPreferenceReason: getText(formData, 'platformPreferenceReason'),
      scamExperience: getText(formData, 'scamExperience') as ScamExperience,
      lossAmount: getText(formData, 'lossAmount') || undefined,
      biggestIssue: getText(formData, 'biggestIssue'),
      biggestIssueOther: getText(formData, 'biggestIssueOther') || undefined,
      biggestFear: getText(formData, 'biggestFear'),
      escrowInterest: getText(formData, 'escrowInterest') as TernaryAnswer,
      maxFee: getText(formData, 'maxFee'),
      deliveryTime: getText(formData, 'deliveryTime'),
      deliveryFrustration: getText(formData, 'deliveryFrustration'),
      transactionCompletionTime: getText(formData, 'transactionCompletionTime'),
      transactionSlowdown: getText(formData, 'transactionSlowdown'),
      trustFeatures,
      payExtraForInspection: getText(formData, 'payExtraForInspection') as TernaryAnswer,
      likelihoodToUse: getText(formData, 'likelihoodToUse'),
      immediateUseReason: getText(formData, 'immediateUseReason'),
      fullName: getText(formData, 'fullName'),
      phoneNumber: getText(formData, 'phoneNumber'),
      city: getText(formData, 'city'),
    };

    setSubmitting(true);
    try {
      await api.submitQuestionnaire(payload);
      router.push('/questionnaire/success');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Could not submit the questionnaire. Please try again.'));
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <QuestionnaireHeader />
      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem] bg-primary text-white shadow-sm">
              <div className="px-6 py-8 sm:px-8">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime">BuyPadi waitlist</p>
                <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">
                  Stop risking your money online.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  Join the BuyPadi waitlist and be among the first to experience secure buying and selling with verified vendors, and controlled delivery.
                </p>
              </div>
              <div className="border-t border-white/10 px-6 py-6 sm:px-8">
                <p className="text-sm font-bold text-white">Early users get</p>
                <div className="mt-4 space-y-3">
                  {['0% fees on first transaction (limited)', 'Priority access at launch', 'Exclusive trust badge for sellers', 'First inspection and delivery reward tracking'].map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-primary">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-sm leading-relaxed text-white/75">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Section eyebrow="Section 1" title="User type">
              <Field label="What best describes you?">
                <RadioGroup
                  name="userType"
                  options={[
                    { label: 'I mostly BUY online', value: 'buyer' },
                    { label: 'I mostly SELL online', value: 'seller' },
                    { label: 'I do BOTH', value: 'both' },
                  ]}
                />
              </Field>
              <Field label="What do you usually trade or buy?">
                <CheckboxGroup name="tradeCategories" options={tradeOptions} />
                <input name="tradeCategoryOther" placeholder="Others" className={`${inputClass} mt-3`} />
              </Field>
            </Section>

            <Section eyebrow="Section 2" title="Platform behavior">
              <Field label="Where do you currently buy or sell the most?">
                <RadioGroup name="currentPlatform" options={platformOptions} />
                <input name="currentPlatformOther" placeholder="Other platform" className={`${inputClass} mt-3`} />
              </Field>
              <Field label="Why do you prefer those platforms?">
                <textarea name="platformPreferenceReason" required rows={4} className={inputClass} placeholder="Tell us what makes those platforms work for you." />
              </Field>
            </Section>

            <Section eyebrow="Section 3" title="Trust and scam experience">
              <Field label="Have you ever been scammed?">
                <RadioGroup name="scamExperience" options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }, { label: 'Almost', value: 'almost' }]} />
              </Field>
              <Field label="If yes, how much did you lose?">
                <RadioGroup name="lossAmount" options={lossOptions} required={false} />
              </Field>
              <Field label="Biggest issue faced">
                <RadioGroup name="biggestIssue" options={issueOptions} />
                <input name="biggestIssueOther" placeholder="Other issue" className={`${inputClass} mt-3`} />
              </Field>
              <Field label="What scares you most?">
                <RadioGroup name="biggestFear" options={fearOptions} />
              </Field>
            </Section>

            <Section eyebrow="Section 4" title="Pricing sensitivity">
              <Field label="Would you use a trusted platform that holds your payment in escrow if it guarantees safety?">
                <RadioGroup name="escrowInterest" options={[{ label: 'Yes', value: 'yes' }, { label: 'Maybe', value: 'maybe' }, { label: 'No', value: 'no' }]} />
              </Field>
              <Field label="Maximum fee you would pay">
                <RadioGroup name="maxFee" options={feeOptions} />
              </Field>
            </Section>

            <Section eyebrow="Section 5" title="Logistics">
              <Field label="Preferred delivery time">
                <RadioGroup name="deliveryTime" options={deliveryTimeOptions} />
              </Field>
              <Field label="Biggest delivery frustration">
                <RadioGroup name="deliveryFrustration" options={deliveryFrustrationOptions} />
              </Field>
            </Section>

            <Section eyebrow="Section 6" title="Transaction speed">
              <Field label="How quickly do your transactions usually complete?">
                <RadioGroup name="transactionCompletionTime" options={transactionTimeOptions} />
              </Field>
              <Field label="What slows transactions most?">
                <textarea name="transactionSlowdown" required rows={4} className={inputClass} placeholder="Example: waiting for trust, delivery delays, payment confirmation..." />
              </Field>
            </Section>

            <Section eyebrow="Section 7" title="Trust features">
              <Field label="Which features build trust for you?">
                <CheckboxGroup name="trustFeatures" options={trustFeatureOptions} />
              </Field>
              <Field label="Would you pay extra for product inspection?">
                <RadioGroup name="payExtraForInspection" options={[{ label: 'Yes', value: 'yes' }, { label: 'Maybe', value: 'maybe' }, { label: 'No', value: 'no' }]} />
              </Field>
            </Section>

            <Section eyebrow="Section 8" title="Buying intent">
              <Field label="How likely are you to use BuyPadi?">
                <RadioGroup name="likelihoodToUse" options={likelihoodOptions} />
              </Field>
              <Field label="What would make you use it immediately?">
                <textarea name="immediateUseReason" required rows={4} className={inputClass} placeholder="Tell us the one thing that would make BuyPadi a must-use for you." />
              </Field>
            </Section>

            <Section eyebrow="Section 9" title="Contact details">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-heading">Full Name</label>
                  <input name="fullName" required className={inputClass} placeholder="Your full name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-heading">Phone Number (WhatsApp preferred)</label>
                  <input name="phoneNumber" required className={inputClass} placeholder="080..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-heading">City / Location</label>
                  <input name="city" required className={inputClass} placeholder="Lagos, Abuja, Port Harcourt..." />
                </div>
              </div>
            </Section>

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="sticky bottom-4 z-20 rounded-[1.5rem] border border-primary/10 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary px-6 font-display text-base font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit questionnaire'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
