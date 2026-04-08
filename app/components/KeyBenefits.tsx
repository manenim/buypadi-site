import Image from "next/image";

export default function KeyBenefits() {
  return (
    <section className="bg-surface pt-56 pb-20 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="font-display text-4xl lg:text-[64px] font-black text-primary leading-tight">
            Built for Total Peace
            <br />
            of Mind.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Avoid Scams (large, white) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 lg:p-10 flex flex-col gap-6 shadow-sm">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-5 h-6 text-white" fill="none" viewBox="0 0 20 24">
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
            <h3 className="font-sans text-4xl lg:text-[48px] font-black text-heading leading-tight">
              Avoid Scams
            </h3>
            <p className="font-display text-lg text-copy leading-relaxed max-w-md">
              Never send money to a stranger again. We confirm the existence and
              condition of the item before you part with a single Naira.
            </p>
          </div>

          {/* Card 2 — 36+ States (dark green) */}
          <div className="bg-primary rounded-3xl p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-[54px] font-black text-white leading-none">
                36+
              </span>
              <p className="font-sans text-sm font-semibold text-white/70">
                States Covered starting from FCT
              </p>
            </div>
            {/* Nigeria map placeholder dots */}
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-lime/40"
                  style={{ opacity: Math.random() * 0.5 + 0.5 }}
                />
              ))}
            </div>
          </div>

          {/* Card 3 — Buy From Anywhere (lime) */}
          <div className="bg-lime rounded-3xl p-8 flex flex-col gap-4">
            <h3 className="font-sans text-2xl lg:text-[32px] font-bold text-primary leading-tight">
              Buy From Anywhere
            </h3>
            <p className="font-display text-base font-medium text-primary/80 leading-relaxed">
              Shop in Kano while sitting in Lagos. Our logistics bridge the gap
              safely.
            </p>
          </div>

          {/* Card 4 — Independent Inspection (light lime, has delivery man image) */}
          <div className="md:col-span-2 bg-lime-light rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row gap-8 items-center overflow-hidden relative">
            <div className="flex flex-col gap-4 z-10 flex-1">
              <h3 className="font-sans text-3xl lg:text-[40px] font-black text-heading leading-tight">
                Independent
                <br />
                Inspection
              </h3>
              <p className="font-display text-base text-copy leading-relaxed max-w-xs">
                We don't work for the seller. We work for you. Unbiased,
                clinical, and thorough reports every time.
              </p>
            </div>
            <div className="relative w-full lg:w-64 h-48 lg:h-auto flex-shrink-0 rounded-2xl overflow-hidden">
              <Image
                src="/assets/delivery-man.png"
                alt="BuyPadi delivery professional"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
