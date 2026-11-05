import { scoreTone } from "@/lib/format";

/** Thin pill bar tinted mint when strong, sun when mixed, coral when weak. */
export function ScoreBar({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-full border border-line bg-card ${size === "lg" ? "h-4" : "h-2.5"}`}
    >
      <div
        className={`h-full rounded-full border-r border-line ${scoreTone(score)} ${score === 0 ? "hidden" : ""}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
