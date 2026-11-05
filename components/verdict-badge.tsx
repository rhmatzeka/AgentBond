import { verdictLabel, verdictTone } from "@/lib/format";
import type { RecommendedAction } from "@/lib/types/report";

const icons: Record<RecommendedAction, string> = {
  hire: "M2 6.5l2.6 2.6L10 3.5",
  verify: "M2 6h8",
  avoid: "M2.5 2.5l7 7M9.5 2.5l-7 7",
};

/** Pill per verdict: teal to hire, yellow to verify, coral to avoid, each with its own mark. */
export function VerdictBadge({
  action,
  size = "md",
  animate = false,
}: {
  action: RecommendedAction;
  size?: "md" | "lg";
  animate?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-black text-black ${verdictTone[action]} ${size === "lg" ? "px-5 py-2 text-xl" : "px-3.5 py-1.5 text-[15px]"} ${animate ? "verdict-land" : ""}`}
    >
      <svg aria-hidden className="h-[0.8em] w-[0.8em]" viewBox="0 0 12 12">
        <path d={icons[action]} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
      {verdictLabel[action]}
    </span>
  );
}
