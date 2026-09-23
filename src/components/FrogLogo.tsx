export function FrogLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <ellipse cx="32" cy="40" rx="22" ry="16" fill="currentColor" />
      <circle cx="19" cy="22" r="10" fill="currentColor" />
      <circle cx="45" cy="22" r="10" fill="currentColor" />
      <circle cx="19" cy="22" r="5" fill="var(--background)" />
      <circle cx="45" cy="22" r="5" fill="var(--background)" />
      <circle cx="20.5" cy="23" r="2.2" fill="currentColor" />
      <circle cx="46.5" cy="23" r="2.2" fill="currentColor" />
      <path
        d="M22 42c3.2 3.6 6.6 5.4 10 5.4s6.8-1.8 10-5.4"
        stroke="var(--background)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
