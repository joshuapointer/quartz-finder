export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-7xl items-center justify-center px-6">
      <div className="flex items-center gap-3 text-[var(--color-ink-mute)]">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-amber)]"
          aria-hidden="true"
        />
        <span className="text-xs uppercase tracking-[0.3em]">Loading…</span>
      </div>
    </div>
  );
}
