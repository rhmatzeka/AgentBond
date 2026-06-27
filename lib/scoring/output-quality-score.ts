import type { SellerAgent } from "@/lib/types/agent";

export function calculateOutputQualityScore(agent: SellerAgent, sampleOutput: string) {
  const base = {
    high: 92,
    medium: 66,
    low: 28,
    unknown: 55,
  }[agent.sampleOutputQuality];

  const sourceBonus = /source|sources|docs|l2beat|defillama|coinbase/i.test(sampleOutput) ? 5 : 0;
  const shortPenalty = sampleOutput.trim().length < 80 ? 10 : 0;

  return Math.max(0, Math.min(100, base + sourceBonus - shortPenalty));
}
