import Image from "next/image";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-surface px-6 lg:px-12 pb-20 relative overflow-hidden">
      {/* Delivery man — behind the CTA card, left-aligned with content sections */}
      <div className="absolute inset-y-0 right-6 lg:right-12 w-[45%] max-w-xl flex items-end pointer-events-none select-none z-0">
        <Image
          src="/assets/delivery-man.png"
          alt=""
          aria-hidden="true"
          width={900}
          height={675}
          className="w-full h-auto object-contain object-bottom"
        />
      </div>

      <div className="max-w-350 mx-auto bg-primary rounded-3xl px-8 lg:px-16 py-16 lg:py-20 relative z-10 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-lime/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-lime/10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8 max-w-3xl">
          <h2 className="font-display text-3xl lg:text-[52px] font-black text-white leading-tight">
            Ready for a safer way to buy?
          </h2>
          <p className="text-lg lg:text-xl text-on-dark font-medium leading-relaxed">
            Join thousands of Nigerians using BuyPadi to secure their
            high-value purchases today.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#"
              className="font-sans inline-flex items-center gap-2 bg-lime text-primary font-semibold text-lg px-8 py-4 rounded-full hover:bg-lime-dark transition-colors shadow-lg"
            >
              Start Your First Inspection
            </Link>
            <Link
              href="#"
              className="font-sans inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold text-lg px-8 py-4 rounded-full hover:border-white/60 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
