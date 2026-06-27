import { createHash } from "node:crypto";

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
