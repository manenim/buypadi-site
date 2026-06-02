import Image from 'next/image';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-alt bg-white/95 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/padi-admin" className="flex items-center gap-3">
          <Image
            src="/assets/buypadi-logo.png"
            alt="BuyPadi"
            width={104}
            height={32}
            className="h-8 w-auto object-contain"
          />
          <span className="hidden text-[11px] font-bold uppercase tracking-[0.22em] text-muted sm:block">
            Ops Console
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden min-h-9 items-center justify-center rounded-lg border border-surface-alt px-4 text-xs font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary sm:inline-flex"
          >
            Public site
          </Link>
          <form action="/api/admin-auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
