import { verdictLabel, verdictTone } from "@/lib/format";
import type { RecommendedAction } from "@/lib/types/report";

/**
 * Verdicts carry a tone and a shape, so they read without color too:
 * mint to hire, butter with a hatched frame to verify, coral with a cross to avoid.
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
  const text = `whitespace-nowrap ${size === "lg" ? "px-4 py-2 text-xl" : "px-3 py-1.5 text-[15px]"}`;
  const frame = `rounded-[10px] border-[3px] border-ink font-extrabold shadow-hard-sm ${animate ? "verdict-land" : ""}`;

  if (action === "hire") {
    return <span className={`inline-block ${verdictTone.hire} ${frame} ${text}`}>{verdictLabel.hire}</span>;
  }
  if (action === "verify") {
    return (
      <span className={`hatch inline-block bg-card p-1 ${frame}`}>
        <span className={`block rounded-[5px] ${verdictTone.verify} ${text}`}>{verdictLabel.verify}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 ${verdictTone.avoid} ${frame} ${text}`}>
      <svg aria-hidden className="h-[0.75em] w-[0.75em]" viewBox="0 0 10 10">
        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
      </svg>
      {verdictLabel.avoid}
    </span>
  );
}
