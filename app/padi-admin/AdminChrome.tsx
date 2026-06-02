'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminNav from '@/app/components/admin/AdminNav';
import BrandWordmark from '@/app/components/BrandWordmark';

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/padi-admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-primary/20 bg-primary px-4 py-5 text-white lg:flex">
        <Link href="/padi-admin" className="flex items-center rounded-lg px-3 py-2">
          <BrandWordmark />
        </Link>

        <div className="mt-8">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
            Operations
          </p>
          <div className="mt-3">
            <AdminNav orientation="vertical" />
          </div>
        </div>

        <div className="mt-auto space-y-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
          <p className="px-1 text-xs leading-relaxed text-white/60">
            Manage inspection requests, invoices, waitlist entries, and customer
            questionnaire responses.
          </p>
          <Link
            href="/"
            className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/10 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Public site
          </Link>
          <form action="/api/admin-auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-lime text-sm font-bold text-primary transition-colors hover:bg-lime-bright"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <AdminHeader />
        <div className="border-b border-surface-alt bg-white lg:hidden">
          <AdminNav />
        </div>
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
