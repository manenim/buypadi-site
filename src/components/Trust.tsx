"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Eye, Lock, Heart, Award } from "lucide-react";

const trustPoints = [
  {
    icon: <Eye size={24} />,
    title: "Full Transparency",
    description:
      "Every inspection comes with HD photos and video. You see exactly what you're paying for before any money changes hands.",
  },
  {
    icon: <Lock size={24} />,
    title: "Secure Transactions",
    description:
      "We act as the trusted middleman. Your money is safe until you approve the item's condition after inspection.",
  },
  {
    icon: <Users size={24} />,
    title: "Trained Local Scouts",
    description:
      "Our scouts are vetted professionals who know what to look for — from phone IMEI checks to laptop battery health.",
  },
  {
    icon: <Heart size={24} />,
    title: "Buyer Protection",
    description:
      "If the item doesn't match the seller's description, you don't pay. It's that simple.",
  },
];

export default function Trust() {
  return (
    <section id="trust" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - Trust Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-blue via-primary-blue-dark to-accent p-10 text-white lg:p-14">
              {/* Background Pattern */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-10">
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white" />
              </div>

              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <ShieldCheck size={32} className="text-white" />
                </div>

                <h3 className="mb-4 text-3xl font-extrabold leading-tight lg:text-4xl">
                  Your Trust is Our<br />
                  Business Model.
                </h3>

                <p className="mb-8 max-w-md text-base leading-relaxed text-white/80">
                  BuyPadi exists because online marketplaces in Nigeria lack trust.
                  We bridge the gap between buyer and seller — so every transaction
                  is transparent, verified, and safe.
                </p>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { value: "0", label: "Scam incidents" },
                    { value: "500+", label: "Happy buyers" },
                    { value: "24hrs", label: "Avg. turnaround" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <p className="text-2xl font-extrabold">{stat.value}</p>
                      <p className="text-xs text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Award Badge */}
                <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <Award size={16} className="text-primary-green" />
                  <span className="text-xs font-semibold">
                    Trusted by buyers in 15+ Nigerian cities
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Trust Points */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <span className="mb-4 inline-block rounded-full bg-accent-light px-4 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
                Why Trust BuyPadi?
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-header sm:text-4xl">
                Built for Peace of Mind
              </h2>
            </motion.div>

            <div className="space-y-6">
              {trustPoints.map((point, idx) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-border hover:bg-bg-secondary"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-blue-light text-primary-blue transition-all group-hover:bg-primary-blue group-hover:text-white">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="mb-1 text-base font-bold text-text-header">
                      {point.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-text-body">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
