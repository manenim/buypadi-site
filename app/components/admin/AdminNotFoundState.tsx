import Link from 'next/link';

export default function AdminNotFoundState({
  eyebrow,
  title,
  message,
  resourceId,
  primaryHref,
  primaryLabel,
  secondaryHref = '/padi-admin',
  secondaryLabel = 'Open dashboard',
}: {
  eyebrow: string;
  title: string;
  message: string;
  resourceId?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative min-h-[34rem] overflow-hidden rounded-lg border border-surface-alt bg-white shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-lime" />

      <div className="grid min-h-[34rem] items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)] lg:px-10">
        <div className="relative z-10 max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime-dark">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight text-heading sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            {message}
          </p>

          {resourceId && (
            <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-surface-alt bg-surface px-3 py-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                Tried
              </span>
              <code className="truncate text-xs font-bold text-heading">
                {resourceId}
              </code>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-alt bg-white px-5 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <AdminNotFoundIllustration />
        </div>
      </div>
    </section>
  );
}

function AdminNotFoundIllustration() {
  return (
    <svg
      viewBox="0 0 520 360"
      className="h-auto w-full"
      fill="none"
      role="img"
      aria-label="A BuyPadi admin search found no matching record"
    >
      <rect x="36" y="38" width="352" height="244" rx="20" fill="#063B27" />
      <rect x="62" y="68" width="300" height="184" rx="14" fill="#F3F6F2" />
      <path
        d="M88 104H214M88 136H320M88 168H288M88 200H246"
        stroke="#587266"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.22"
      />
      <path
        d="M272 104H320"
        stroke="#8DC342"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <g transform="translate(238 126)">
        <rect x="0" y="0" width="110" height="92" rx="14" fill="#FFFFFF" />
        <rect x="20" y="24" width="70" height="8" rx="4" fill="#DCE7D8" />
        <rect x="20" y="44" width="48" height="8" rx="4" fill="#DCE7D8" />
        <path
          d="M32 68H78"
          stroke="#8DC342"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="2 13"
        />
      </g>

      <g transform="translate(286 154) rotate(-10)">
        <circle cx="70" cy="70" r="55" fill="#EAF8D4" />
        <circle cx="70" cy="70" r="39" stroke="#063B27" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r="18"
          stroke="#8DC342"
          strokeWidth="5"
          strokeDasharray="3 8"
        />
        <path
          d="M100 100L146 146"
          stroke="#063B27"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </g>

      <g fill="#8DC342">
        <circle cx="76" cy="306" r="5" />
        <circle cx="406" cy="72" r="4" />
        <circle cx="432" cy="274" r="6" />
      </g>
      <path
        d="M74 324C116 342 190 342 238 318"
        stroke="#8DC342"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 16"
      />
    </svg>
  );
}
