import { checkerLabel } from "@/lib/format";

const order = ["OutputQualityChecker", "ReputationChecker", "PricingBenchmarkChecker", "TaskFitChecker"];
const tones = ["bg-lilac", "bg-mint", "bg-sun", "bg-coral"];

/** The four checks drawn to scale by their share of the trust score, then one card each. */
export function ScoreWeights() {
  return (
    <div className="space-y-6">
      <div aria-hidden className="flex h-14 overflow-hidden rounded-full border border-ink bg-card">
        {order.map((key, index) => (
          <div
            className={`${tones[index]} flex items-center border-ink px-4 text-[15px] font-medium [&:not(:last-child)]:border-r`}
            key={key}
            style={{ width: `${checkerLabel[key].weight}%` }}
          >
            {checkerLabel[key].weight}%
          </div>
        ))}
      </div>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key, index) => (
          <div className="nb-card p-7" key={key}>
            <dt>
              <span className="flex items-center justify-between">
                <span className="display text-5xl tabular-nums">{checkerLabel[key].weight}%</span>
                <span aria-hidden className={`h-7 w-7 rounded-full border border-ink ${tones[index]}`} />
              </span>
              <span className="mt-5 block text-xl font-medium">{checkerLabel[key].name}</span>
            </dt>
            <dd className="mt-1.5 leading-relaxed text-graphite">{checkerLabel[key].asks}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
