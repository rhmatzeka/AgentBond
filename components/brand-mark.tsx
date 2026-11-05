/** Two overlapping coins: a buyer and a seller bound by one check. */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 32 32">
      <circle cx="12" cy="12" fill="var(--color-lilac)" r="9.5" stroke="#000" strokeWidth="1.5" />
      <circle cx="20" cy="20" fill="#000" r="9.5" stroke="#000" strokeWidth="1.5" />
      <path d="M15.8 20.2l3 3 5.6-6" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
