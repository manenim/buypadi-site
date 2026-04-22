// import Image from "next/image";
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-[72px]">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <Image
//             src="/assets/buypadi-logo.png"
//             alt="BuyPadi logo"
//             width={120}
//             height={36}
//             className="object-contain h-9 w-auto"
//           />
//         </Link>

//         {/* Nav links — hidden on mobile */}
//         <nav className="hidden md:flex items-center gap-8">
//           <Link
//             href="#"
//             className="font-display text-sm font-bold text-lime hover:opacity-80 transition-opacity"
//           >
//             Home
//           </Link>
//           <Link
//             href="#how-it-works"
//             className="font-display text-sm font-semibold text-copy hover:text-primary transition-colors"
//           >
//             How it Works
//           </Link>
//           <Link
//             href="#benefits"
//             className="font-display text-sm font-semibold text-copy hover:text-primary transition-colors"
//           >
//             Benefits
//           </Link>
//         </nav>

//         {/* CTA buttons */}
//         <div className="flex items-center gap-3">
//           <Link
//             href="/request"
//             className="font-display inline-flex items-center gap-2 bg-lime text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-lime-dark transition-colors"
//           >
//             Request Inspection
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change / resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "#", label: "Home", active: true },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#benefits", label: "Benefits" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
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
          {navLinks.map(({ href, label, active }) => (
            <Link
              key={label}
              href={href}
              className={`font-display text-sm font-bold transition-colors ${
                active
                  ? "text-lime hover:opacity-80"
                  : "font-semibold text-copy hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: CTA + Hamburger */}
        <div className="flex items-center gap-3">
          {/* CTA — always visible */}
          <Link
            href="/request"
            className="font-display hidden md:inline-flex items-center gap-2 bg-lime text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-lime-dark transition-colors"
          >
            Request Inspection
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden relative z-10 flex flex-col justify-center items-center w-9 h-9 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span
              className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-700 rounded-full my-1 transition-all duration-300 ${
                isOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`md:hidden fixed inset-0 top-[72px] bg-white z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <nav className="flex flex-col px-6 pt-6 pb-8 gap-1">
          {navLinks.map(({ href, label, active }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`font-display text-base font-semibold py-3 border-b border-gray-100 transition-colors ${
                active ? "text-lime" : "text-copy hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* CTA repeated in drawer for convenience */}
          <Link
            href="/request"
            onClick={() => setIsOpen(false)}
            className="font-display mt-6 inline-flex justify-center items-center gap-2 bg-lime text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-lime-dark transition-colors"
          >
            Request Inspection
          </Link>
        </nav>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-[72px] bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}