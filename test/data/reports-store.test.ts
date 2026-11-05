import { describe, expect, it } from "vitest";
import { createMemoryReportStore } from "@/lib/data/reports-store";
import type { RiskReport } from "@/lib/types/report";

function report(id: string, createdAt: string) {
  return { reportId: id, createdAt, reportHash: `0x${"1".repeat(64)}` } as RiskReport;
}

const anchor = {
  txHash: `0x${"a".repeat(64)}` as const,
  requester: `0x${"b".repeat(40)}` as const,
  blockNumber: 12,
  anchoredAt: "2026-11-05T00:00:00.000Z",
};

describe("memory report store", () => {
  it("saves, reads, and lists newest first with a limit", async () => {
    const store = createMemoryReportStore();
    await store.save(report("a", "2026-01-01T00:00:00Z"));
    await store.save(report("b", "2026-01-02T00:00:00Z"));
    await store.save(report("c", "2026-01-03T00:00:00Z"));

    expect((await store.get("b"))?.reportId).toBe("b");
    expect(await store.get("missing")).toBeUndefined();
    expect((await store.list(2)).map((item) => item.reportId)).toEqual(["c", "b"]);
  });

  it("evicts the oldest report past its capacity", async () => {
    const store = createMemoryReportStore(2);
    await store.save(report("a", "2026-01-01T00:00:00Z"));
    await store.save(report("b", "2026-01-02T00:00:00Z"));
    await store.save(report("c", "2026-01-03T00:00:00Z"));
    expect(await store.get("a")).toBeUndefined();
  });

  it("sets the anchor once and keeps the first one", async () => {
    const store = createMemoryReportStore();
    await store.save(report("a", "2026-01-01T00:00:00Z"));

    expect((await store.setAnchor("a", anchor))?.anchor).toEqual(anchor);
    const second = await store.setAnchor("a", { ...anchor, blockNumber: 99 });
    expect(second?.anchor?.blockNumber).toBe(12);
    expect(await store.setAnchor("missing", anchor)).toBeUndefined();
  });
});
