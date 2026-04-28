export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pp-grad" x1="0" y1="0" x2="30" y2="30">
            <stop offset="0%" stopColor="#f0c270" />
            <stop offset="100%" stopColor="#b86a7d" />
          </linearGradient>
        </defs>
        <rect
          x="6"
          y="3"
          width="6"
          height="24"
          rx="1"
          stroke="url(#pp-grad)"
          strokeWidth="1.4"
          fill="rgba(240, 194, 112, 0.06)"
        />
        <circle
          cx="21"
          cy="15"
          r="6"
          stroke="url(#pp-grad)"
          strokeWidth="1.4"
          fill="rgba(184, 106, 125, 0.08)"
        />
        <circle cx="21" cy="15" r="2.4" fill="url(#pp-grad)" />
      </svg>
      <span className="font-display text-xl tracking-wide">
        Pillar <span className="text-[var(--color-amber)]">&amp;</span> Pearl
      </span>
    </div>
  );
}
