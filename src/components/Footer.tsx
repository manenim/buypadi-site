"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/+2348026100848?text=Hi%20BuyPadi!%20I%20want%20to%20try%20your%20verification%20service.%20Can%20you%20help%20me%20get%20started?";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Our Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
  ],
  support: [
    { label: "FAQs", href: "#" },
    { label: "Contact Us", href: WHATSAPP_URL },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
  platforms: [
    { label: "Facebook Marketplace", href: "#" },
    { label: "Jiji.ng", href: "#" },
    { label: "WhatsApp Trades", href: "#" },
    { label: "Instagram Shops", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-text-header pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary-blue via-accent to-primary-green p-10 text-center text-white lg:p-14"
        >
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-white" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-white" />
          </div>
          <div className="relative">
            <h3 className="mb-4 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              Ready to Buy Without the Risk?
            </h3>
            <p className="mx-auto mb-8 max-w-xl text-base text-white/80">
              Send us the item you found online and let our scouts verify it for
              you. It&apos;s fast, affordable, and 100% transparent.
            </p>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-primary-blue shadow-xl transition-all hover:bg-primary-blue-light"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with Us on WhatsApp
            </motion.a>
          </div>
        </motion.div>

        {/* Footer Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-blue">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Buy<span className="text-primary-green">Padi</span>
                <span className="text-sm text-white/50">.ng</span>
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-white/60">
              Nigeria&apos;s trusted inspection and verification service for
              online marketplace transactions.
            </p>
            <div className="space-y-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary-green"
              >
                <Phone size={14} />
                +234 800 BUYPADI
              </a>
              <a
                href="mailto:hello@buypadi.ng"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary-green"
              >
                <Mail size={14} />
                hello@buypadi.ng
              </a>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin size={14} />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-bold text-white uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-primary-green"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} BuyPadi.ng — All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Made with 💚 for Nigerian online shoppers
          </p>
        </div>
      </div>
    </footer>
  );
}
