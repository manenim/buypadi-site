/**
 * Text wordmark for dark (bg-primary) surfaces where the full-colour BuyPadi logo
 * image doesn't render legibly (forcing it white with `brightness-0 invert` flattens
 * the icon into a blob). A white "BuyPadi" wordmark keeps admin surfaces crisp.
 *
 * Renders inline content only; wrap it in your own <Link> where needed.
 */
export default function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="font-display text-xl font-bold text-white">BuyPadi</span>
    </span>
  );
}
