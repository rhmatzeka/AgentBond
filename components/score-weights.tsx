import { checkerLabel } from "@/lib/format";

const order = ["OutputQualityChecker", "ReputationChecker", "PricingBenchmarkChecker", "TaskFitChecker"];
const tones = ["bg-pink", "bg-yellow", "bg-teal", "bg-sky"];

/** The four checks drawn to scale by their share of the trust score, then one card each. */
export function ScoreWeights() {
  return (
    <div className="space-y-5">
      <div
        aria-hidden
        className="flex h-11 overflow-hidden rounded-full border border-line sm:h-14"
        data-anim="grow-children"
      >
        {order.map((key, index) => (
          <div
            className={`${tones[index]} flex min-w-0 items-center justify-center border-black text-[13px] text-black sm:justify-start sm:px-5 sm:text-base [&:not(:last-child)]:border-r`}
            key={key}
            style={{ width: `${checkerLabel[key].weight}%` }}
          >
            {checkerLabel[key].weight}%
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" data-anim="pop-children" data-delay="0.3">
        {order.map((key, index) => (
          <div className="nb-card p-5 sm:p-8" key={key}>
            <dt>
              <span className="flex items-center justify-between">
                <span className="display text-4xl tabular-nums sm:text-6xl">{checkerLabel[key].weight}%</span>
                <span
                  aria-hidden
                  className={`h-5 w-5 shrink-0 rounded-full sm:h-8 sm:w-8 border border-black ${tones[index]}`}
                />
              </span>
              <span className="mt-4 block text-lg leading-tight sm:mt-6 sm:text-2xl">{checkerLabel[key].name}</span>
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-graphite sm:text-lg">{checkerLabel[key].asks}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
