import { pricingBenchmarks } from "@/lib/data/pricing-benchmarks";
import type { TaskType } from "@/lib/types/agent";
import type { RiskCheckRequest } from "@/lib/types/report";

const MAX_TEXT_LENGTH = 10_000;
const MAX_PRICE_USDC = 1_000_000;

export const taskTypes = Object.keys(pricingBenchmarks) as TaskType[];

export function isTaskType(value: unknown): value is TaskType {
  return typeof value === "string" && (taskTypes as string[]).includes(value);
}

export class ValidationError extends Error {}

function optionalText(body: Record<string, unknown>, field: string) {
  const value = body[field];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") throw new ValidationError(`${field} must be a string`);
  if (value.length > MAX_TEXT_LENGTH) {
    throw new ValidationError(`${field} must be at most ${MAX_TEXT_LENGTH} characters`);
  }
  return value;
}

export function parseRiskCheckRequest(body: unknown): RiskCheckRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Request body must be a JSON object");
  }
  const input = body as Record<string, unknown>;

  const { sellerAgentId, taskType, proposedPriceUsdc, capOrderId } = input;
  if (typeof sellerAgentId !== "string" || !sellerAgentId.trim()) {
    throw new ValidationError("sellerAgentId is required");
  }
  if (!isTaskType(taskType)) {
    throw new ValidationError(`taskType must be one of: ${taskTypes.join(", ")}`);
  }
  if (
    typeof proposedPriceUsdc !== "number" ||
    !Number.isFinite(proposedPriceUsdc) ||
    proposedPriceUsdc < 0 ||
    proposedPriceUsdc > MAX_PRICE_USDC
  ) {
    throw new ValidationError("proposedPriceUsdc must be a non-negative number");
  }
  if (capOrderId !== undefined && typeof capOrderId !== "string") {
    throw new ValidationError("capOrderId must be a string");
  }

  return {
    sellerAgentId: sellerAgentId.trim(),
    taskType,
    proposedPriceUsdc,
    sampleTask: optionalText(input, "sampleTask"),
    sampleOutput: optionalText(input, "sampleOutput"),
    capOrderId: capOrderId || undefined,
  };
}
