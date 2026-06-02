/**
 * Brand loading spinner — a smooth lime "comet" arc that sweeps over a faint
 * track ring. The track uses `currentColor`, so the spinner adapts to its
 * context (defaults to brand dark-green). Pass a `label` for page-level loads.
 *
 * Pure CSS animation (`animate-spin`) — no client JS required.
 */
export default function Spinner({
  size = 44,
  label,
  className = "",
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <svg
        className="animate-spin text-primary"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bp-spinner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8DC342" stopOpacity="0" />
            <stop offset="55%" stopColor="#8DC342" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8DC342" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="5"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="url(#bp-spinner)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="60 200"
        />
      </svg>
      {label ? (
        <p className="text-sm font-medium text-muted">{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
