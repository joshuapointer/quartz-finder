import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-amber)]">404</p>
      <h1 className="font-display mt-4 text-6xl">Lost in the slits.</h1>
      <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
        That page evaporated like a low-temp dab. Try the catalog instead.
      </p>
      <Link
        href="/shop"
        className="mt-8 rounded-full bg-[var(--color-amber)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)]"
      >
        Back to the atlas
      </Link>
    </div>
  );
}
