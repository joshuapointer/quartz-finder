import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-narrow section-y-lg flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow eyebrow-mute">404</p>
      <h1 className="font-display mt-4 text-4xl md:text-5xl">
        Lost in the slits.
      </h1>
      <p className="prose-measure ink-soft mx-auto mt-4 max-w-md text-base">
        That page evaporated like a low-temp dab. Try the catalog instead.
      </p>
      <Link href="/shop" className="btn btn-primary focus-ring mt-8">
        Back to the atlas
      </Link>
    </div>
  );
}
