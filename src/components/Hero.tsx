"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/08026100848?text=Hi%20BuyPadi!%20I%20want%20to%20try%20your%20verification%20service.%20Can%20you%20help%20me%20get%20started?";

export default function Hero() {
  return (
    <section className="hero-mesh relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Dot pattern overlay */}
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-blue/20 bg-primary-blue-light px-4 py-2"
            >
              <ShieldCheck size={16} className="text-primary-blue" />
              <span className="text-xs font-semibold tracking-wide text-primary-blue uppercase">
                Nigeria&apos;s #1 Trust Service
              </span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-text-header sm:text-5xl lg:text-6xl">
              Buy Used Items{" "}
              <span className="gradient-text">Safely Online.</span>
              <br />
              <span className="text-text-body text-3xl font-semibold sm:text-4xl lg:text-5xl">
                Don&apos;t Travel. Don&apos;t Get Scammed.
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-text-body">
              BuyPadi verifies items you find on Facebook Marketplace, Jiji, and WhatsApp 
              before you pay. We inspect, confirm, and deliver — so you never get scammed on 
              another online purchase.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-green px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-green/30 transition-all hover:bg-primary-green-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Try BuyPadi (WhatsApp)
              </motion.a>

              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-blue/20 bg-white px-8 py-4 text-base font-semibold text-primary-blue transition-all hover:border-primary-blue hover:bg-primary-blue-light"
              >
                See How It Works
                <ArrowRight size={18} />
              </motion.a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[
                  "bg-primary-blue",
                  "bg-primary-green",
                  "bg-accent",
                  "bg-primary-blue-dark",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${bg} text-xs font-bold text-white`}
                  >
                    {["AO", "IF", "TK", "DA"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-header">500+ verified transactions</p>
                <p className="text-xs text-text-muted">Trusted by buyers across Nigeria</p>
              </div>
            </div>
          </motion.div>

          {/* Right — Verification Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Floating Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary-blue/20 via-accent/10 to-primary-green/20 blur-2xl" />

              {/* Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-2xl">
                {/* Card Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-blue">
                      <ShieldCheck size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-header">BuyPadi Verification</p>
                      <p className="text-[10px] text-text-muted">Report #BP-2024-0847</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-primary-green-light px-3 py-1">
                    <span className="text-xs font-bold text-primary-green">✓ VERIFIED</span>
                  </div>
                </div>

                {/* Simulated Item Image */}
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-bg-secondary to-primary-blue-light">
                  <div className="flex h-48 items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                          <rect x="5" y="1" width="14" height="22" rx="3" stroke="#3F73BB" strokeWidth="1.5" />
                          <line x1="5" y1="5" x2="19" y2="5" stroke="#3F73BB" strokeWidth="1" opacity="0.3" />
                          <line x1="5" y1="19" x2="19" y2="19" stroke="#3F73BB" strokeWidth="1" opacity="0.3" />
                          <circle cx="12" cy="21" r="1" fill="#3F73BB" opacity="0.5" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-text-header">iPhone 15 Pro Max</p>
                      <p className="text-xs text-text-muted">256GB — Natural Titanium</p>
                    </div>
                  </div>
                  {/* Scan Line Animation */}
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-green to-transparent"
                    style={{ position: "absolute" }}
                  />
                </div>

                {/* Verification Checklist */}
                <div className="space-y-2">
                  {[
                    { label: "Physical Condition", status: "Excellent" },
                    { label: "Screen & Display", status: "No scratches" },
                    { label: "Battery Health", status: "94%" },
                    { label: "IMEI Check", status: "Clean" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="flex items-center justify-between rounded-xl bg-bg-secondary px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-green">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-text-body">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary-green">{item.status}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-4 rounded-xl bg-gradient-to-r from-primary-blue to-accent p-3 text-center">
                  <p className="text-xs font-bold text-white">🛡️ This item passed BuyPadi inspection</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
