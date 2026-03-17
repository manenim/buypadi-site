"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";

const WHATSAPP_TRY =
  "https://wa.me/234800BUYPADI?text=Hello%20BuyPadi%2C%20I%20saw%20an%20item%20on%20Jiji%20and%20I%20want%20to%20request%20an%20inspection.";
const WHATSAPP_URL = "https://wa.me/234800BUYPADI";

const plans = [
  {
    name: "Basic Inspection",
    price: "₦3,000",
    description: "Perfect for small items and accessories",
    icon: <Zap size={24} />,
    features: [
      "Physical condition check",
      "5 HD photos",
      "Functionality test",
      "WhatsApp report delivery",
    ],
    cta: "Request Inspection",
    ctaLink: WHATSAPP_URL,
    highlighted: false,
    gradient: "from-primary-blue/5 to-transparent",
    border: "border-border",
  },
  {
    name: "Premium Inspection",
    price: "₦5,000",
    priceSuffix: " — ₦7,000",
    description: "For electronics, gadgets & high-value items",
    icon: <Crown size={24} />,
    features: [
      "Full diagnostic report",
      "10+ HD photos & video",
      "IMEI / serial verification",
      "Battery health check",
      "Market price comparison",
      "Priority delivery option",
    ],
    cta: "Get Premium Report",
    ctaLink: WHATSAPP_URL,
    highlighted: true,
    gradient: "from-primary-blue to-accent",
    border: "border-primary-blue/30",
  },
  {
    name: "Inspect + Deliver",
    price: "₦7,000",
    priceSuffix: " — ₦10,000",
    description: "End-to-end: inspection, pickup & doorstep delivery",
    icon: <Check size={24} />,
    features: [
      "Everything in Premium",
      "Secure item pickup",
      "Insured delivery",
      "Real-time tracking",
      "Buyer protection guarantee",
    ],
    cta: "Try Full Service",
    ctaLink: WHATSAPP_TRY,
    highlighted: false,
    gradient: "from-primary-green/5 to-transparent",
    border: "border-border",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-accent-light px-4 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
            Simple Pricing
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-text-header sm:text-4xl lg:text-5xl">
            Transparent.{" "}
            <span className="gradient-text">Affordable.</span>{" "}
            No Hidden Fees.
          </h2>
          <p className="text-lg text-text-body">
            Starting from just ₦3,000. Choose the plan that fits your purchase 
            and let us handle the verification.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className={`relative overflow-hidden rounded-3xl border bg-white p-8 transition-all duration-300 hover:shadow-xl ${plan.border} ${
                plan.highlighted ? "ring-2 ring-primary-blue/20 lg:scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute top-0 right-0">
                  <div className="rounded-bl-2xl bg-gradient-to-r from-primary-blue to-accent px-4 py-1.5">
                    <span className="text-xs font-bold text-white">MOST POPULAR</span>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary-blue to-accent text-white"
                    : "bg-bg-secondary text-primary-blue"
                }`}
              >
                {plan.icon}
              </div>

              <h3 className="mb-1 text-xl font-bold text-text-header">{plan.name}</h3>
              <p className="mb-4 text-sm text-text-muted">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-text-header">{plan.price}</span>
                {plan.priceSuffix && (
                  <span className="text-xl font-bold text-text-muted">{plan.priceSuffix}</span>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-text-body">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-green-light">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="#80B343"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.a
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-primary-blue to-accent text-white shadow-lg shadow-primary-blue/25"
                    : "border-2 border-primary-blue/20 bg-white text-primary-blue hover:border-primary-blue hover:bg-primary-blue-light"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-text-muted"
        >
          Prices may vary by location and item type. Contact us on WhatsApp for a custom quote.
        </motion.p>
      </div>
    </section>
  );
}
