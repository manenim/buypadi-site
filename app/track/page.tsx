import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Track Order — BuyPadi",
  description: "Track the status of your BuyPadi inspection and delivery in real time.",
};

type StepStatus = "completed" | "active" | "pending";

const steps: { title: string; description: string; status: StepStatus; time?: string }[] = [
  {
    title: "Order Received",
    description: "Your inspection request has been confirmed and payment received.",
    status: "completed",
    time: "Mon, 1 Apr · 9:14 AM",
  },
  {
    title: "Inspector Assigned",
    description: "A verified inspector near the seller has been matched to your order.",
    status: "completed",
    time: "Mon, 1 Apr · 11:02 AM",
  },
  {
    title: "Inspection Scheduled",
    description: "Your inspector is coordinating a visit time with the seller.",
    status: "active",
    time: "In progress",
  },
  {
    title: "Report Ready",
    description: "Full photo/video report with Padi Score will be shared with you.",
    status: "pending",
  },
  {
    title: "Delivery Arranged",
    description: "Once approved, logistics will be booked to deliver the item to you.",
    status: "pending",
  },
];

function StepDot({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return (
      <div className="relative z-10 w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="relative z-10 w-9 h-9 rounded-full bg-lime flex items-center justify-center shrink-0 shadow-md">
        <span className="w-3 h-3 rounded-full bg-white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-lime animate-ping opacity-40" />
      </div>
    );
  }
  return (
    <div className="relative z-10 w-9 h-9 rounded-full bg-surface-alt border-2 border-subtle/30 flex items-center justify-center shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-subtle/50" />
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* ── Page header ── */}
      <div className="bg-primary px-6 lg:px-12 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          {/* Order badge */}
          <div className="inline-flex items-center w-fit gap-2.5 bg-white/10 border border-white/20 rounded-full px-4 py-2">
            <svg className="w-3.5 h-3.5 text-lime" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            <span className="font-display text-xs font-bold text-white/80 uppercase tracking-widest">
              Order #BP-882910
            </span>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight">
            Track your verification
          </h1>
          <p className="text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
            Your inspector is currently reviewing the vehicle documentation.
            We&apos;ll update you at every stage via WhatsApp and email.
          </p>

          {/* Current status pill */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-white/50 font-medium">Current Status:</span>
            <span className="inline-flex items-center gap-2 bg-lime-bright text-primary text-sm font-display font-bold px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
              Inspection Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content: asymmetric 2-col ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* ─ LEFT: Journey Timeline ─ */}
          <div className="bg-white rounded-[1.875rem] px-8 lg:px-10 py-8">
            {/* Panel heading */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-heading">Journey Timeline</h2>
            </div>

            {/* Steps */}
            <div className="relative flex flex-col gap-0">
              {/* Vertical connector line */}
              <div className="absolute left-[17px] top-9 bottom-9 w-0.5 bg-surface-alt z-0" />

              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-5 pb-8 last:pb-0">
                  <StepDot status={step.status} />
                  <div className="flex flex-col gap-1 pt-1.5 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3
                        className={`font-display text-base font-bold ${
                          step.status === "pending" ? "text-muted" : "text-heading"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {step.time && (
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            step.status === "active"
                              ? "bg-lime/15 text-primary font-bold"
                              : "bg-surface-alt text-muted"
                          }`}
                        >
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        step.status === "pending" ? "text-subtle" : "text-copy"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─ RIGHT: Detail Cards ─ */}
          <div className="flex flex-col gap-5">

            {/* Asset Preview Card */}
            <div className="bg-white rounded-[1.875rem] px-6 py-6 flex flex-col gap-4">
              <h3 className="font-display text-base font-bold text-heading">Item Being Inspected</h3>
              <div className="bg-surface-alt rounded-2xl h-44 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center px-4">
                  <svg className="w-8 h-8 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18M3 9h18" />
                  </svg>
                  <p className="text-xs text-muted">Item photo will appear here after inspector confirms</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center py-2 border-b border-surface-alt">
                  <span className="text-xs text-muted">Item</span>
                  <span className="text-xs font-semibold text-heading">2018 Toyota Camry XSE</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-surface-alt">
                  <span className="text-xs text-muted">Listed Price</span>
                  <span className="text-xs font-semibold text-heading">₦6,800,000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-muted">Padi Score</span>
                  <span className="text-xs font-bold text-lime">Pending</span>
                </div>
              </div>
            </div>

            {/* Notification Card */}
            <div className="bg-lime-light rounded-[1.875rem] px-6 py-6 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-display text-sm font-bold text-primary">Updates via WhatsApp</p>
                <p className="text-xs text-primary/70 leading-relaxed">
                  You&apos;ll receive real-time updates at every stage directly on WhatsApp. Check your messages.
                </p>
              </div>
            </div>

            {/* Help / Contact Card */}
            <div className="bg-white rounded-[1.875rem] px-6 py-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="font-display text-base font-bold text-heading">Need Help?</h3>
              </div>
              <p className="text-sm text-copy leading-relaxed">
                Our support team is available Mon–Sat, 8 AM–8 PM. Reach us via WhatsApp or email.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="https://wa.me/2348000000000"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-display font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </Link>
                <Link
                  href="mailto:support@buypadi.ng"
                  className="inline-flex items-center justify-center gap-2 border-2 border-surface-alt text-copy font-display font-semibold text-sm px-4 py-2.5 rounded-full hover:border-lime hover:text-primary transition-colors"
                >
                  support@buypadi.ng
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
