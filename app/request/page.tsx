import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Request Inspection — BuyPadi",
  description:
    "Submit a request for a professional physical inspection before you buy.",
};

function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-surface-alt mb-6">
      <div className="w-10 h-10 rounded-xl bg-lime flex items-center justify-center shrink-0 text-white font-display font-black text-sm">
        {String(step).padStart(2, "0")}
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-heading">{title}</h2>
        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-copy mb-1.5">
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-surface-alt border border-transparent rounded-xl px-4 py-3 text-sm text-heading placeholder:text-subtle focus:outline-none focus:border-lime focus:bg-white transition-colors";

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* ── Page header ── */}
      <div className="bg-primary px-6 lg:px-12 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <span className="inline-flex items-center w-fit bg-lime-bright text-primary text-[0.6875rem] font-display font-bold uppercase tracking-widest rounded-full px-4 py-1.5">
            Certified Logistics
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight">
            Request Inspection
          </h1>
          <p className="text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
            Complete the details below to secure a professional physical
            inspection before you make any payment.
          </p>
        </div>
      </div>

      {/* ── Form body ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <form className="flex flex-col gap-6">

            {/* ─ Section 1: Item Information ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 lg:px-10 py-8">
              <SectionHeader
                step={1}
                title="Item Information"
                subtitle="Tell us about the item you want inspected."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Label>Product Link</Label>
                  <input
                    type="url"
                    placeholder="https://jiji.ng/listing/..."
                    className={inputClass}
                  />
                  <p className="text-xs text-muted mt-1.5">
                    Paste the listing URL from Jiji, Facebook, Instagram, etc.
                  </p>
                </div>
                <div>
                  <Label>Item Price (₦)</Label>
                  <input
                    type="number"
                    placeholder="e.g. 250000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>Item Category</Label>
                  <select className={inputClass + " cursor-pointer"}>
                    <option value="">Select a category</option>
                    <option>Vehicles</option>
                    <option>Electronics</option>
                    <option>Fashion & Accessories</option>
                    <option>Real Estate</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Upload Screenshot (optional)</Label>
                  <div className="w-full bg-surface-alt border-2 border-dashed border-subtle/40 rounded-xl px-6 py-8 flex flex-col items-center gap-3 cursor-pointer hover:border-lime transition-colors text-center">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                      <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading">
                        Drag & drop or{" "}
                        <span className="text-lime underline underline-offset-2">
                          browse
                        </span>
                      </p>
                      <p className="text-xs text-muted mt-0.5">PNG, JPG up to 10 MB</p>
                    </div>
                    <input type="file" accept="image/*" className="sr-only" />
                  </div>
                </div>
              </div>
            </div>

            {/* ─ Section 2: Buyer Information ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 lg:px-10 py-8">
              <SectionHeader
                step={2}
                title="Buyer Information"
                subtitle="Your contact details so we can reach you with updates."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label>Full Name</Label>
                  <input
                    type="text"
                    placeholder="Emeka Johnson"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <div className="flex gap-2">
                    <span className="bg-surface-alt border border-transparent rounded-xl px-3 py-3 text-sm text-muted font-medium shrink-0 flex items-center">
                      🇳🇬 +234
                    </span>
                    <input
                      type="tel"
                      placeholder="8012345678"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label>Email Address</Label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ─ Section 3: Seller Information ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 lg:px-10 py-8">
              <SectionHeader
                step={3}
                title="Seller Information"
                subtitle="Details about the seller so our inspector can arrange a visit."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label>Seller Name / Store</Label>
                  <input
                    type="text"
                    placeholder="e.g. Tunde Motors"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>Seller Phone</Label>
                  <input
                    type="tel"
                    placeholder="0801 234 5678"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Pickup / Seller Address</Label>
                  <textarea
                    rows={3}
                    placeholder="Full address where the item is located..."
                    className={inputClass + " resize-none"}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Additional Notes (optional)</Label>
                  <textarea
                    rows={3}
                    placeholder="Any specific concerns or things to check..."
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>
            </div>

            {/* ─ Footer CTA ─ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-[1.875rem] px-8 lg:px-10 py-6">
              <p className="text-sm text-muted text-center sm:text-left">
                By submitting, you agree to our{" "}
                <Link href="#" className="text-primary underline underline-offset-2 hover:text-lime transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary underline underline-offset-2 hover:text-lime transition-colors">
                  Privacy Policy
                </Link>.
              </p>
              <button
                type="submit"
                className="font-display inline-flex items-center gap-2.5 bg-primary text-white font-bold text-base px-8 py-4 rounded-full hover:bg-primary/90 transition-colors shadow-lg shrink-0"
              >
                Request Inspection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
