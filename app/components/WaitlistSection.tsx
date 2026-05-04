'use client';

import { useState } from 'react';
import { api, getErrorMessage } from '@/app/lib/api';

const inputClass =
  'min-h-13 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-medium text-white placeholder:text-white/45 outline-none transition-colors focus:border-lime focus:bg-white/15';

export default function WaitlistSection() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
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
      e.currentTarget.reset();
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

        <form onSubmit={handleSubmit} className="bg-white/[0.07] px-6 py-8 sm:px-8 lg:px-12 lg:py-14">
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
          {success && <p className="mt-4 rounded-2xl bg-lime/15 px-4 py-3 text-sm font-semibold text-lime">You are on the waitlist. We will reach out soon.</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-lime px-6 font-display text-base font-bold text-primary shadow-lg transition-colors hover:bg-lime-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Joining...' : 'Join waitlist'}
          </button>
        </form>
      </div>
    </section>
  );
}
