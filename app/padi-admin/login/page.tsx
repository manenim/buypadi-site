'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

type LoginState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

async function readApiMessage(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? fallback);
  }
  return body?.message ?? fallback;
}

function InlineSpinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Subtle "Scattered proof" field for the off-white surface — dot texture, a
// focal trust-pulse ring offset to the right, and a few faint brand motifs.
function AuthBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
      fill="none"
    >
      <defs>
        <pattern id="login-dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#063B27" opacity="0.07" />
        </pattern>
        <radialGradient id="login-bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8DC342" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8DC342" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#login-dots)" />

      {/* soft lime bloom behind the rings for presence */}
      <circle cx="1040" cy="440" r="420" fill="url(#login-bloom)" />

      {/* focal trust-pulse rings, offset right so they fill the open space */}
      <g fill="none" stroke="#8DC342" strokeWidth="1.6">
        <circle cx="1040" cy="440" r="180" opacity="0.55" />
        <circle cx="1040" cy="440" r="300" opacity="0.4" />
        <circle cx="1040" cy="440" r="430" opacity="0.26" />
        <circle cx="1040" cy="440" r="580" opacity="0.14" />
      </g>

      {/* brand motifs scattered in the open right field */}
      <g fill="none" stroke="#063B27" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(1000,170) rotate(-10) scale(1.7)" strokeWidth="2" opacity="0.13">
          <circle cx="16" cy="16" r="11" />
          <path d="M24 24 l9 9" />
        </g>
        <g transform="translate(1230,640) rotate(8) scale(1.6)" strokeWidth="2" opacity="0.12">
          <path d="M16 2 C23 2 28 7 28 14 C28 24 16 35 16 35 C16 35 4 24 4 14 C4 7 9 2 16 2 Z" />
          <circle cx="16" cy="14" r="4" />
        </g>
        <g transform="translate(800,700) rotate(-6) scale(1.45)" strokeWidth="2" opacity="0.1">
          <path d="M4 12 L20 4 L36 12 L36 30 L20 38 L4 30 Z" />
          <path d="M4 12 L20 20 L36 12" />
          <path d="M20 20 L20 38" />
        </g>
      </g>

      <g fill="#8DC342" opacity="0.7">
        <circle cx="1019" cy="190" r="2.8" />
        <circle cx="1248" cy="664" r="2.8" />
      </g>
    </svg>
  );
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

  const headline = token
    ? state === 'verified'
      ? 'You’re in.'
      : state === 'error'
        ? 'That link didn’t work.'
        : 'Verifying your link.'
    : 'Sign in to the console.';

  const intro = token
    ? state === 'verified'
      ? 'Access verified — opening the BuyPadi admin console.'
      : state === 'verifying'
        ? 'Confirming your one-time access link. This only takes a moment.'
        : 'The link may have expired or already been used. Request a fresh one below.'
    : 'Access is passwordless. We email a one-time secure link to the registered BuyPadi admin address — nothing to remember.';

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface">
      <AuthBackdrop />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-7">
        <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
          <Image
            src="/assets/buypadi-logo.png"
            alt="BuyPadi"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-muted transition-colors hover:text-primary"
        >
          Back to site
        </Link>
      </div>

      {/* asymmetric left-anchored column on the patterned field */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-6xl items-center px-6 sm:px-10">
        <div className="bp-rise w-full max-w-[27rem]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime-dark">
            Secure admin access
          </p>

          <h1 className="mt-4 font-display text-[2.25rem] font-black leading-[1.08] tracking-tight text-primary sm:text-[2.75rem]">
            {headline.endsWith('.') ? (
              <>
                {headline.slice(0, -1)}
                <span className="text-lime">.</span>
              </>
            ) : (
              headline
            )}
          </h1>

          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-copy">
            {intro}
          </p>

          {/* request action — covers idle, sending and error (with retry) */}
          {state !== 'sent' && !(token && (state === 'verifying' || state === 'verified')) && (
            <div className="mt-8 max-w-md">
              {state === 'error' && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50/80 px-5 py-4">
                  <p className="text-sm font-medium leading-relaxed text-red-700">
                    {message ?? 'Something went wrong. Please try again.'}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={requestAccess}
                disabled={isBusy}
                className="group inline-flex min-h-13 items-center justify-center gap-2.5 rounded-xl bg-primary px-7 font-display text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === 'sending' ? (
                  <>
                    <InlineSpinner className="h-4 w-4" />
                    Sending secure link…
                  </>
                ) : state === 'error' ? (
                  token ? 'Request a fresh link' : 'Try again'
                ) : (
                  <>
                    Email me a secure link
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* sent confirmation */}
          {state === 'sent' && (
            <div className="mt-8 max-w-md">
              <div className="rounded-xl border border-lime/40 bg-lime-light/60 px-5 py-4">
                <p className="font-display text-sm font-bold text-primary">
                  Secure link sent
                </p>
                <p className="mt-1 text-sm leading-relaxed text-copy">
                  {message ?? 'Check the BuyPadi admin inbox and open the link to continue.'}
                </p>
              </div>
              <button
                type="button"
                onClick={requestAccess}
                disabled={isBusy}
                className="mt-4 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-lime-dark hover:underline disabled:opacity-60"
              >
                Didn’t get it? Resend the link
              </button>
            </div>
          )}

          {/* verifying / verified — inline status */}
          {token && (state === 'verifying' || state === 'verified') && (
            <div className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-copy">
              <InlineSpinner className="h-5 w-5 text-lime-dark" />
              {state === 'verified' ? 'Redirecting…' : 'Securing your session…'}
            </div>
          )}

          {/* footer micro-note */}
          <p className="mt-12 flex items-center gap-2 text-xs text-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            One-time link · expires shortly · no password stored
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <InlineSpinner className="h-10 w-10 text-primary" />
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
