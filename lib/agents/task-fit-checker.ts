import { calculateTaskFitScore } from "@/lib/scoring/task-fit-score";
import type { SellerAgent, TaskType } from "@/lib/types/agent";
import type { CheckerResult } from "@/lib/types/checker";

export function runTaskFitChecker(agent: SellerAgent, taskType: TaskType): CheckerResult {
  const score = calculateTaskFitScore(agent, taskType);
  return {
    checkerName: "TaskFitChecker",
    score,
    riskFlags: score < 50 ? ["task_mismatch"] : [],
    notes: agent.taskTypes.includes(taskType)
      ? [`Seller has history for ${taskType} tasks.`]
      : [`Seller does not clearly specialize in ${taskType} tasks.`],
  };
}
