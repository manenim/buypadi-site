'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api, getErrorMessage } from '@/app/lib/api';

const inputClass =
  'min-h-13 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-medium text-white placeholder:text-white/45 outline-none transition-colors focus:border-lime focus:bg-white/15';

function WaitlistSuccessPanel() {
  return (
    <div className="bg-white/[0.07] px-6 py-8 sm:px-8 lg:px-12 lg:py-14">
      <div className="relative flex h-full min-h-90 overflow-hidden rounded-[1.75rem] border border-lime/20 bg-[#0B4A32] px-6 py-8 text-white shadow-[0_22px_70px_rgba(0,0,0,0.16)] sm:px-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-lime/45" />
        <div className="absolute right-5 top-5 rounded-full border border-lime/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-lime">
          Reserved
        </div>

        <div className="grid w-full gap-8 self-center lg:grid-cols-[0.42fr_1fr] lg:items-center">
          <div className="flex justify-start">
            <div className="flex h-30 w-30 items-center justify-center rounded-[2rem] border border-lime/25 bg-lime/10 text-lime sm:h-36 sm:w-36">
              <svg className="h-20 w-20 sm:h-24 sm:w-24" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                <rect x="25" y="32" width="70" height="56" rx="14" fill="#8DC342" />
                <rect x="34" y="42" width="52" height="34" rx="8" fill="#063B27" />
                <path d="m38 48 18.5 14.5a6 6 0 0 0 7 0L82 48" stroke="#8DC342" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="84" cy="78" r="18" fill="#DDF9B8" />
                <path d="m75.5 78.5 5.5 5.5 12-13" stroke="#063B27" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="29" cy="24" r="4" fill="#8DC342" />
                <circle cx="98" cy="35" r="3.5" fill="#DDF9B8" />
              </svg>
            </div>
          </div>

          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime">You are on the waitlist</p>
            <h3 className="mt-3 max-w-md font-display text-2xl font-black leading-tight text-white sm:text-3xl">
              Thanks for joining BuyPadi early.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Your early-user reward has been reserved. Help us build a safer buying experience by filling out a quick questionnaire.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questionnaire"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-lime px-6 font-display text-sm font-black text-primary transition-colors hover:bg-lime-dark"
              >
                Fill the questionnaire
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/75 transition-colors hover:border-lime/45 hover:text-white"
              >
                Maybe later
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WaitlistSection() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setSuccess(false);

    const formData = new FormData(form);
    const fullName = String(formData.get('fullName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phoneNumber = String(formData.get('phoneNumber') ?? '').trim();

    if (!fullName || !email || !phoneNumber) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      await api.joinWaitlist({ fullName, email, phoneNumber });
      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Could not join the waitlist. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="waitlist" className="bg-surface px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-384 overflow-hidden rounded-[2rem] bg-primary shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
        <div className="px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime">Early access</p>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-black leading-tight text-white sm:text-4xl lg:text-[3rem]">
            Join the BuyPadi waitlist.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Be first to use protected payments, verified sellers, inspection support, and controlled delivery when we open the next launch batch.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-white/75 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {['Priority launch access', '0% first-transaction fee', 'Seller trust badge'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>

        {success ? (
          <WaitlistSuccessPanel />
        ) : (
          <form onSubmit={handleSubmit} className="flex bg-white/[0.07] px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
            <div className="m-auto w-full max-w-4xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-white">Full name</label>
                  <input name="fullName" required className={inputClass} placeholder="Your full name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">Email</label>
                  <input name="email" type="email" required className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">Phone number</label>
                  <input name="phoneNumber" required className={inputClass} placeholder="080..." />
                </div>
              </div>

              {error && <p className="mt-4 rounded-2xl bg-red-500/12 px-4 py-3 text-sm font-medium text-red-100">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-lime px-6 font-display text-base font-bold text-primary shadow-lg transition-colors hover:bg-lime-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Joining...' : 'Join waitlist'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
