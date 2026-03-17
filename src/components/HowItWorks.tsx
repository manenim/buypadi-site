"use client";

import { motion } from "framer-motion";
import { ScoutIcon, LensIcon, GuardianIcon, SecureHandIcon, SwiftPathIcon } from "./icons";
import { MessageCircle } from "lucide-react";

const steps = [
  {
    icon: <ScoutIcon />,
    step: "01",
    title: "Find an Item Online",
    description:
      "Spot something on Facebook Marketplace, Jiji, or WhatsApp that catches your eye.",
    color: "bg-primary-blue-light",
    accent: "text-primary-blue",
  },
  {
    icon: <MessageCircle size={64} className="text-primary-blue" />,
    step: "02",
    title: "Request a BuyPadi Inspection",
    description:
      "Send us the item link or details via WhatsApp. Our Padi scouts are ready.",
    color: "bg-accent-light",
    accent: "text-accent",
  },
  {
    icon: <LensIcon />,
    step: "03",
    title: "Our Scout Inspects",
    description:
      "A trained BuyPadi scout visits the seller, inspects, photographs, and tests the item.",
    color: "bg-primary-green-light",
    accent: "text-primary-green",
  },
  {
    icon: <GuardianIcon />,
    step: "04",
    title: "Get Your Verification Report",
    description:
      "Receive a detailed photo and video report with condition ratings, so you can decide with confidence.",
    color: "bg-primary-blue-light",
    accent: "text-primary-blue",
  },
  {
    icon: <SecureHandIcon />,
    step: "05",
    title: "Approve & We Pickup",
    description:
      "Happy with the report? We secure the item and arrange safe payment with the seller.",
    color: "bg-primary-green-light",
    accent: "text-primary-green",
  },
  {
    icon: <SwiftPathIcon />,
    step: "06",
    title: "Delivered to Your Door",
    description:
      "We handle logistics and deliver the verified item straight to you. Safe and sound.",
    color: "bg-accent-light",
    accent: "text-accent",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-bg-secondary py-20 lg:py-28">
      {/* Subtle dot pattern */}
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary-blue-light px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-blue uppercase">
            How It Works
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-text-header sm:text-4xl lg:text-5xl">
            From Discovery to{" "}
            <span className="gradient-text">Delivery</span>
          </h2>
          <p className="text-lg text-text-body">
            Six simple steps between finding an item online and having it
            safely delivered to your door — verified and guaranteed.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary-blue/5"
            >
              {/* Step Number */}
              <span className="absolute top-6 right-6 text-5xl font-black text-bg-secondary transition-colors group-hover:text-primary-blue-light">
                {step.step}
              </span>

              {/* Icon */}
              <div
                className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl ${step.color}`}
              >
                {step.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold text-text-header">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-body">
                {step.description}
              </p>

              {/* Bottom accent bar */}
              <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-primary-blue to-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
