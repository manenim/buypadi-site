import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — BuyPadi",
  description: "We looked everywhere,  this page isn't here.",
};

/**
 * Root 404. In the App Router this file also catches every unmatched URL across
 * the whole app, and renders inside the root layout (so it inherits the brand
 * fonts + base body classes). Static server component — no client JS needed.
 *
 * Light surface variant: the "Scattered proof" system on off-white — a faint dot
 * texture, dark brand line-motifs scattered organically, and a focal lime ring
 * "trust pulse" behind the headline. The magnifier forms the 0 in 404, peering at
 * an empty dashed circle: we inspected, and found nothing here.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-6 py-20 text-center">
      <ScatteredProofBackdrop />

      {/* Brand logo — quiet way home, top-left (out of the centering flow) */}
      <div className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8">
        <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
          <Image
            src="/assets/buypadi-logo.png"
            alt="BuyPadi"
            width={120}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Center stage */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-6">
        {/* 4 · magnifier-as-0 · 4 */}
        <div className="flex w-full items-center justify-center gap-1 sm:gap-3">
          <span className="font-display text-[5rem] font-extrabold leading-none text-primary sm:text-[10rem]">
            4
          </span>
          <svg
            viewBox="0 0 130 150"
            className="h-20 w-16 shrink-0 sm:h-44 sm:w-40"
            fill="none"
            role="img"
            aria-label="A magnifying glass finding nothing"
          >
            {/* lens */}
            <circle cx="60" cy="58" r="44" fill="rgba(141,195,66,0.12)" />
            <circle cx="60" cy="58" r="44" stroke="#063B27" strokeWidth="10" />
            {/* "nothing found" inside the lens */}
            <circle
              cx="60"
              cy="58"
              r="22"
              stroke="#8DC342"
              strokeWidth="3"
              strokeDasharray="3 7"
            />
            {/* handle */}
            <line
              x1="92"
              y1="90"
              x2="120"
              y2="122"
              stroke="#063B27"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-[5rem] font-extrabold leading-none text-primary sm:text-[10rem]">
            4
          </span>
        </div>

        <span className="font-display text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-lime-dark">
          Inspection complete
        </span>

        <h1 className="font-display w-full max-w-xl text-3xl font-extrabold leading-tight text-balance text-primary sm:text-4xl">
          We looked everywhere — this page isn&apos;t here.
        </h1>

        <p className="w-full max-w-md text-base leading-relaxed text-pretty text-copy">
          The link may be broken or the page may have moved. Let&apos;s get you
          back to something real.
        </p>

        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="font-display inline-flex items-center rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            href="/track"
            className="font-display inline-flex items-center rounded-full border-2 border-slate-300 px-6 py-3.5 text-base font-bold text-primary transition-colors hover:border-primary/40"
          >
            Track an order
          </Link>
          <Link
            href="/request"
            className="font-display inline-flex items-center rounded-full border-2 border-slate-300 px-6 py-3.5 text-base font-bold text-primary transition-colors hover:border-primary/40"
          >
            Request inspection
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Decorative "Scattered proof" background, tuned for the off-white surface:
 * dark dot texture + lime focal rings + dark brand motifs (magnifier=inspect,
 * shield=verified, pin=anywhere, parcel=deliver) scattered organically at low
 * opacity. Purely decorative — hidden from a11y tree.
 */
function ScatteredProofBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 600"
      fill="none"
    >
      <defs>
        <pattern id="nf-dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#063B27" opacity="0.05" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#nf-dots)" />

      {/* focal trust-pulse rings, centred behind the headline */}
      <g fill="none" stroke="#8DC342">
        <circle cx="400" cy="270" r="150" opacity="0.30" />
        <circle cx="400" cy="270" r="230" opacity="0.18" />
        <circle cx="400" cy="270" r="320" opacity="0.10" />
      </g>

      {/* scattered meaningful motifs — varied scale / rotation / opacity */}
      <g fill="none" stroke="#063B27" strokeLinecap="round" strokeLinejoin="round">
        {/* magnifier — inspect */}
        <g transform="translate(90,70) rotate(-12) scale(1.15)" strokeWidth="2" opacity="0.10">
          <circle cx="16" cy="16" r="11" />
          <path d="M24 24 l9 9" />
        </g>
        {/* shield + check — verified */}
        <g transform="translate(640,90) rotate(8) scale(1.2)" strokeWidth="2" opacity="0.10">
          <path d="M18 2 L33 8 V19 C33 28 26 35 18 38 C10 35 3 28 3 19 V8 Z" />
          <path d="M10 19 l6 6 l9 -11" />
        </g>
        {/* location pin — anywhere */}
        <g transform="translate(120,470) rotate(8) scale(1.1)" strokeWidth="2" opacity="0.09">
          <path d="M16 2 C23 2 28 7 28 14 C28 24 16 35 16 35 C16 35 4 24 4 14 C4 7 9 2 16 2 Z" />
          <circle cx="16" cy="14" r="4" />
        </g>
        {/* parcel — deliver */}
        <g transform="translate(650,460) rotate(-8) scale(1.05)" strokeWidth="2" opacity="0.09">
          <path d="M4 12 L20 4 L36 12 L36 30 L20 38 L4 30 Z" />
          <path d="M4 12 L20 20 L36 12" />
          <path d="M20 20 L20 38" />
        </g>
        {/* check badge — safe (small echo) */}
        <g transform="translate(710,270) rotate(10) scale(0.8)" strokeWidth="2.4" opacity="0.08">
          <circle cx="18" cy="18" r="13" />
          <path d="M11 18 l5 5 l9 -11" />
        </g>
      </g>

      {/* tiny lime nodes for cohesion */}
      <g fill="#8DC342" opacity="0.5">
        <circle cx="104" cy="86" r="2.2" />
        <circle cx="664" cy="106" r="2.2" />
        <circle cx="134" cy="486" r="2.2" />
      </g>
    </svg>
  );
}
