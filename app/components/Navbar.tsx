import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/buypadi-logo.png"
            alt="BuyPadi logo"
            width={120}
            height={36}
            className="object-contain h-9 w-auto"
          />
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="font-display text-sm font-bold text-lime hover:opacity-80 transition-opacity"
          >
            Marketplace
          </Link>
          <Link
            href="#how-it-works"
            className="font-display text-sm font-semibold text-copy hover:text-primary transition-colors"
          >
            Inspections
          </Link>
          <Link
            href="#"
            className="font-display text-sm font-semibold text-copy hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="font-display text-sm font-semibold text-copy hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="font-display hidden md:inline-flex text-sm font-semibold text-copy hover:text-primary transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            href="#"
            className="font-display inline-flex items-center gap-2 bg-lime text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-lime-dark transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
