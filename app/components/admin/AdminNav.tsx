'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/requests', label: 'Requests', exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2">
      {NAV_ITEMS.map(({ href, label, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex min-h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors ${
              active
                ? 'border-primary bg-primary text-white'
                : 'border-surface-alt bg-white text-copy hover:border-primary/20 hover:text-primary'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
