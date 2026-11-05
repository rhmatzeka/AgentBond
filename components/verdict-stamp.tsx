import { verdictColor, verdictLabel } from "@/lib/format";
import type { RecommendedAction } from "@/lib/types/report";

export function VerdictStamp({ action, animate = false }: { action: RecommendedAction; animate?: boolean }) {
  return (
    <span
      className={`stamp inline-block rotate-[-8deg] rounded-md px-3.5 py-1.5 text-xl font-bold tracking-tight ${verdictColor[action]} ${animate ? "stamp-land" : ""}`}
    >
      {verdictLabel[action]}
    </span>
  );
}
