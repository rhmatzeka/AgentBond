import type { RecommendedAction, RiskLevel } from "@/lib/types/report";

export const shortHex = (value: string, head = 6, tail = 4) =>
  value.length <= head + tail + 1 ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;

export const formatUsdc = (value: number) => `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDC`;

/** Background tone per verdict: mint to hire, butter to verify, coral to avoid. */
export const verdictTone: Record<RecommendedAction, string> = {
  hire: "bg-mint",
  verify: "bg-sun",
  avoid: "bg-coral",
};

/** Same tones keyed by score band, for bars and numbers. */
export function scoreTone(score: number) {
  return score >= 70 ? "bg-mint" : score >= 40 ? "bg-sun" : "bg-coral";
}

export const verdictLabel: Record<RecommendedAction, string> = {
  hire: "Hire",
  verify: "Verify first",
  avoid: "Avoid",
};

export const riskLabel: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export const checkerLabel: Record<string, { name: string; weight: number; asks: string }> = {
  OutputQualityChecker: { name: "Output quality", weight: 40, asks: "Does the sample answer the task, with sources?" },
  ReputationChecker: { name: "Reputation", weight: 30, asks: "Completion rate, rating, buyer diversity, refunds." },
  PricingBenchmarkChecker: { name: "Price", weight: 20, asks: "Is the quote inside the market range for this task?" },
  TaskFitChecker: { name: "Task fit", weight: 10, asks: "Has the seller done this kind of task before?" },
};

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
