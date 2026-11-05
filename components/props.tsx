/**
 * Small flat props that sit on the feature cards: stickers, a price tag, a price chart
 * mockup, integration tiles and icons. Black outlines, flat fills, slight tilt.
 */

const S = { stroke: "#000", strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Round badge with hand-lettered text, like a sticker slapped on the card. */
export function RoundSticker({ text, className = "" }: { text: string; className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 100 100">
      <circle cx="50" cy="53" fill="#000" r="44" />
      <circle cx="50" cy="50" fill="var(--color-yellow)" r="44" {...S} />
      <circle cx="50" cy="50" fill="none" r="36" {...S} strokeDasharray="3 4" />
      <text fontSize="17" fontWeight="800" textAnchor="middle" transform="rotate(-14 50 50)" x="50" y="56">
        {text}
      </text>
    </svg>
  );
}

/** Luggage-tag shaped price label. */
export function PriceTag({ text, className = "" }: { text: string; className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 150 80">
      <path d="M30 14h104a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H30L6 42z" fill="#000" transform="translate(3 4)" />
      <path d="M30 10h104a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H30L6 38z" fill="var(--color-yellow)" {...S} />
      <circle cx="28" cy="38" fill="#000" r="5" />
      <text fontSize="22" fontWeight="800" x="44" y="46">
        {text}
      </text>
    </svg>
  );
}

const bars = [38, 52, 30, 64, 46, 58, 72, 40, 66, 54];
const line = [62, 48, 52, 36, 44, 30, 22, 34, 18, 26];

/** White mockup card: market range for a task with a little chart. */
export function PriceChart() {
  return (
    <div className="light w-[19rem] rounded-2xl border border-black bg-white text-black shadow-[6px_6px_0_0_#000]">
      <div className="grid grid-cols-2 border-b border-black">
        <div className="border-r border-black p-4">
          <p className="text-3xl">2 USDC</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px]">
            <span className="h-2.5 w-2.5 rounded-full bg-black" />
            Floor
          </p>
        </div>
        <div className="p-4">
          <p className="text-3xl">3 USDC</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px]">
            <span className="h-2.5 w-2.5 rounded-full bg-pink" />
            Ceiling
          </p>
        </div>
      </div>
      <svg aria-hidden className="block w-full p-4" viewBox="0 0 220 90">
        {bars.map((height, index) => (
          <rect fill="#d9d9d4" height={height} key={index} width="12" x={8 + index * 21} y={90 - height} />
        ))}
        <polyline
          fill="none"
          points={line.map((y, index) => `${14 + index * 21},${y}`).join(" ")}
          stroke="var(--color-pink)"
          strokeWidth="3"
        />
        {line.map((y, index) => (
          <circle cx={14 + index * 21} cy={y} fill="var(--color-pink)" key={index} r="4" />
        ))}
      </svg>
    </div>
  );
}

function TileGlyph({ kind }: { kind: "code" | "chain" | "wallet" | "bot" }) {
  if (kind === "code") return <path d="M14 12l-8 8 8 8M26 12l8 8-8 8" fill="none" {...S} strokeWidth="3.5" />;
  if (kind === "chain")
    return (
      <>
        <rect fill="none" height="12" rx="6" width="20" x="5" y="14" {...S} strokeWidth="3.5" />
        <rect fill="none" height="12" rx="6" width="20" x="15" y="14" {...S} strokeWidth="3.5" />
      </>
    );
  if (kind === "wallet")
    return (
      <>
        <rect fill="none" height="22" rx="4" width="30" x="5" y="10" {...S} strokeWidth="3.5" />
        <circle cx="27" cy="21" fill="#000" r="2.5" />
      </>
    );
  return (
    <>
      <rect fill="none" height="20" rx="8" width="28" x="6" y="12" {...S} strokeWidth="3.5" />
      <circle cx="15" cy="22" fill="#000" r="2.5" />
      <circle cx="25" cy="22" fill="#000" r="2.5" />
      <path d="M20 12V6" {...S} strokeWidth="3.5" />
    </>
  );
}

/** Square app-style tile with a flat glyph and a hard shadow. */
export function Tile({
  kind,
  fill,
  className = "",
}: {
  kind: "code" | "chain" | "wallet" | "bot";
  fill: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`grid h-20 w-20 place-items-center rounded-2xl border-2 border-black shadow-[4px_4px_0_0_#000] ${className}`}
      style={{ background: fill }}
    >
      <svg className="h-10 w-10" viewBox="0 0 40 40">
        <TileGlyph kind={kind} />
      </svg>
    </span>
  );
}

export type IconKind = "magnifier" | "warning" | "coin" | "clock" | "shield" | "spark" | "people" | "doc";

const iconPaths: Record<IconKind, React.ReactNode> = {
  magnifier: (
    <>
      <circle cx="17" cy="17" fill="var(--color-sky)" r="10" {...S} />
      <path d="M25 25l9 9" {...S} strokeWidth="5" />
    </>
  ),
  warning: (
    <>
      <path d="M20 4l17 30H3z" fill="var(--color-yellow)" {...S} />
      <path d="M20 14v9M20 28v1" {...S} strokeWidth="3.5" />
    </>
  ),
  coin: (
    <>
      <ellipse cx="20" cy="24" fill="var(--color-pink)" rx="15" ry="10" {...S} />
      <ellipse cx="20" cy="18" fill="var(--color-pink)" rx="15" ry="10" {...S} />
    </>
  ),
  clock: (
    <>
      <circle cx="20" cy="20" fill="var(--color-teal)" r="15" {...S} />
      <path d="M20 11v10l7 4" fill="none" {...S} strokeWidth="3" />
    </>
  ),
  shield: (
    <>
      <path d="M20 4l14 5v10c0 9-6 14-14 18C12 33 6 28 6 19V9z" fill="var(--color-coral)" {...S} />
      <path d="M13 20l5 5 9-10" fill="none" {...S} strokeWidth="3" />
    </>
  ),
  spark: <path d="M20 3l4 12 12 5-12 5-4 12-4-12-12-5 12-5z" fill="var(--color-yellow)" {...S} />,
  people: (
    <>
      <circle cx="14" cy="14" fill="var(--color-sky)" r="6" {...S} />
      <circle cx="27" cy="16" fill="var(--color-pink)" r="6" {...S} />
      <path d="M4 34c0-8 5-12 10-12s10 4 10 12zM18 34c1-7 5-10 9-10s9 3 9 10z" fill="var(--color-teal)" {...S} />
    </>
  ),
  doc: (
    <>
      <path d="M9 4h16l7 7v25H9z" fill="#fff" {...S} />
      <path d="M14 18h12M14 24h12M14 30h7" {...S} />
    </>
  ),
};

export function FlatIcon({ kind, className = "h-11 w-11" }: { kind: IconKind; className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 40 40">
      {iconPaths[kind]}
    </svg>
  );
}

/** Round robot face used as the "author" avatar under quotes. */
export function RobotAvatar({ fill, className = "h-12 w-12" }: { fill: string; className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 48 48">
      <circle cx="24" cy="24" fill={fill} r="23" {...S} />
      <rect fill="var(--color-pink)" height="18" rx="8" width="26" x="11" y="17" {...S} />
      <path d="M24 17v-5" {...S} />
      <circle cx="24" cy="10" fill="var(--color-coral)" r="2.5" {...S} />
      <circle cx="19" cy="25" fill="#000" r="1.8" />
      <circle cx="29" cy="25" fill="#000" r="1.8" />
      <path d="M21 30q3 2.5 6 0" fill="none" {...S} />
    </svg>
  );
}
