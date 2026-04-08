import Link from "next/link";

const companyLinks = ["About Us", "Pricing", "Contact Us"];
const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <span className="font-display text-2xl font-bold text-primary">
              BuyPadi.ng
            </span>
            <p className="text-sm text-muted leading-relaxed">
              © 2024 BuyPadi.ng. Secure Asset Custodianship. Nigeria&apos;s #1
              verification and inspection partner.
            </p>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h5 className="font-display text-sm font-bold text-heading uppercase tracking-wide">
              Company
            </h5>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h5 className="font-display text-sm font-bold text-heading uppercase tracking-wide">
              Legal
            </h5>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h5 className="font-display text-sm font-bold text-heading uppercase tracking-wide">
              Connect
            </h5>
            <div className="flex items-center gap-3">
              {/* Twitter/X */}
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-subtle hover:bg-lime hover:text-white transition-colors"
                aria-label="Follow on X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-subtle hover:bg-lime hover:text-white transition-colors"
                aria-label="Follow on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
            </div>
            <p className="text-xs text-subtle mt-2">
              Headquarters: Victoria Island, Lagos.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
