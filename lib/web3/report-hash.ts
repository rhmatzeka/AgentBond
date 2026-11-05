import { createHash } from "node:crypto";
import type { RiskReport } from "@/lib/types/report";

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, sortValue(nested)]),
    );
  }
  return value;
}

export function stableStringify(value: unknown) {
  return JSON.stringify(sortValue(value));
}

export function hashReport(value: unknown): `0x${string}` {
  return `0x${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}

/** Recomputes the hash from the stored fields, so a page can show the report was not edited. */
export function verifyReportHash(report: RiskReport) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reportHash, anchor, ...hashed } = report;
  return hashReport(hashed) === reportHash;
}
