export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="qf-grad" x1="0" y1="0" x2="28" y2="28">
            <stop offset="0%" stopColor="#f0c270" />
            <stop offset="100%" stopColor="#b86a7d" />
          </linearGradient>
        </defs>
        <path
          d="M14 2 L26 9 V19 L14 26 L2 19 V9 Z"
          stroke="url(#qf-grad)"
          strokeWidth="1.6"
          fill="rgba(240, 194, 112, 0.06)"
        />
        <circle cx="14" cy="14" r="3.5" fill="url(#qf-grad)" />
      </svg>
      <span className="font-display text-xl tracking-wide">
        Quartz <span className="text-[var(--color-amber)]">Finder</span>
      </span>
    </div>
  );
}
