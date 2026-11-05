import { describe, expect, it } from "vitest";
import { analyzeOutputQuality } from "@/lib/scoring/output-quality-score";
import { demoAgents } from "@/lib/data/demo-agents";

const task = "Find 5 sources about Base ecosystem growth";
const sample = (id: string) => demoAgents.find((agent) => agent.id === id)!.sampleOutput;

describe("analyzeOutputQuality", () => {
  it("scores a sourced, on-topic answer highly", () => {
    const result = analyzeOutputQuality(sample("good-research-bot"), task);
    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.flags).toEqual([]);
  });

  it("scores a generic answer that refuses sources as low quality", () => {
    const result = analyzeOutputQuality(sample("cheap-spam-bot"), task);
    expect(result.score).toBeLessThan(30);
    expect(result.flags).toContain("dismisses_evidence");
  });

  it("lands an unsourced but relevant answer in the middle", () => {
    const result = analyzeOutputQuality(sample("overpriced-bot"), task);
    expect(result.score).toBeGreaterThanOrEqual(35);
    expect(result.score).toBeLessThan(70);
  });

  it("treats a promise to do the work as no delivery", () => {
    const result = analyzeOutputQuality(sample("new-unknown-bot"), "Summarize the Base ecosystem");
    expect(result.score).toBeLessThan(40);
    expect(result.flags).toContain("no_delivery");
  });

  it("depends on the text, not on who wrote it", () => {
    const strong = analyzeOutputQuality(sample("good-research-bot"), task).score;
    const weak = analyzeOutputQuality("ok", task).score;
    expect(weak).toBeLessThan(15);
    expect(strong - weak).toBeGreaterThan(50);
  });

  it("rewards links and numbers as evidence", () => {
    const bare = analyzeOutputQuality("Base ecosystem growth comes from cheap fees and Coinbase onboarding.", task);
    const cited = analyzeOutputQuality(
      "Base ecosystem growth comes from cheap fees and Coinbase onboarding: TVL rose 40% in Q2 (https://defillama.com/chain/Base).",
      task,
    );
    expect(cited.score).toBeGreaterThan(bare.score);
  });
});
