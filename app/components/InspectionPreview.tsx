import Image from "next/image";

const checkItems = [
  "Frame & Engine Diagnostics",
  "Live Odometer Verification",
  "Market Value Assessment",
];

export default function InspectionPreview() {
  return (
    /**
     * This wrapper is `relative` so the scooter rider can be positioned
     * absolutely spanning the bottom of this section into the next.
     * The rider sits at z-0, content at z-10.
     */
    <div className="relative">
      <section className="bg-white py-20 px-6 lg:px-12 relative z-10">
        <div className="max-w-384 mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text + checklist */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl lg:text-[36px] font-extrabold text-primary leading-tight">
              See everything
              <br />
              without being there.
            </h2>
            <p className="text-base lg:text-[17px] text-copy leading-relaxed">
              Our digital reports aren&apos;t just PDF files. They are live,
              interactive documents showing the true health of your prospective
              purchase.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {checkItems.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lime flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-heading">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Actual Figma inspection report card exported as image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/assets/inspection-report-card.png"
              alt="BuyPadi inspection report showing 2018 Toyota Camry XSE — Passed, 8.8/10 Padi Score"
              width={683}
              height={448}
              className="w-full max-w-lg rounded-2xl shadow-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Scooter rider — absolute, decorative, low z-index, spans the bottom of this
          section and the top of the Key Benefits section below */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20
                   w-[340px] lg:w-[480px] pointer-events-none select-none"
      >
        <Image
          src="/assets/scooter-rider-2.png"
          alt=""
          aria-hidden="true"
          width={580}
          height={753}
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
