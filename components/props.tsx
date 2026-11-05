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

/** White mockup card: the real market range per task type, drawn on a 0 to 5 USDC axis. */
export function BenchmarkChart({ ranges }: { ranges: { label: string; min: number; max: number }[] }) {
  const axis = 5;
  return (
    <div
      className="light w-full max-w-[22rem] rounded-2xl border border-black bg-white text-black shadow-[6px_6px_0_0_#000]"
      data-shadow
    >
      <p className="border-b border-black px-5 py-3 text-[15px]">Market range per task, in USDC</p>
      <ul className="space-y-3.5 px-5 py-5">
        {ranges.map((range) => (
          <li key={range.label}>
            <p className="flex justify-between text-[14px]">
              <span>{range.label}</span>
              <span className="tabular-nums">
                {range.min} to {range.max}
              </span>
            </p>
            <div className="relative mt-1.5 h-3 rounded-full bg-[#e8e8e3]">
              <div
                className="absolute inset-y-0 rounded-full border border-black bg-pink"
                style={{ left: `${(range.min / axis) * 100}%`, right: `${100 - (range.max / axis) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="flex justify-between border-t border-black px-5 py-2 text-[12px] tabular-nums text-[#4b4b47]">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </p>
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
      className={`grid h-14 w-14 place-items-center rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] sm:h-20 sm:w-20 sm:rounded-2xl sm:shadow-[4px_4px_0_0_#000] ${className}`}
      style={{ background: fill }}
    >
      <svg className="h-7 w-7 sm:h-10 sm:w-10" viewBox="0 0 40 40">
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
      <path d="M25 25l9 9" stroke="var(--color-sky)" strokeLinecap="round" strokeWidth="6" />
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
