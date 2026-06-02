/**
 * Skeleton placeholder block with a premium shimmer sweep (see `.bp-skeleton`
 * in globals.css). Compose several of these to mirror a real layout while data
 * loads. Decorative — hidden from the a11y tree; mark the wrapping region with
 * `aria-busy` instead.
 */
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bp-skeleton rounded-md ${className}`} />;
}
