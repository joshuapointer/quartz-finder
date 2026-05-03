import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getDb } from "../db";
import { fetchWithRetry } from "./http";

const IMAGE_DIR =
  process.env.PILLARPEARL_IMAGE_DIR ??
  (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build"
    ? "/data/images"
    : "./data/images");

export function imageDir(): string {
  return IMAGE_DIR;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function cacheImage(
  srcUrl: string | null,
): Promise<{ hash: string; cached: boolean } | null> {
  if (!srcUrl) return null;
  const safe = normalizeUrl(srcUrl);
  if (!safe) return null;
  const db = getDb();
  const existing = db
    .prepare("SELECT hash, ext FROM images WHERE source_url = ?")
    .get(safe) as { hash: string; ext: string } | undefined;
  if (existing) return { hash: existing.hash, cached: true };

  try {
    const res = await fetchWithRetry(safe, {
      timeoutMs: 20_000,
      retries: 1,
      maxBytes: MAX_IMAGE_BYTES,
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength === 0 || buf.byteLength > MAX_IMAGE_BYTES) return null;
    const detected = detectExtFromBytes(buf);
    if (!detected) return null;
    const hash = createHash("sha1").update(buf).digest("hex");
    mkdirSync(IMAGE_DIR, { recursive: true });
    const path = join(IMAGE_DIR, `${hash}.${detected}`);
    if (!existsSync(path)) writeFileSync(path, buf);
    db.prepare(
      `INSERT OR REPLACE INTO images (hash, ext, source_url, bytes) VALUES (?, ?, ?, ?)`,
    ).run(hash, detected, safe, buf.byteLength);
    return { hash, cached: false };
  } catch (e) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(`[images] cache failed ${srcUrl}:`, String(e));
    }
    return null;
  }
}

export function getImageMeta(hash: string): { ext: string } | null {
  const db = getDb();
  const row = db.prepare("SELECT ext FROM images WHERE hash = ?").get(hash) as
    | { ext: string }
    | undefined;
  return row ?? null;
}

function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

const IMAGE_MAGIC: Array<[string, number[]]> = [
  ["jpg", [0xff, 0xd8, 0xff]],
  ["png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ["gif", [0x47, 0x49, 0x46, 0x38]],
  ["webp", [0x52, 0x49, 0x46, 0x46]],
  ["avif", [0x00, 0x00, 0x00]],
];

function detectExtFromBytes(buf: Buffer): string | null {
  for (const [ext, sig] of IMAGE_MAGIC) {
    if (sig.every((b, i) => buf[i] === b)) {
      if (ext === "webp") {
        if (buf.slice(8, 12).toString("ascii") !== "WEBP") continue;
      }
      if (ext === "avif") {
        if (buf.slice(4, 12).toString("ascii").indexOf("ftyp") === -1) continue;
      }
      return ext;
    }
  }
  return null;
}

