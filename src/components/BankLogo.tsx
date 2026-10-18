export function BankLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      {/* pediment */}
      <path d="M32 6 6 22h52L32 6Z" fill="currentColor" />
      {/* architrave */}
      <rect x="8" y="25" width="48" height="5" rx="1.5" fill="currentColor" />
      {/* columns */}
      <rect x="12" y="33" width="6" height="18" rx="1.5" fill="currentColor" />
      <rect x="24" y="33" width="6" height="18" rx="1.5" fill="currentColor" />
      <rect x="36" y="33" width="6" height="18" rx="1.5" fill="currentColor" />
      <rect x="48" y="33" width="6" height="18" rx="1.5" fill="currentColor" />
      {/* base */}
      <rect x="8" y="54" width="48" height="5" rx="1.5" fill="currentColor" />
      {/* card mark in pediment */}
      <rect x="27" y="13" width="10" height="6.5" rx="1.2" fill="var(--background)" />
    </svg>
  );
}
