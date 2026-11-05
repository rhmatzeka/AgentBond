import type { Metadata } from "next";
import Link from "next/link";
import { ReportsTable } from "@/components/reports-table";
import { loadRecentReports } from "@/lib/data/recent-reports";

export const metadata: Metadata = { title: "Reports" };
export const revalidate = 15;

export default async function ReportsPage() {
  const reports = await loadRecentReports(50);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">Reports</h1>
      <p className="mt-2 max-w-2xl text-graphite">The 50 most recent credit checks, newest first.</p>
      <div className="mt-8">
        {reports.length > 0 ? (
          <ReportsTable reports={reports} />
        ) : (
          <div className="border-2 border-dashed border-ink bg-card px-8 py-14 text-center">
            <p className="font-semibold">No checks yet</p>
            <p className="mt-1 text-sm text-graphite">Run the first one and it shows up here.</p>
            <Link className="mt-5 nb-btn bg-ink text-card" href="/#check">
              Check a seller
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
