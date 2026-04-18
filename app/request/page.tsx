import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

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
      <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center shrink-0 text-white font-display font-black text-sm">
        {step}
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

      {/* ── Form body ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
          {/* Page title — plain, no banner */}
          <div className="mb-8 lg:mb-10">
            <h1 className="font-display text-3xl lg:text-[40px] font-black text-heading leading-tight">
              Request Inspection
            </h1>
            <p className="text-copy text-base mt-2 leading-relaxed max-w-lg lg:max-w-2xl">
              Complete this form to book a professional physical inspection of
              your intended purchase. We show you what you see to what you get.
            </p>
          </div>

          <form className="flex flex-col gap-5">

            {/* ─ Section 1: Item Information ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 py-8">
              <SectionHeader
                step={1}
                title="Item Information"
                subtitle="Tell us about the item (product link or item details)."
              />
              <div className="flex flex-col gap-5">
                <div>
                  <Label>Product Link</Label>
                  <input
                    type="url"
                    placeholder="Paste link (e.g. Jiji, FB, IG or text)"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>Item Price (₦)</Label>
                  <input
                    type="number"
                    placeholder="Enter amount (₦)"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>Optional Comments</Label>
                  <textarea
                    rows={3}
                    placeholder="Any specific things you want us to check..."
                    className={inputClass + " resize-none"}
                  />
                </div>
                <div>
                  <Label>Upload Screenshot (optional)</Label>
                  <div className="w-full bg-surface-alt border-2 border-dashed border-subtle/40 rounded-xl px-6 py-10 flex flex-col items-center gap-3 cursor-pointer hover:border-lime transition-colors text-center">
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading">
                        Drag and drop or{" "}
                        <span className="text-lime underline underline-offset-2">click to upload</span>
                      </p>
                      <p className="text-xs text-muted mt-0.5">PNG, JPG, PDF. Max 15mb</p>
                    </div>
                    <input type="file" accept="image/*,.pdf" className="sr-only" />
                  </div>
                </div>
              </div>
            </div>

            {/* ─ Section 2: Buyer Information ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 py-8">
              <SectionHeader
                step={2}
                title="Buyer Information"
                subtitle="Your contact details for inspection reports."
              />
              <div className="flex flex-col gap-5">
                <div>
                  <Label>Full Name</Label>
                  <input
                    type="text"
                    placeholder="Emeka Johnson"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label>WhatsApp Number</Label>
                    <div className="flex gap-2">
                      <span className="bg-surface-alt border border-transparent rounded-xl px-3 py-3 text-sm text-copy font-medium shrink-0 flex items-center gap-1.5">
                        🇳🇬 <span className="text-muted">+234</span>
                      </span>
                      <input
                        type="tel"
                        placeholder="8012345678"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─ Section 3: Seller Information ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 py-8">
              <SectionHeader
                step={3}
                title="Seller Information"
                subtitle="Who to send our inspector to."
              />
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label>Seller Name / Store Name</Label>
                    <input
                      type="text"
                      placeholder="e.g. Tunde Motors, Lagos"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label>Seller Phone</Label>
                    <input
                      type="tel"
                      placeholder="Enter seller phone number"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <Label>Physical Address</Label>
                  <textarea
                    rows={3}
                    placeholder="Detailed address for physical inspection..."
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>
            </div>

            {/* ─ Submit ─ */}
            <div className="flex flex-col items-center gap-4 py-4">
              <button
                type="submit"
                className="font-display inline-flex items-center gap-2.5 bg-primary text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
              >
                Request Inspection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg className="w-4 h-4 text-lime shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm3.707 7.293a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure payment &amp; Verified inspectors
              </div>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
