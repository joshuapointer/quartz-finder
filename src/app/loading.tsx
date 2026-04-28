export default function Loading() {
  return (
    <>
      <style>{`
        .loading-ring {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid var(--color-line-strong);
          background: conic-gradient(from 0deg, transparent 0%, var(--color-amber) 70%, transparent 100%);
          -webkit-mask: radial-gradient(circle, transparent 9px, black 10px);
          mask: radial-gradient(circle, transparent 9px, black 10px);
          animation: loading-ring-spin 1200ms linear infinite;
          opacity: 0.6;
          display: block;
        }
        @keyframes loading-ring-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .loading-ring {
            animation: none;
            background: none;
            border-color: var(--color-line);
          }
        }
      `}</style>
      <div className="container-base flex min-h-[40vh] items-center justify-center">
        <div className="ink-mute flex flex-col items-center gap-4">
          <span className="loading-ring" aria-hidden="true" />
          <span className="font-mono text-2xs uppercase tracking-[0.04em]">
            Loading…
          </span>
        </div>
      </div>
    </>
  );
}
