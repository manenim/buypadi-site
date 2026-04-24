import Image from 'next/image';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-alt bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex items-center gap-3">
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

        <Link
          href="/"
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-surface-alt px-4 text-xs font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
        >
          ← Public site
        </Link>
      </div>
    </header>
  );
}
