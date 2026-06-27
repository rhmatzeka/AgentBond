import type { RiskReport } from "@/lib/types/report";

const reports = new Map<string, RiskReport>();

export function saveReport(report: RiskReport) {
  reports.set(report.reportId, report);
  return report;
}

export function getReport(reportId: string) {
  return reports.get(reportId);
}

export function listReports() {
  return Array.from(reports.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
