import { checkerLabel } from "@/lib/format";

const order = ["OutputQualityChecker", "ReputationChecker", "PricingBenchmarkChecker", "TaskFitChecker"];
const fills = ["bg-ink", "hatch", "dots", "bg-card"];

/** The four checks drawn to scale by their share of the trust score. */
export function ScoreWeights() {
  return (
    <div>
      <div aria-hidden className="flex h-14 border-2 border-ink shadow-hard">
        {order.map((key, index) => (
          <div
            className={`${fills[index]} flex items-end border-ink p-2 [&:not(:last-child)]:border-r-2`}
            key={key}
            style={{ width: `${checkerLabel[key].weight}%` }}
          >
            <span className="bg-card px-1 font-mono text-xs font-semibold">{checkerLabel[key].weight}%</span>
          </div>
        ))}
      </div>
      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key, index) => (
          <div key={key}>
            <dt className="flex items-center gap-2.5 font-extrabold">
              <span aria-hidden className={`h-4 w-4 border-2 border-ink ${fills[index]}`} />
              {checkerLabel[key].name}
              <span className="font-mono text-sm font-normal text-graphite">{checkerLabel[key].weight}%</span>
            </dt>
            <dd className="mt-1.5 text-sm text-graphite">{checkerLabel[key].asks}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
