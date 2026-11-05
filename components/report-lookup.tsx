"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Field that opens a report by its ID, e.g. report_3f9c1a… */
export function ReportLookup({ className = "", button }: { className?: string; button?: "icon" | "arrow" }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      className={`flex items-stretch ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        const id = value.trim();
        if (id) router.push(`/reports/${encodeURIComponent(id)}`);
      }}
      role="search"
    >
      <label className="sr-only" htmlFor="report-lookup">
        Report ID
      </label>
      <input
        className="min-w-0 flex-1 border border-line bg-card px-5 py-3.5 text-lg text-ink placeholder:text-graphite focus:border-pink focus:outline-none"
        id="report-lookup"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Look up a report ID…"
        value={value}
      />
      {button === "arrow" ? (
        <button aria-label="Open report" className="ml-1.5 bg-pink px-6 text-2xl text-black hover:bg-ink" type="submit">
          →
        </button>
      ) : (
        <button
          aria-label="Open report"
          className="-ml-px grid place-items-center border border-line bg-card px-5 text-ink hover:bg-mist"
          type="submit"
        >
          <svg aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 21 21" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </form>
  );
}
