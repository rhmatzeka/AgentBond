import { checkerLabel } from "@/lib/format";

const order = ["OutputQualityChecker", "ReputationChecker", "PricingBenchmarkChecker", "TaskFitChecker"];
const tones = ["bg-pink", "bg-yellow", "bg-teal", "bg-sky"];

/** The four checks drawn to scale by their share of the trust score, then one card each. */
export function ScoreWeights() {
  return (
    <div className="space-y-5">
      <div aria-hidden className="flex h-14 overflow-hidden rounded-full border border-line">
        {order.map((key, index) => (
          <div
            className={`${tones[index]} flex items-center border-black px-5 text-black [&:not(:last-child)]:border-r`}
            key={key}
            style={{ width: `${checkerLabel[key].weight}%` }}
          >
            {checkerLabel[key].weight}%
          </div>
        ))}
      </div>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key, index) => (
          <div className="nb-card p-8" key={key}>
            <dt>
              <span className="flex items-center justify-between">
                <span className="display text-6xl tabular-nums">{checkerLabel[key].weight}%</span>
                <span aria-hidden className={`h-8 w-8 rounded-full border border-black ${tones[index]}`} />
              </span>
              <span className="mt-6 block text-2xl">{checkerLabel[key].name}</span>
            </dt>
            <dd className="mt-2 text-lg leading-relaxed text-graphite">{checkerLabel[key].asks}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
