import type { QualityJudge } from "@/lib/llm/quality-judge";
import { analyzeOutputQuality } from "@/lib/scoring/output-quality-score";
import type { TaskType } from "@/lib/types/agent";
import type { CheckerResult } from "@/lib/types/checker";

const LLM_WEIGHT = 0.7;

export async function runOutputQualityChecker(
  input: { taskType: TaskType; task: string; output: string },
  judge: QualityJudge | null,
): Promise<CheckerResult> {
  const heuristic = analyzeOutputQuality(input.output, input.task);
  const verdict = judge ? await judge(input) : null;

  const score = verdict ? Math.round(verdict.score * LLM_WEIGHT + heuristic.score * (1 - LLM_WEIGHT)) : heuristic.score;
  const flags = [...new Set([...heuristic.flags, ...(verdict?.flags ?? [])])];
  if (score < 50) flags.push("low_output_quality");

  return {
    checkerName: "OutputQualityChecker",
    score,
    riskFlags: flags,
    notes: verdict?.summary ? [verdict.summary, ...heuristic.notes] : heuristic.notes,
    method: verdict ? "llm" : "heuristic",
    ...(verdict && { model: verdict.model }),
  };
}
