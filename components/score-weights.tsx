import { checkerLabel } from "@/lib/format";

const order = ["OutputQualityChecker", "ReputationChecker", "PricingBenchmarkChecker", "TaskFitChecker"];
const tones = ["bg-ink", "bg-pen", "bg-ink-soft", "bg-ink-faint"];

/** The four checks drawn to scale by their share of the trust score. */
export function ScoreWeights() {
  return (
    <div>
      <div aria-hidden className="flex h-3 overflow-hidden rounded-full">
        {order.map((key, index) => (
          <div className={tones[index]} key={key} style={{ width: `${checkerLabel[key].weight}%` }} />
        ))}
      </div>
      <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key, index) => (
          <div key={key}>
            <dt className="flex items-center gap-2 font-semibold">
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${tones[index]}`} />
              {checkerLabel[key].name}
              <span className="font-normal tabular-nums text-ink-soft">{checkerLabel[key].weight}%</span>
            </dt>
            <dd className="mt-1 text-sm text-ink-soft">{checkerLabel[key].asks}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
