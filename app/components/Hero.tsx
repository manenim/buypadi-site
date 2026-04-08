import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-surface px-4 sm:px-6 lg:px-12 pt-6 pb-0 overflow-x-hidden">
      {/* ── Dark-green hero CARD — matches max-w-7xl of other sections ── */}
      <div
        className="relative bg-primary rounded-[1.875rem] overflow-visible
                   w-full max-w-384 mx-auto px-6 sm:px-10 lg:px-14 flex flex-col items-center justify-center pb-0
                   min-h-[26rem] lg:min-h-[34rem] my-auto py-20 lg:py-0"
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-36 items-center">
          {/* ── LEFT: text ── */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-5 pb-8 lg:pb-16 z-10 relative w-full">
            {/* Badge */}
            <span
              className="font-display inline-flex items-center w-fit bg-lime-bright text-primary
                         text-[0.6875rem] font-bold uppercase tracking-widest
                         rounded-full px-4 py-1.5"
            >
              Verified Logistics
            </span>

            {/* Headline */}
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-white"
            >
              Buy From <span className="text-lime italic">Anywhere.</span>
              <br />
              We Deliver <span className="text-lime">Safely</span> to You!
            </h1>

            {/* Subtext */}
            <p
              className="text-sm sm:text-base lg:text-[1.0625rem] font-medium text-white/60 max-w-sm leading-relaxed"
            >
              We inspect before you pay. Your eyes on the ground for every
              purchase, everywhere in Nigeria.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
              <Link
                href="#"
                className="font-display inline-flex items-center bg-white text-primary
                           text-base font-bold px-6 py-3.5 rounded-full
                           shadow-lg hover:bg-gray-50 transition-colors"
              >
                Request Inspection
              </Link>
              <Link
                href="#how-it-works"
                className="font-display inline-flex items-center bg-lime text-white
                           text-base font-bold px-6 py-3.5 rounded-full
                           hover:bg-lime-dark transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* ── RIGHT: image + overlays ── */}
          <div className="relative flex justify-center lg:justify-end self-end flex-shrink-0 w-full lg:w-auto">
            {/* White rounded image card */}
            <div
              className="relative rounded-[3rem] overflow-hidden bg-white
                         w-full max-w-[16rem] sm:max-w-[20rem] lg:w-[22rem]
                         h-[16rem] sm:h-[21rem] lg:h-[26rem]"
            >
              <Image
                src="/assets/hero-bg.png"
                alt="BuyPadi verified delivery professional"
                fill
                sizes="(max-width: 640px) 16rem, (max-width: 1024px) 20rem, 22rem"
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Glass bubbles — hidden on small screens to avoid overflow */}
            <div
              className="hidden sm:block absolute -right-6 top-4
                         w-[5.625rem] h-[5.625rem] rounded-full
                         overflow-hidden shadow-xl border-2 border-white/30"
            >
              <Image
                src="/assets/glass-jiji.png"
                alt="Jiji.ng"
                width={90}
                height={90}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="hidden sm:block absolute -right-5 top-[45%] -translate-y-1/2
                         w-[4.5rem] h-[4.5rem] rounded-full
                         overflow-hidden shadow-xl border-2 border-white/30"
            >
              <Image
                src="/assets/glass-instagram.png"
                alt="Instagram"
                width={72}
                height={72}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="hidden sm:block absolute -right-4 bottom-16
                         w-[5rem] h-[5rem] rounded-full
                         overflow-hidden shadow-xl border-2 border-white/30"
            >
              <Image
                src="/assets/glass-sphere-store.png"
                alt="Online store"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* "100% Inspected" badge */}
            <div
              className="absolute bottom-4 left-0 lg:-left-4
                         flex items-center gap-3 bg-white/95 backdrop-blur-sm
                         rounded-full px-4 py-2.5 shadow-xl border border-white/60
                         w-max"
            >
              <div className="w-10 h-10 rounded-2xl bg-lime flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 20 24">
                  <path
                    d="M10 1L19 5.5V12C19 17.2 15.1 22 10 23C4.9 22 1 17.2 1 12V5.5L10 1Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.5 12l2.5 2.5 5-5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-display text-[0.8125rem] font-bold text-heading leading-tight">
                  100% Inspected
                </p>
                <p className="text-[0.6875rem] text-muted">
                  Lagos, 12 mins ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
