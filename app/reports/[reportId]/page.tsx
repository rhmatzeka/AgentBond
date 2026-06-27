import Link from "next/link";

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-black">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8">
        <Link className="text-sm font-medium text-zinc-600" href="/">
          Back to dashboard
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Report {reportId}</h1>
        <p className="mt-4 leading-7 text-zinc-600">
          Reports are stored in memory for the MVP demo. Open the dashboard, run a check, and use the visible report card for the live proof flow.
        </p>
      </div>
    </main>
  );
}
