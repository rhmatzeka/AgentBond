"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnchorPanel } from "@/components/anchor-panel";
import { ReportSlip } from "@/components/report-slip";
import { formatUsdc } from "@/lib/format";
import type { SellerAgent, TaskType } from "@/lib/types/agent";
import type { RiskReport } from "@/lib/types/report";

const taskTypes: TaskType[] = ["research", "summary", "code_review", "data_extraction"];
const defaultTask = "Find 5 sources about Base ecosystem growth";

const fieldClass =
  "w-full rounded-md border border-rule bg-sheet px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors hover:border-ink-faint focus:border-pen focus:outline-none focus:ring-2 focus:ring-pen/20";

export function CheckForm({ sellers }: { sellers: SellerAgent[] }) {
  const [seller, setSeller] = useState(sellers[0]);
  const [taskType, setTaskType] = useState<TaskType>(sellers[0].taskTypes[0]);
  const [price, setPrice] = useState(String(sellers[0].defaultPriceUsdc));
  const [task, setTask] = useState(defaultTask);
  const [output, setOutput] = useState(sellers[0].sampleOutput);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const resultRef = useRef<HTMLDivElement>(null);

  // On narrow screens the slip prints below the form, so bring it into view.
  useEffect(() => {
    const result = resultRef.current;
    if (!report || !result || result.getBoundingClientRect().top < window.innerHeight) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    result.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }, [report]);

  function pickSeller(next: SellerAgent) {
    setSeller(next);
    setTaskType(next.taskTypes[0]);
    setPrice(String(next.defaultPriceUsdc));
    setOutput(next.sampleOutput);
    setError(null);
  }

  function runCheck(event: React.FormEvent) {
    event.preventDefault();
    const proposedPriceUsdc = Number(price);
    if (price.trim() === "" || !Number.isFinite(proposedPriceUsdc) || proposedPriceUsdc < 0) {
      setError("Enter the quoted price as a number of USDC, for example 2.5.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/risk-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sellerAgentId: seller.id,
            taskType,
            proposedPriceUsdc,
            sampleTask: task,
            sampleOutput: output,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || "The check failed. Try again.");
          return;
        }
        setReport(payload.report);
      } catch {
        setError("Could not reach the AgentBond server. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14">
      <form className="space-y-8" onSubmit={runCheck}>
        <fieldset>
          <legend className="text-lg font-semibold">Who is selling?</legend>
          <p className="mt-1 text-sm text-ink-soft">Four demo sellers with very different track records.</p>
          <div className="mt-4 divide-y divide-rule/70 overflow-hidden rounded-lg border border-rule bg-sheet">
            {sellers.map((item) => {
              const total = item.completedJobs + item.failedJobs;
              return (
                <label
                  className="flex cursor-pointer items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-paper/60 has-[:checked]:bg-pen/[0.06]"
                  key={item.id}
                >
                  <input
                    checked={item.id === seller.id}
                    className="mt-1.5 accent-pen"
                    name="seller"
                    onChange={() => pickSeller(item)}
                    type="radio"
                    value={item.id}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold">{item.name}</span>
                      <span className="whitespace-nowrap text-sm tabular-nums text-ink-soft">
                        asks {formatUsdc(item.defaultPriceUsdc)}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{item.description}</span>
                    <span className="mt-1 block text-xs tabular-nums text-ink-faint">
                      {item.completedJobs} of {total} jobs done, {item.uniqueBuyers}{" "}
                      {item.uniqueBuyers === 1 ? "buyer" : "buyers"}, rated {item.averageRating} of 5
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Task type</span>
            <select
              className={fieldClass}
              onChange={(event) => setTaskType(event.target.value as TaskType)}
              value={taskType}
            >
              {taskTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                  {seller.taskTypes.includes(type) ? "" : " (not their specialty)"}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Quoted price in USDC</span>
            <input
              className={`${fieldClass} tabular-nums`}
              inputMode="decimal"
              min={0}
              onChange={(event) => setPrice(event.target.value)}
              step="0.1"
              type="number"
              value={price}
            />
          </label>
        </div>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium">What your agent asked for</span>
          <input
            className={fieldClass}
            maxLength={500}
            onChange={(event) => setTask(event.target.value)}
            value={task}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Sample of the seller&apos;s work</span>
          <textarea
            className={`${fieldClass} min-h-28 leading-relaxed`}
            maxLength={10_000}
            onChange={(event) => setOutput(event.target.value)}
            rows={4}
            value={output}
          />
          <span className="text-xs text-ink-faint">
            Paste any output. It is graded on its text, not on who wrote it.
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button
            className="rounded-md bg-pen px-6 py-3 font-semibold text-sheet shadow-[0_6px_16px_-8px_var(--color-pen)] transition-colors hover:bg-pen-deep disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Checking the seller…" : "Run credit check"}
          </button>
          {error && (
            <p className="text-sm text-avoid" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>

      <div aria-live="polite" className="scroll-mt-4" ref={resultRef}>
        {report ? (
          <div className="space-y-3">
            <ReportSlip animateStamp key={report.reportId} report={report}>
              <AnchorPanel key={report.reportId} onAnchored={setReport} report={report} />
            </ReportSlip>
            <Link className="block text-right text-sm text-pen hover:underline" href={`/reports/${report.reportId}`}>
              Open the shareable report
            </Link>
          </div>
        ) : (
          <div className="grid min-h-56 place-items-center lg:min-h-[28rem] rounded-lg border-2 border-dashed border-rule px-8 text-center">
            <div>
              <p className="font-semibold">{isPending ? "Grading the sample…" : "No report yet"}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {isPending
                  ? "Quality, price, reputation and task fit are being scored."
                  : "Pick a seller and run a check. The report prints here."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
