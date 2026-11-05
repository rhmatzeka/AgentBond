import type { Icon } from "@phosphor-icons/react";
import { CheckIcon, MinusIcon, XIcon } from "@phosphor-icons/react/ssr";
import { verdictLabel, verdictTone } from "@/lib/format";
import type { RecommendedAction } from "@/lib/types/report";

const icons: Record<RecommendedAction, Icon> = {
  hire: CheckIcon,
  verify: MinusIcon,
  avoid: XIcon,
};

/** Pill per verdict: teal to hire, yellow to verify, coral to avoid, each with its own mark. */
export function VerdictBadge({ action, size = "md" }: { action: RecommendedAction; size?: "md" | "lg" }) {
  const Mark = icons[action];
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-black text-black ${verdictTone[action]} ${size === "lg" ? "px-5 py-2 text-xl" : "px-3.5 py-1.5 text-[15px]"}`}
    >
      <Mark aria-hidden className="h-[0.9em] w-[0.9em]" weight="bold" />
      {verdictLabel[action]}
    </span>
  );
}
