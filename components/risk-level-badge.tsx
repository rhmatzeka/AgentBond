import type { RiskLevel } from "@/lib/types/report";

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const styles = {
    low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }[level];

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles}`}>{level} risk</span>;
}
