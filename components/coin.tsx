type Face = "check" | "cross" | "dash" | { text: string };

/**
 * A thick flat coin seen at an angle: deep rim, black outline, one bold mark on the face.
 * Rotate the wrapper to tilt it.
 */
export function Coin({ face, fill, className = "" }: { face: Face; fill: string; className?: string }) {
  return (
    <svg aria-hidden className={className} overflow="visible" viewBox="0 0 120 104">
      <g stroke="#000" strokeLinejoin="round" strokeWidth="2.2">
        <ellipse cx="60" cy="62" fill={fill} rx="56" ry="38" />
        <rect fill={fill} height="22" stroke="none" width="112" x="4" y="40" />
        <path d="M4 40v22M116 40v22" fill="none" />
        <ellipse cx="60" cy="40" fill={fill} rx="56" ry="38" />
      </g>
      <g transform="translate(60 40) scale(1 0.68)">
        {face === "check" && (
          <path d="M-24 0l15 15 33-34" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="13" />
        )}
        {face === "cross" && (
          <path d="M-20-20l40 40M20-20l-40 40" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="13" />
        )}
        {face === "dash" && <path d="M-24 0h48" stroke="#000" strokeLinecap="round" strokeWidth="13" />}
        {typeof face === "object" && (
          <text
            dominantBaseline="central"
            fontFamily="var(--font-dm-sans)"
            fontSize="64"
            fontWeight="900"
            letterSpacing="-2"
            textAnchor="middle"
            y="3"
          >
            {face.text}
          </text>
        )}
      </g>
    </svg>
  );
}
