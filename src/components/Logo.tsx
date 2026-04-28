interface Props {
  className?: string;
  size?: "sm" | "md";
}

export default function Logo({ className = "", size = "sm" }: Props) {
  const dim = size === "md" ? 36 : 28;
  const textCls =
    size === "md"
      ? "font-display text-xl tracking-[0.04em] font-medium ink"
      : "font-display text-lg tracking-[0.04em] font-medium ink";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pp-grad" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c8923a" />
            <stop offset="100%" stopColor="#b8aac4" />
          </linearGradient>
        </defs>
        {/* Pillar — slimmer: 5×22, rx 0.5 */}
        <rect
          x="6"
          y="4"
          width="5"
          height="22"
          rx="0.5"
          stroke="url(#pp-grad)"
          strokeWidth="1.1"
          fill="rgba(232,222,200,0.04)"
        />
        {/* Pearl outer — r=5.5 */}
        <circle
          cx="21"
          cy="15"
          r="5.5"
          stroke="url(#pp-grad)"
          strokeWidth="1.1"
          fill="rgba(232,222,200,0.04)"
        />
        {/* Pearl inner — r=2, filled */}
        <circle cx="21" cy="15" r="2" fill="url(#pp-grad)" />
      </svg>
      <span className={textCls}>
        Pillar{" "}
        <em className="not-italic text-[var(--color-amber)]">&amp;</em>{" "}
        Pearl
      </span>
    </div>
  );
}
