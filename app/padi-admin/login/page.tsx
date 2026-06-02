'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import BrandWordmark from '@/app/components/BrandWordmark';
import Spinner from '@/app/components/Spinner';

type LoginState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

async function readApiMessage(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? fallback);
  }
  return body?.message ?? fallback;
}

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const nextPath = useMemo(() => {
    const value = searchParams.get('next');
    return value?.startsWith('/padi-admin') && value !== '/padi-admin/login'
      ? value
      : '/padi-admin';
  }, [searchParams]);

  const [state, setState] = useState<LoginState>(token ? 'verifying' : 'idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verifyToken() {
      setState('verifying');
      setMessage(null);
      try {
        const response = await fetch('/api/admin-auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        await readApiMessage(response, 'Admin access verified');
        if (cancelled) return;

        setState('verified');
        setMessage('Access verified. Opening the admin console...');
        router.replace(nextPath);
      } catch (error) {
        if (cancelled) return;
        setState('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'This login link is invalid or expired.',
        );
      }
    }

    void verifyToken();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router, token]);

  async function requestAccess() {
    setState('sending');
    setMessage(null);
    try {
      const response = await fetch('/api/admin-auth/request-access', {
        method: 'POST',
      });
      await readApiMessage(response, 'Login access link sent');
      setState('sent');
      setMessage('We sent a secure login link to the BuyPadi admin email.');
    } catch (error) {
      setState('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not send the login link. Please try again.',
      );
    }
  }

  const isBusy = state === 'sending' || state === 'verifying';

  return (
    <div className="flex min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <main className="m-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex min-h-[24rem] flex-col justify-between bg-primary px-6 py-8 text-white sm:px-8 lg:px-10">
          <Link href="/" className="inline-flex w-fit items-center">
            <BrandWordmark />
          </Link>

          <div className="mt-16 space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime">
              Admin security
            </p>
            <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl">
              Passwordless access for the BuyPadi console
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Admin access is granted through a one-time secure link sent to the
              configured BuyPadi admin email.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-md flex-col gap-7">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime-dark">
                Admin login
              </p>
              <h2 className="font-display text-3xl font-black leading-tight text-heading">
                {token ? 'Verifying your link' : 'Request secure access'}
              </h2>
              <p className="text-sm leading-relaxed text-copy">
                {token
                  ? 'Hold on while we confirm this one-time access link.'
                  : 'We will email a login link to the BuyPadi admin address. No password needed.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-surface-alt bg-surface px-5 py-5">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-light text-primary">
                  {isBusy ? (
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.3}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 7.743V7.5"
                      />
                    </svg>
                  )}
                </span>
                <div className="space-y-1">
                  <p className="font-display text-sm font-bold text-heading">
                    {state === 'sent'
                      ? 'Check the admin inbox'
                      : state === 'verified'
                        ? 'Access granted'
                        : state === 'error'
                          ? 'Access link failed'
                          : token
                            ? 'Checking login link'
                            : 'One-time login link'}
                  </p>
                  <p className="text-sm leading-relaxed text-copy">
                    {message ??
                      (token
                        ? 'This should only take a moment.'
                        : 'The email will contain a link that opens the admin dashboard directly.')}
                  </p>
                </div>
              </div>
            </div>

            {!token && (
              <button
                type="button"
                onClick={requestAccess}
                disabled={isBusy}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-8 font-display text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'sending' ? 'Sending link...' : 'Request login access'}
              </button>
            )}

            {token && state === 'error' && (
              <button
                type="button"
                onClick={requestAccess}
                disabled={isBusy}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-primary px-8 font-display text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Request a fresh link
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <Spinner />
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
