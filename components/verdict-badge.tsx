import { verdictLabel } from "@/lib/format";
import type { RecommendedAction } from "@/lib/types/report";

/**
 * Verdicts are told apart by pattern, not color: solid black to hire,
 * hatched to verify, an outlined cross to avoid.
 */
export function VerdictBadge({
  action,
  size = "md",
  animate = false,
}: {
  action: RecommendedAction;
  size?: "md" | "lg";
  animate?: boolean;
}) {
  const text = `whitespace-nowrap ${size === "lg" ? "px-4 py-2 text-xl" : "px-3 py-1.5 text-base"}`;
  const motion = animate ? "verdict-land" : "";

  if (action === "hire") {
    return (
      <span
        className={`inline-block border-2 border-ink bg-ink font-extrabold text-card shadow-hard-sm ${text} ${motion}`}
      >
        {verdictLabel.hire}
      </span>
    );
  }
  if (action === "verify") {
    return (
      <span className={`hatch inline-block border-2 border-ink p-1 shadow-hard-sm ${motion}`}>
        <span className={`block bg-card font-extrabold ${text}`}>{verdictLabel.verify}</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-ink bg-card font-extrabold shadow-hard-sm ${text} ${motion}`}
    >
      <svg aria-hidden className="h-[0.8em] w-[0.8em]" viewBox="0 0 10 10">
        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="2.2" />
      </svg>
      {verdictLabel.avoid}
    </span>
  );
}
