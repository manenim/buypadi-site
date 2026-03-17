"use client";

import { motion } from "framer-motion";
import { Camera, Truck, ShieldCheck, ClipboardCheck, MapPin, Smartphone } from "lucide-react";

const services = [
  {
    icon: <Camera size={28} />,
    title: "Item Inspection",
    description:
      "Our trained scouts physically inspect the item — checking functionality, condition, and authenticity with photos and video proof.",
    features: ["HD photo documentation", "Video functionality test", "Authenticity verification"],
    gradient: "from-primary-blue to-primary-blue-dark",
    light: "bg-primary-blue-light",
    accent: "text-primary-blue",
  },
  {
    icon: <ClipboardCheck size={28} />,
    title: "Verification Report",
    description:
      "Receive a detailed condition report with ratings on every aspect — screen, body, performance, and more.",
    features: ["Detailed condition ratings", "Market price comparison", "Risk assessment"],
    gradient: "from-accent to-accent-dark",
    light: "bg-accent-light",
    accent: "text-accent",
  },
  {
    icon: <Truck size={28} />,
    title: "Secure Delivery",
    description:
      "Once you approve, we handle the pickup and deliver the verified item safely to your doorstep.",
    features: ["Insured transit", "Real-time tracking", "Doorstep delivery"],
    gradient: "from-primary-green to-primary-green-dark",
    light: "bg-primary-green-light",
    accent: "text-primary-green",
  },
];

const stats = [
  { icon: <ShieldCheck size={20} />, value: "500+", label: "Verified Deals" },
  { icon: <MapPin size={20} />, value: "15+", label: "Cities Covered" },
  { icon: <Smartphone size={20} />, value: "98%", label: "Satisfied Buyers" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Services() {
  return (
    <section id="services" className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary-green-light px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-green uppercase">
            Our Services
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-text-header sm:text-4xl lg:text-5xl">
            Everything You Need to{" "}
            <span className="gradient-text">Buy with Confidence</span>
          </h2>
          <p className="text-lg text-text-body">
            From inspection to doorstep delivery, BuyPadi handles the entire
            verification process so you can shop online without fear.
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 grid gap-8 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-blue/8"
            >
              {/* Icon */}
              <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
              >
                {service.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold text-text-header">
                {service.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-text-body">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-body">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${service.light}`}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={service.accent}
                        />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Hover gradient bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-primary-blue via-accent to-primary-green transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-bg-secondary p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-blue-light text-primary-blue">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-text-header">{stat.value}</p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
