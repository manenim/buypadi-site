import type { ReactNode } from "react";

/**
 * "Scattered proof" — the shared decorative background system for BuyPadi's
 * dark-green sections. A faint dot texture ties every green area together, brand
 * line-motifs are scattered organically (each one restates the value prop:
 * magnifier = inspect, shield = verified, pin = anywhere, parcel = deliver), and
 * an optional ring "trust pulse" gives the section a focal point.
 *
 * One component, one vocabulary — density/placement is tuned per `variant`.
 * Purely decorative: absolutely positioned, non-interactive, hidden from a11y.
 *
 * Drop it as the first child of any `relative` + clipping (rounded/overflow-hidden)
 * green container, and give the real content `relative z-10`.
 */

type Variant = "hero" | "how" | "waitlist" | "cta";
type Glyph = "magnifier" | "shield" | "pin" | "parcel" | "check";

const GLYPH_PATHS: Record<Glyph, ReactNode> = {
  magnifier: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M24 24 l9 9" />
    </>
  ),
  shield: (
    <>
      <path d="M18 2 L33 8 V19 C33 28 26 35 18 38 C10 35 3 28 3 19 V8 Z" />
      <path d="M10 19 l6 6 l9 -11" />
    </>
  ),
  pin: (
    <>
      <path d="M16 2 C23 2 28 7 28 14 C28 24 16 35 16 35 C16 35 4 24 4 14 C4 7 9 2 16 2 Z" />
      <circle cx="16" cy="14" r="4" />
    </>
  ),
  parcel: (
    <>
      <path d="M4 12 L20 4 L36 12 L36 30 L20 38 L4 30 Z" />
      <path d="M4 12 L20 20 L36 12" />
      <path d="M20 20 L20 38" />
    </>
  ),
  check: (
    <>
      <circle cx="18" cy="18" r="13" />
      <path d="M11 18 l5 5 l9 -11" />
    </>
  ),
};

type Placement = {
  glyph: Glyph;
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
};

type Ring = { cx: number; cy: number; r: number; opacity: number };

type Config = {
  rings: Ring[];
  motifs: Placement[];
  nodes?: { cx: number; cy: number }[];
  /** Large filled focal shield (the Final CTA's "big shield"). */
  bigShield?: { x: number; y: number; scale: number; opacity: number };
};

// viewBox is 1200 × 500; preserveAspectRatio "slice" covers any card ratio.
const CONFIG: Record<Variant, Config> = {
  hero: {
    rings: [
      { cx: 960, cy: 250, r: 150, opacity: 0.16 },
      { cx: 960, cy: 250, r: 250, opacity: 0.08 },
    ],
    motifs: [
      { glyph: "magnifier", x: 120, y: 70, rotate: -12, scale: 1.4, opacity: 0.1 },
      { glyph: "pin", x: 90, y: 360, rotate: 8, scale: 1.3, opacity: 0.09 },
      { glyph: "parcel", x: 300, y: 410, rotate: -6, scale: 1.2, opacity: 0.08 },
      { glyph: "shield", x: 930, y: 215, rotate: 6, scale: 1.6, opacity: 0.12 },
      { glyph: "check", x: 1080, y: 360, rotate: 10, scale: 1, opacity: 0.08 },
    ],
    nodes: [{ cx: 138, cy: 88 }, { cx: 110, cy: 380 }],
  },
  how: {
    rings: [{ cx: 600, cy: 250, r: 300, opacity: 0.05 }],
    motifs: [
      { glyph: "magnifier", x: 80, y: 70, rotate: -10, scale: 1.2, opacity: 0.09 },
      { glyph: "shield", x: 560, y: 30, rotate: 6, scale: 1.1, opacity: 0.08 },
      { glyph: "pin", x: 1080, y: 70, rotate: -6, scale: 1.2, opacity: 0.09 },
      { glyph: "parcel", x: 1090, y: 360, rotate: 8, scale: 1.2, opacity: 0.08 },
      { glyph: "check", x: 90, y: 380, rotate: 12, scale: 1, opacity: 0.08 },
    ],
    nodes: [{ cx: 350, cy: 430 }, { cx: 880, cy: 60 }],
  },
  waitlist: {
    rings: [{ cx: 230, cy: 330, r: 170, opacity: 0.1 }],
    motifs: [
      { glyph: "shield", x: 180, y: 280, rotate: 0, scale: 1.4, opacity: 0.11 },
      { glyph: "magnifier", x: 70, y: 80, rotate: -10, scale: 1, opacity: 0.08 },
      { glyph: "pin", x: 470, y: 60, rotate: 8, scale: 0.9, opacity: 0.07 },
    ],
    nodes: [{ cx: 210, cy: 360 }],
  },
  cta: {
    rings: [{ cx: 980, cy: 250, r: 200, opacity: 0.08 }],
    motifs: [
      { glyph: "magnifier", x: 90, y: 80, rotate: -10, scale: 1.1, opacity: 0.08 },
      { glyph: "pin", x: 120, y: 360, rotate: 8, scale: 1, opacity: 0.07 },
      { glyph: "parcel", x: 360, y: 400, rotate: -8, scale: 1, opacity: 0.06 },
    ],
    // The Final CTA keeps its existing large shield image as the "big shield";
    // the pattern only adds texture + scattered motifs around it.
  },
};

function Motif({ glyph, x, y, rotate = 0, scale = 1, opacity = 0.1 }: Placement) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      opacity={opacity}
      stroke="#ffffff"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {GLYPH_PATHS[glyph]}
    </g>
  );
}

export default function BrandPattern({
  variant,
  className = "",
}: {
  variant: Variant;
  className?: string;
}) {
  const { rings, motifs, nodes, bigShield } = CONFIG[variant];
  const patternId = `bp-dots-${variant}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full select-none ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 500"
      fill="none"
    >
      <defs>
        <pattern
          id={patternId}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="#ffffff" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="1200" height="500" fill={`url(#${patternId})`} />

      {/* focal "trust pulse" rings */}
      <g fill="none" stroke="#8DC342">
        {rings.map((r, i) => (
          <circle key={i} cx={r.cx} cy={r.cy} r={r.r} opacity={r.opacity} />
        ))}
      </g>

      {/* large focal shield (Final CTA) */}
      {bigShield && (
        <path
          d="M20 2 L40 9 V25 C40 39 31 50 20 54 C9 50 0 39 0 25 V9 Z"
          fill="#8DC342"
          opacity={bigShield.opacity}
          transform={`translate(${bigShield.x} ${bigShield.y}) scale(${bigShield.scale})`}
        />
      )}

      {/* scattered meaningful motifs */}
      {motifs.map((m, i) => (
        <Motif key={i} {...m} />
      ))}

      {/* tiny lime nodes for cohesion */}
      {nodes && (
        <g fill="#A8E455" opacity="0.3">
          {nodes.map((n, i) => (
            <circle key={i} cx={n.cx} cy={n.cy} r="2.4" />
          ))}
        </g>
      )}
    </svg>
  );
}
