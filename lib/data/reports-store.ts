import { neon } from "@neondatabase/serverless";
import type { ReportAnchor, RiskReport } from "@/lib/types/report";

export type ReportStore = {
  save(report: RiskReport): Promise<RiskReport>;
  get(reportId: string): Promise<RiskReport | undefined>;
  list(limit?: number): Promise<RiskReport[]>;
  /** Records the on-chain anchor unless one is already set. Returns the stored report. */
  setAnchor(reportId: string, anchor: ReportAnchor): Promise<RiskReport | undefined>;
};

const DEFAULT_LIST_LIMIT = 20;

export function createMemoryReportStore(capacity = 500): ReportStore {
  const reports = new Map<string, RiskReport>();
  return {
    async save(report) {
      reports.set(report.reportId, report);
      // Map keeps insertion order, so the first key is the oldest report.
      if (reports.size > capacity) reports.delete(reports.keys().next().value!);
      return report;
    },
    async get(reportId) {
      return reports.get(reportId);
    },
    async list(limit = DEFAULT_LIST_LIMIT) {
      return [...reports.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
    },
    async setAnchor(reportId, anchor) {
      const report = reports.get(reportId);
      if (!report) return undefined;
      if (!report.anchor) reports.set(reportId, { ...report, anchor });
      return reports.get(reportId);
    },
  };
}

export function createPostgresReportStore(databaseUrl: string): ReportStore {
  const sql = neon(databaseUrl);
  let ready: Promise<unknown> | undefined;
  const ensureSchema = () =>
    (ready ??= sql`
      create table if not exists agentbond_reports (
        report_id text primary key,
        seller_agent_id text not null,
        created_at timestamptz not null,
        report jsonb not null
      )`
      .then(() => sql`create index if not exists agentbond_reports_created_at on agentbond_reports (created_at desc)`)
      .catch((error) => {
        ready = undefined;
        throw error;
      }));

  return {
    async save(report) {
      await ensureSchema();
      await sql`
        insert into agentbond_reports (report_id, seller_agent_id, created_at, report)
        values (${report.reportId}, ${report.sellerAgentId}, ${report.createdAt}, ${JSON.stringify(report)}::jsonb)`;
      return report;
    },
    async get(reportId) {
      await ensureSchema();
      const rows = await sql`select report from agentbond_reports where report_id = ${reportId}`;
      return rows[0]?.report as RiskReport | undefined;
    },
    async list(limit = DEFAULT_LIST_LIMIT) {
      await ensureSchema();
      const rows = await sql`select report from agentbond_reports order by created_at desc limit ${limit}`;
      return rows.map((row) => row.report as RiskReport);
    },
    async setAnchor(reportId, anchor) {
      await ensureSchema();
      const rows = await sql`
        update agentbond_reports
        set report = jsonb_set(report, '{anchor}', coalesce(report->'anchor', ${JSON.stringify(anchor)}::jsonb))
        where report_id = ${reportId}
        returning report`;
      return rows[0]?.report as RiskReport | undefined;
    },
  };
}

// Kept on globalThis so API routes and server pages share one store in dev,
// where Next.js may load this module more than once.
const globalStore = globalThis as typeof globalThis & { __agentBondReportStore?: ReportStore };

/** Postgres (Neon) when DATABASE_URL is set, otherwise an in-memory store that resets on restart. */
export function getReportStore(): ReportStore {
  return (globalStore.__agentBondReportStore ??= process.env.DATABASE_URL
    ? createPostgresReportStore(process.env.DATABASE_URL)
    : createMemoryReportStore());
}

export const isReportStorePersistent = () => Boolean(process.env.DATABASE_URL);
