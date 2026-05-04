import Image from 'next/image';
import Link from 'next/link';

export default function QuestionnaireHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Go to BuyPadi homepage">
          <Image
            src="/assets/buypadi-logo.png"
            alt="BuyPadi"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-surface-alt px-4 text-xs font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary sm:text-sm"
        >
          Back to home
        </Link>
      </div>
    </header>
  );
}
