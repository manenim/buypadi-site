import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Track Order — BuyPadi",
  description: "Track the status of your BuyPadi inspection in real time.",
};

function CompletedDot() {
  return (
    <div className="relative z-10 w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
  );
}

function ActiveDot() {
  return (
    <div className="relative z-10 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    </div>
  );
}

function TruckDot() {
  return (
    <div className="relative z-10 w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    </div>
  );
}

function PinDot() {
  return (
    <div className="relative z-10 w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        <div className="max-w-6xl mx-auto">

          {/* ── Page header ── */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-10">
            <div className="flex flex-col gap-3">
              {/* Order badge */}
              <div className="inline-flex items-center w-fit gap-2 bg-white border border-surface-alt rounded-full px-3.5 py-1.5 shadow-sm">
                <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
                <span className="text-xs font-semibold text-muted">Order #BP-882910</span>
              </div>

              <h1 className="font-display text-3xl lg:text-[40px] font-black text-heading leading-tight">
                Track your verification
              </h1>
              <p className="text-copy text-base leading-relaxed max-w-md">
                Your inspector is currently reviewing the vehicle documentation.
                We&apos;ll update you as soon as they arrive on-site.
              </p>
            </div>

            {/* Current status */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="text-xs font-semibold text-muted uppercase tracking-widest">Current Status</span>
              <span className="inline-flex items-center gap-2 bg-lime text-white text-sm font-display font-bold px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                Inspection Scheduled
              </span>
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

            {/* ─ LEFT: Journey Timeline ─ */}
            <div className="bg-white rounded-[1.875rem] px-8 lg:px-10 py-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                  </svg>
                  <h2 className="font-display text-lg font-bold text-heading">Journey Timeline</h2>
                </div>
                <svg className="w-8 h-8 text-subtle/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>

              {/* Steps */}
              <div className="relative flex flex-col">
                {/* Vertical connector line */}
                <div className="absolute left-[17px] top-5 bottom-5 w-0.5 bg-surface-alt z-0" />

                {/* Step 1: Request Received */}
                <div className="flex gap-5 pb-8">
                  <CompletedDot />
                  <div className="pt-1.5">
                    <h3 className="font-display text-base font-bold text-heading">Request Received</h3>
                    <p className="text-sm text-muted mt-0.5">October 24, 2024 • 09:12 AM</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 bg-lime/10 text-lime-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Verified by System
                    </span>
                  </div>
                </div>

                {/* Step 2: Payment Confirmed */}
                <div className="flex gap-5 pb-8">
                  <CompletedDot />
                  <div className="pt-1.5">
                    <h3 className="font-display text-base font-bold text-heading">Payment Confirmed</h3>
                    <p className="text-sm text-muted mt-0.5">October 24, 2024 • 10:45 AM</p>
                  </div>
                </div>

                {/* Step 3: Inspection Scheduled (active) */}
                <div className="flex gap-5 pb-8">
                  <ActiveDot />
                  <div className="pt-1.5 flex-1">
                    <h3 className="font-display text-base font-bold text-blue-600">Inspection Scheduled</h3>
                    <p className="text-sm text-muted mt-0.5">Scheduled for Today • 2:00 PM – 4:00 PM</p>
                    {/* Inspector card */}
                    <div className="mt-3 bg-surface-alt rounded-2xl px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Assigned Inspector</p>
                        <p className="text-sm font-semibold text-heading">Olawale Johnson</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Inspector En Route */}
                <div className="flex gap-5 pb-8">
                  <TruckDot />
                  <div className="pt-1.5">
                    <h3 className="font-display text-base font-bold text-muted">Inspector En Route</h3>
                    <p className="text-sm text-subtle mt-0.5">Pending location update</p>
                  </div>
                </div>

                {/* Step 5: Delivered */}
                <div className="flex gap-5">
                  <PinDot />
                  <div className="pt-1.5">
                    <h3 className="font-display text-base font-bold text-muted">Delivered</h3>
                    <p className="text-sm text-subtle mt-0.5">Final report will be uploaded here.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─ RIGHT: Stacked cards ─ */}
            <div className="flex flex-col gap-4">

              {/* Vehicle card */}
              <div className="bg-white rounded-[1.875rem] overflow-hidden">
                <div className="relative h-44 bg-surface-alt flex items-center justify-center">
                  <svg className="w-16 h-16 text-subtle/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-lime text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    Pre-Inspection
                  </span>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-heading">2021 Toyota Camry LE</h3>
                    <p className="text-sm text-muted mt-0.5">Silver Metallic • 42,500 km</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-alt rounded-xl px-3 py-2.5">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Location</p>
                      <p className="text-sm font-semibold text-heading">Ikeja, Lagos</p>
                    </div>
                    <div className="bg-surface-alt rounded-xl px-3 py-2.5">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Dealer</p>
                      <p className="text-sm font-semibold text-heading">Star Motors</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS Updates card */}
              <div className="bg-white rounded-[1.875rem] px-6 py-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-heading">SMS Updates Active</p>
                  <p className="text-xs text-copy leading-relaxed mt-1">
                    You&apos;ll receive a text message as soon as the inspector starts the 150-point check.
                  </p>
                </div>
              </div>

              {/* Need assistance card */}
              <button className="bg-white rounded-[1.875rem] px-6 py-5 flex items-center gap-4 hover:bg-surface-alt/50 transition-colors w-full text-left">
                <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm font-bold text-heading">Need assistance?</p>
                  <p className="text-xs text-muted mt-0.5">Speak with a logistics officer</p>
                </div>
                <svg className="w-5 h-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
