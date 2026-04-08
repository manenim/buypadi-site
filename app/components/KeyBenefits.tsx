export default function KeyBenefits() {
  return (
    <section className="bg-surface pt-56 pb-20 px-6 lg:px-12 relative z-10">
      <div className="max-w-384 mx-auto">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl lg:text-[64px] font-black text-primary leading-tight tracking-tight">
            Built for Total Peace
            <br />
            of Mind.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Avoid Scams (large, white) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 lg:p-10 flex flex-col gap-6 shadow-sm">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-5 text-white" fill="none" viewBox="0 0 20 24">
                <path
                  d="M10 1L19 5.5V12C19 17.2 15.1 22 10 23C4.9 22 1 17.2 1 12V5.5L10 1Z"
                  fill="currentColor"
                />
                <path
                  d="M6 12l3 3 5-5"
                  stroke="#063B27"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-sans text-4xl lg:text-[48px] font-black text-primary leading-tight">
              Avoid Scams
            </h3>
            <p className="font-display text-lg text-copy leading-relaxed max-w-md">
              Never send money to a stranger again. We confirm the existence and
              condition of the item before you part with a single Naira.
            </p>
          </div>

          {/* Card 2 — 36+ States (dark green) */}
          <div className="bg-primary rounded-3xl p-8 flex flex-col justify-center items-center gap-4 text-center">
            <span className="font-sans text-[54px] font-black text-white leading-none">
              36+
            </span>
            <p className="font-sans text-sm font-black italic text-lime leading-snug">
              States Covered{" "}
              <span className="font-semibold not-italic text-white/80 text-xs">
                starting from FCT
              </span>
            </p>
          </div>

          {/* Card 3 — Buy From Anywhere (lime) */}
          <div className="bg-lime rounded-3xl p-8 flex flex-col justify-end gap-4">
            <h3 className="font-sans text-2xl lg:text-[32px] font-bold text-primary leading-tight">
              Buy From Anywhere
            </h3>
            <p className="font-display text-base font-medium text-primary/80 leading-relaxed">
              Shop in Kano while sitting in Lagos. Our logistics bridge the gap
              safely.
            </p>
          </div>

          {/* Card 4 — Independent Inspection (light lime, text only) */}
          <div className="md:col-span-2 bg-lime-light rounded-3xl p-8 lg:p-10 flex flex-col justify-center gap-4 overflow-hidden relative">
            <h3 className="font-sans text-3xl lg:text-[40px] font-black text-heading leading-tight">
              Independent
              <br />
              Inspection
            </h3>
            <p className="font-display text-lg text-copy leading-relaxed max-w-md">
              We don&apos;t work for the seller. We work for you. Unbiased,
              clinical, and thorough reports every time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
