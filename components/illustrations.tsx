/**
 * Flat, outlined illustrations of AgentBond's robot agents, drawn in house in the
 * style of the reference: black 2.5px outlines, flat pink/yellow/teal fills, set in a circle.
 */

const S = { stroke: "#000", strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const PINK = "var(--color-pink)";
const YELLOW = "var(--color-yellow)";
const TEAL = "var(--color-teal)";
const CORAL = "var(--color-coral)";
const SKY = "var(--color-sky)";

/** Arm drawn as an outlined tube: black stroke with a colored stroke on top. */
function Limb({ d, color = YELLOW }: { d: string; color?: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="#000" strokeLinecap="round" strokeWidth="13" />
      <path d={d} fill="none" stroke={color} strokeLinecap="round" strokeWidth="8" />
    </>
  );
}

/** The robot agent: pink head with an antenna, yellow body. Origin at the top of the antenna. */
function Robot({
  x,
  y,
  mood = "happy",
  arms,
}: {
  x: number;
  y: number;
  mood?: "happy" | "worried" | "wow";
  arms?: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M60 10v18" {...S} />
      <circle cx="60" cy="8" fill={CORAL} r="6" {...S} />
      <rect fill={YELLOW} height="62" rx="20" width="66" x="27" y="92" {...S} />
      {arms}
      <rect fill={PINK} height="70" rx="32" width="96" x="12" y="26" {...S} />
      <circle cx="44" cy="58" fill="#000" r="4" />
      <circle cx="76" cy="58" fill="#000" r="4" />
      {mood === "happy" && <path d="M50 74q10 9 20 0" fill="none" {...S} />}
      {mood === "worried" && (
        <>
          <path d="M50 78q10-7 20 0" fill="none" {...S} />
          <path d="M36 44l14 4M84 44l-14 4" fill="none" {...S} />
        </>
      )}
      {mood === "wow" && <ellipse cx="60" cy="78" fill="#000" rx="6" ry="7" />}
    </g>
  );
}

function Frame({ fill, children, label }: { fill: string; children: React.ReactNode; label: string }) {
  const id = `clip-${label}`;
  return (
    <svg aria-hidden className="h-auto w-full" viewBox="0 0 320 320">
      <defs>
        <clipPath id={id}>
          <circle cx="160" cy="160" r="150" />
        </clipPath>
      </defs>
      <circle cx="160" cy="160" fill={fill} r="150" />
      <g clipPath={`url(#${id})`}>{children}</g>
      <circle cx="160" cy="160" fill="none" r="150" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function Coin({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 4} fill={PINK} rx={r} ry={r * 0.62} {...S} />
      <ellipse cx={x} cy={y} fill={PINK} rx={r} ry={r * 0.62} {...S} />
      <path d={`M${x - 4} ${y}h8`} {...S} />
    </g>
  );
}

/** A worried robot at a laptop, coins flying off to an unknown seller. */
export function PayingBlind() {
  return (
    <Frame fill={YELLOW} label="blind">
      <path d="M0 236h320v90H0z" fill={TEAL} {...S} />
      <path d="M40 236h240" {...S} />
      <Robot
        arms={
          <>
            <Limb d="M34 112 18 150 40 170" />
            <Limb d="M86 112 108 146 92 168" />
          </>
        }
        mood="worried"
        x={58}
        y={86}
      />
      <path d="M150 236l28-74h86l-28 74z" fill="#000" {...S} />
      <path d="M150 236h104" {...S} />
      <path
        d="M200 182q7-11 16-4 7 7-4 15v8M211 213v2"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <Coin x={252} y={92} />
      <Coin r={13} x={286} y={128} />
      <Coin r={11} x={222} y={58} />
      <path d="M232 104q-14 6-22 20M268 146q-6 14-20 22" fill="none" {...S} strokeDasharray="4 7" />
      <path d="M48 52q6-12 18-8M30 76q-8-10-2-20" fill="none" {...S} />
    </Frame>
  );
}

/** A happy robot holding up a report card that says hire. */
export function CheckedFirst() {
  return (
    <Frame fill={TEAL} label="checked">
      <path d="M0 250h320v80H0z" fill={SKY} {...S} />
      <Robot
        arms={
          <>
            <Limb d="M34 112 6 78 2 46" />
            <Limb d="M86 112 128 96 160 70" />
          </>
        }
        mood="happy"
        x={40}
        y={110}
      />
      <g transform="rotate(-8 222 120)">
        <rect fill="#fff" height="132" rx="10" width="104" x="170" y="54" {...S} />
        <path d="M186 76h52M186 90h34" {...S} />
        <text fontSize="44" fontWeight="600" x="186" y="140">
          96
        </text>
        <rect fill={TEAL} height="22" rx="11" width="58" x="186" y="152" {...S} />
        <path d="M197 163l6 6 11-12" fill="none" {...S} />
      </g>
      <path d="M268 40l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill={YELLOW} {...S} />
      <path d="M150 34l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#fff" {...S} />
    </Frame>
  );
}

/** Robot waving a coin, for the yellow band. */
export function WavingRobot({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 180 190">
      <Robot
        arms={
          <>
            <Limb d="M34 112 4 128 -4 156" />
            <Limb d="M86 112 122 92 134 58" />
          </>
        }
        mood="happy"
        x={20}
        y={20}
      />
      <Coin r={20} x={156} y={66} />
      <path d="M150 20q10-8 18 2M162 6q12-4 16 8" fill="none" {...S} />
    </svg>
  );
}
