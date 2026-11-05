/** Two offset squares: a buyer and a seller bound by one check. */
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 32 32">
      <rect fill="#fff" height="18" rx="4" stroke="#000" strokeWidth="2.5" width="18" x="2.5" y="2.5" />
      <rect fill="#000" height="18" rx="4" stroke="#000" strokeWidth="2.5" width="18" x="11.5" y="11.5" />
    </svg>
  );
}
