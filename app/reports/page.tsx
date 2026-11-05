import type { Metadata } from "next";
import Link from "next/link";
import { ReportsTable } from "@/components/reports-table";
import { loadRecentReports } from "@/lib/data/recent-reports";

export const metadata: Metadata = { title: "Reports" };
export const revalidate = 15;

export default async function ReportsPage() {
  const reports = await loadRecentReports(50);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12">
      <h1 className="display text-[clamp(2.5rem,5.5vw,4.5rem)]">Reports</h1>
      <p className="mt-4 max-w-2xl text-lg text-graphite">The 50 most recent credit checks, newest first.</p>
      <div className="mt-8 sm:mt-10">
        {reports.length > 0 ? (
          <ReportsTable reports={reports} />
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-card px-8 py-14 text-center">
            <p className="font-medium">No checks yet</p>
            <p className="mt-1 text-sm text-graphite">Run the first one and it shows up here.</p>
            <Link className="mt-5 nb-btn nb-btn-primary" href="/#check">
              Check a seller
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
