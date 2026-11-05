/** Two linked rings: a buyer and a seller bound by one check. */
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 32 32">
      <circle cx="12" cy="16" r="8.5" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="20" cy="16" r="8.5" stroke="var(--color-pen)" strokeWidth="2.6" />
    </svg>
  );
}
