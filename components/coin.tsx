type Face = "check" | "cross" | "dash" | { text: string };

/** A flat illustrated coin seen at an angle: thick rim, black outline, symbol on top. */
export function Coin({ face, fill, className = "" }: { face: Face; fill: string; className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 120 96">
      <g stroke="#000" strokeWidth="2">
        <ellipse cx="60" cy="56" fill={fill} rx="56" ry="36" />
        <rect fill={fill} height="16" stroke="none" width="112" x="4" y="40" />
        <path d="M4 40v16M116 40v16" fill="none" />
        <ellipse cx="60" cy="40" fill={fill} rx="56" ry="36" />
        <ellipse cx="60" cy="40" fill="none" rx="44" ry="27" strokeWidth="1.5" />
      </g>
      <g transform="translate(60 40) scale(1 0.66)">
        {face === "check" && (
          <path d="M-20 0l13 13 27-28" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="9" />
        )}
        {face === "cross" && (
          <path d="M-16-16l32 32M16-16l-32 32" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="9" />
        )}
        {face === "dash" && <path d="M-18 0h36" stroke="#000" strokeLinecap="round" strokeWidth="9" />}
        {typeof face === "object" && (
          <text dominantBaseline="central" fontSize="40" fontWeight="600" textAnchor="middle">
            {face.text}
          </text>
        )}
      </g>
    </svg>
  );
}
