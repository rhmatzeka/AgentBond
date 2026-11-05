/** Two overlapping coins: a buyer and a seller bound by one check. */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 32 32">
      <circle cx="12" cy="12" fill="var(--color-yellow)" r="9.5" stroke="#000" strokeWidth="1.5" />
      <circle cx="20" cy="20" fill="var(--color-pink)" r="9.5" stroke="#000" strokeWidth="1.5" />
      <path d="M15.8 20.2l3 3 5.6-6" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}
