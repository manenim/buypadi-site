const badges = [
  {
    icon: (
      <svg viewBox="0 0 33 32" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 2a2 2 0 011.8 1.1l1.2 2.6 2.8-.3a2 2 0 012 2.7l-1.3 2.5 1.8 2.2a2 2 0 010 2.8l-1.8 2.2 1.3 2.5a2 2 0 01-2 2.7l-2.8-.3-1.2 2.6A2 2 0 0116.5 26a2 2 0 01-1.8-1.1l-1.2-2.6-2.8.3a2 2 0 01-2-2.7l1.3-2.5-1.8-2.2a2 2 0 010-2.8l1.8-2.2-1.3-2.5a2 2 0 012-2.7l2.8.3 1.2-2.6A2 2 0 0116.5 2zm0 8a6 6 0 100 12 6 6 0 000-12z" fill="currentColor"/>
        <circle cx="16.5" cy="16" r="3" fill="white"/>
      </svg>
    ),
    title: "Verified Inspectors",
    description: "Background-checked professionals across all 36 states.",
  },
  {
    icon: (
      <svg viewBox="0 0 33 32" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="8" width="29" height="20" rx="4" fill="currentColor" opacity="0.2"/>
        <rect x="2" y="8" width="29" height="20" rx="4" stroke="currentColor" strokeWidth="2.5"/>
        <circle cx="16.5" cy="18" r="5" fill="currentColor"/>
        <circle cx="16.5" cy="18" r="2" fill="white"/>
        <rect x="12" y="4" width="9" height="6" rx="2" fill="currentColor"/>
      </svg>
    ),
    title: "Real Photo & Video Proof",
    description: "Live high-definition media captured directly on-site.",
  },
  {
    icon: (
      <svg viewBox="0 0 33 32" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="10" width="20" height="14" rx="2" fill="currentColor" opacity="0.2"/>
        <rect x="2" y="10" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M22 14h5l4 6v4h-9V14z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="8" cy="25" r="3" fill="white" stroke="currentColor" strokeWidth="2.5"/>
        <circle cx="25" cy="25" r="3" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      </svg>
    ),
    title: "Secure Delivery",
    description: "End-to-end custody from seller to your doorstep.",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-surface px-4 sm:px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto border-2 border-lime rounded-[1.875rem] px-6 sm:px-8 lg:px-14 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-lime/20">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center gap-3 pt-8 md:pt-0 first:pt-0 md:px-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-lime flex items-center justify-center text-primary shadow-sm">
                {badge.icon}
              </div>
              <h3 className="font-display text-[17px] font-bold text-heading">
                {badge.title}
              </h3>
              <p className="text-sm text-copy leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
