'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/padi-admin', label: 'Dashboard', exact: true, icon: 'dashboard' },
  { href: '/padi-admin/requests', label: 'Requests', exact: false, icon: 'requests' },
  { href: '/padi-admin/questionnaire', label: 'Questionnaire', exact: false, icon: 'forms' },
  { href: '/padi-admin/waitlist', label: 'Waitlist', exact: false, icon: 'waitlist' },
] as const;

type AdminNavProps = {
  orientation?: 'horizontal' | 'vertical';
};

function NavIcon({ icon }: { icon: (typeof NAV_ITEMS)[number]['icon'] }) {
  if (icon === 'requests') {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.008v.008H3.75V6.75Zm0 5.25h.008v.008H3.75V12Zm0 5.25h.008v.008H3.75v-.008Z" />
      </svg>
    );
  }

  if (icon === 'forms') {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M6.75 3.75h10.5A2.25 2.25 0 0 1 19.5 6v12a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z" />
      </svg>
    );
  }

  if (icon === 'waitlist') {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 4.125 4.125 0 0 0 4.125-4.125 3.375 3.375 0 0 0-3.375-3.375h-.75M9 19.128a9.38 9.38 0 0 1-2.625.372 4.125 4.125 0 0 1-4.125-4.125A3.375 3.375 0 0 1 5.625 12h.75m8.25-4.875a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm-9 4.875a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Zm18 0a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h6.75v6.75H3.75V13.5Zm9.75 0h6.75v6.75H13.5V13.5ZM3.75 3.75h6.75v6.75H3.75V3.75Zm9.75 0h6.75v6.75H13.5V3.75Z" />
    </svg>
  );
}

export default function AdminNav({ orientation = 'horizontal' }: AdminNavProps) {
  const pathname = usePathname();
  const isVertical = orientation === 'vertical';

  return (
    <nav className={isVertical ? 'flex flex-col gap-1' : 'flex gap-2 overflow-x-auto px-4 py-3 sm:px-6'}>
      {NAV_ITEMS.map(({ href, label, exact, icon }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={
              isVertical
                ? `inline-flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                : `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-alt bg-white text-copy hover:border-primary/20 hover:text-primary'
                  }`
            }
          >
            <NavIcon icon={icon} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
