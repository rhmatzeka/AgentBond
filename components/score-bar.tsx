import { scoreTone } from "@/lib/format";

/** Bar tinted mint when strong, butter when mixed, coral when weak. */
export function ScoreBar({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const fill = scoreTone(score);
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-full border-2 border-ink bg-card ${size === "lg" ? "h-6" : "h-3.5"}`}
    >
      <div
        className={`h-full border-r-2 border-ink ${fill} ${score === 0 ? "hidden" : ""} ${score >= 100 ? "border-r-0" : ""}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
