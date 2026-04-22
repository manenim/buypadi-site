'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/requests', label: 'Requests', exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-surface-alt bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/buypadi-logo.png"
              alt="BuyPadi"
              width={104}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                BuyPadi Ops
              </p>
              <p className="truncate text-sm font-semibold text-heading">
                Inspection Admin
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-surface-alt px-4 text-xs font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
          >
            Public site
          </Link>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-alt bg-surface text-copy hover:border-primary/20 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
