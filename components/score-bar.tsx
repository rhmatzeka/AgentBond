/** Bar filled solid when strong, hatched when mixed, dotted when weak. */
export function ScoreBar({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const fill = score >= 70 ? "bg-ink" : score >= 40 ? "hatch" : "dots";
  return (
    <div aria-hidden className={`border-2 border-ink bg-card ${size === "lg" ? "h-5" : "h-3"}`}>
      <div
        className={`h-full border-r-2 border-ink ${fill} ${score === 0 ? "hidden" : ""}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
