import type { SellerAgent, TaskType } from "@/lib/types/agent";

export function calculateTaskFitScore(agent: SellerAgent, taskType: TaskType) {
  if (agent.taskTypes[0] === taskType) return 100;
  if (agent.taskTypes.includes(taskType)) return 75;
  if (agent.completedJobs > 5) return 50;
  if (agent.completedJobs > 0) return 25;
  return 0;
}
