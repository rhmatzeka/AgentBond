import { describe, expect, it } from "vitest";
import { demoAgents } from "@/lib/data/demo-agents";
import { calculateReputationScore } from "@/lib/scoring/reputation-score";

describe("reputation score", () => {
  it("rewards healthy agents more than suspicious agents", () => {
    const good = demoAgents.find((agent) => agent.id === "good-research-bot")!;
    const spam = demoAgents.find((agent) => agent.id === "cheap-spam-bot")!;

    expect(calculateReputationScore(good)).toBeGreaterThan(calculateReputationScore(spam));
  });

  it("penalizes suspicious activity and refunds", () => {
    const spam = demoAgents.find((agent) => agent.id === "cheap-spam-bot")!;

    expect(calculateReputationScore(spam)).toBeLessThan(60);
  });
});
