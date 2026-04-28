import { NextResponse } from "next/server";
import { existsSync, statSync, createReadStream } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { getImageMeta } from "@/lib/scraper/images";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const IMAGE_DIR = process.env.PILLARPEARL_IMAGE_DIR ?? "/data/images";
const HASH_RE = /^[a-f0-9]{40}$/;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ hash: string }> },
) {
  const { hash } = await ctx.params;
  if (!HASH_RE.test(hash)) {
    return new NextResponse("invalid hash", { status: 400 });
  }
  const meta = getImageMeta(hash);
  if (!meta) return new NextResponse("not found", { status: 404 });
  const path = join(IMAGE_DIR, `${hash}.${meta.ext}`);
  if (!existsSync(path)) return new NextResponse("not found", { status: 404 });
  const st = statSync(path);
  const stream = Readable.toWeb(createReadStream(path)) as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": MIME[meta.ext] ?? "application/octet-stream",
      "Content-Length": String(st.size),
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
