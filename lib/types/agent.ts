export type TaskType = "research" | "summary" | "code_review" | "data_extraction";

export type SellerAgent = {
  id: string;
  name: string;
  description: string;
  taskTypes: TaskType[];
  completedJobs: number;
  failedJobs: number;
  uniqueBuyers: number;
  repeatBuyers: number;
  averageRating: number;
  refundCount: number;
  suspiciousActivity: boolean;
  defaultPriceUsdc: number;
  sampleOutputQuality: "high" | "medium" | "low" | "unknown";
  sampleOutput: string;
};
