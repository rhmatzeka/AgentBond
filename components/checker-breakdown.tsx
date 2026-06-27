import type { CheckerResult } from "@/lib/types/checker";

export function CheckerBreakdown({ results }: { results: CheckerResult[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {results.map((result) => (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4" key={result.checkerName}>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">{result.checkerName}</h4>
            <span className="font-mono text-sm">{result.score}/100</span>
          </div>
          <div className="mb-3 h-2 rounded-full bg-zinc-100">
            <div className="h-2 rounded-full bg-[#00d4a4]" style={{ width: `${result.score}%` }} />
          </div>
          <p className="text-sm leading-6 text-zinc-600">{result.notes[0]}</p>
        </div>
      ))}
    </div>
  );
}
