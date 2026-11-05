"use client";

import { ArrowRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
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
        className="min-w-0 flex-1 border border-line bg-card px-4 py-3.5 text-base text-ink sm:px-5 sm:text-lg placeholder:text-graphite focus:border-pink focus:outline-none"
        id="report-lookup"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Look up a report ID…"
        value={value}
      />
      {button === "arrow" ? (
        <button
          aria-label="Open report"
          className="ml-1.5 grid place-items-center bg-pink px-5 text-black transition-colors hover:bg-ink sm:px-6"
          type="submit"
        >
          <ArrowRightIcon className="h-6 w-6" />
        </button>
      ) : (
        <button
          aria-label="Open report"
          className="-ml-px grid place-items-center border border-line bg-card px-5 text-ink hover:bg-mist"
          type="submit"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      )}
    </form>
  );
}
