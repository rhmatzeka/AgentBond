import type { RiskLevel } from "@/lib/types/report";

const styles: Record<RiskLevel, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  high: "border-red-500/30 bg-red-500/10 text-red-400",
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs uppercase ${styles[level]}`}>
      {level} risk
    </span>
  );
}
