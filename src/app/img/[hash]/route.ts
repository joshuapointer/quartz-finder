import { NextResponse } from "next/server";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";
import { getImageMeta } from "@/lib/scraper/images";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const IMAGE_DIR = resolve(process.env.PILLARPEARL_IMAGE_DIR ?? "/data/images");
const HASH_RE = /^[a-f0-9]{40}$/;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  req: Request,
  ctx: { params: Promise<{ hash: string }> },
) {
  const { hash } = await ctx.params;
  if (!HASH_RE.test(hash)) {
    return new NextResponse("invalid hash", { status: 400 });
  }
  const meta = getImageMeta(hash);
  if (!meta) return new NextResponse("not found", { status: 404 });
  const path = resolve(join(IMAGE_DIR, `${hash}.${meta.ext}`));
  if (!path.startsWith(IMAGE_DIR + "/") && path !== IMAGE_DIR) {
    return new NextResponse("not found", { status: 404 });
  }
  let st;
  try {
    st = await stat(path);
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
  const etag = `"${hash}"`;
  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }
  const stream = Readable.toWeb(createReadStream(path)) as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": MIME[meta.ext] ?? "application/octet-stream",
      "Content-Length": String(st.size),
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      ETag: etag,
    },
  });
}
