import { checkerLabel } from "@/lib/format";

const order = ["OutputQualityChecker", "ReputationChecker", "PricingBenchmarkChecker", "TaskFitChecker"];
const fills = ["bg-lilac", "hatch bg-mint", "dots bg-butter", "bg-coral"];

/** The four checks drawn to scale by their share of the trust score, then one card each. */
export function ScoreWeights() {
  return (
    <div className="space-y-6">
      <div aria-hidden className="flex h-16 overflow-hidden rounded-[14px] border-[3px] border-ink bg-card shadow-hard">
        {order.map((key, index) => (
          <div
            className={`${fills[index]} flex items-end border-ink p-2 [&:not(:last-child)]:border-r-[3px]`}
            key={key}
            style={{ width: `${checkerLabel[key].weight}%` }}
          >
            <span className="rounded-md border-2 border-ink bg-card px-1.5 font-mono text-xs font-semibold">
              {checkerLabel[key].weight}%
            </span>
          </div>
        ))}
      </div>
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key, index) => (
          <div className="nb-card overflow-hidden" key={key}>
            <div aria-hidden className={`h-12 border-b-[3px] border-ink ${fills[index]}`} />
            <div className="p-5">
              <dt>
                <span className="display block text-4xl tabular-nums">{checkerLabel[key].weight}%</span>
                <span className="mt-2 block text-lg font-extrabold">{checkerLabel[key].name}</span>
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-graphite">{checkerLabel[key].asks}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
