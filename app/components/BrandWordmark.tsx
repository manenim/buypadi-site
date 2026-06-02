/**
 * Text wordmark for dark (bg-primary) surfaces where the full-colour BuyPadi logo
 * image doesn't render legibly (forcing it white with `brightness-0 invert` flattens
 * the icon into a blob). A lime brand shield + white "BuyPadi" — always crisp.
 *
 * Renders inline content only; wrap it in your own <Link> where needed.
 */
export default function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 24 28" className="h-7 w-7 shrink-0 text-lime" fill="none" aria-hidden="true">
        <path
          d="M12 1L22 5.5V13C22 19.2 17.7 24.7 12 26C6.3 24.7 2 19.2 2 13V5.5L12 1Z"
          fill="currentColor"
        />
        <path
          d="M7.5 13.5l3 3 6-6.5"
          stroke="#063B27"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-xl font-bold text-white">BuyPadi</span>
    </span>
  );
}
