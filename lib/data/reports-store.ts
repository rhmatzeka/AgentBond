import type { RiskReport } from "@/lib/types/report";

const MAX_REPORTS = 500;

// Kept on globalThis so API routes and server pages share one store in dev,
// where Next.js may load this module more than once. Still in-memory only:
// reports are lost when the server restarts.
const globalStore = globalThis as typeof globalThis & { __agentBondReports?: Map<string, RiskReport> };
const reports = (globalStore.__agentBondReports ??= new Map<string, RiskReport>());

export function saveReport(report: RiskReport) {
  reports.set(report.reportId, report);
  if (reports.size > MAX_REPORTS) {
    // Map preserves insertion order, so the first key is the oldest report.
    const oldest = reports.keys().next().value;
    if (oldest) reports.delete(oldest);
  }
  return report;
}

export function getReport(reportId: string) {
  return reports.get(reportId);
}

export function listReports() {
  return Array.from(reports.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
