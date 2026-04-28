import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getDb } from "../db";
import { fetchWithRetry } from "./http";

const IMAGE_DIR = process.env.PILLARPEARL_IMAGE_DIR ?? "/data/images";

export function imageDir(): string {
  return IMAGE_DIR;
}

export async function cacheImage(srcUrl: string | null): Promise<string | null> {
  if (!srcUrl) return null;
  const safe = normalizeUrl(srcUrl);
  if (!safe) return null;
  const db = getDb();
  const existing = db
    .prepare("SELECT hash, ext FROM images WHERE source_url = ?")
    .get(safe) as { hash: string; ext: string } | undefined;
  if (existing) return existing.hash;

  try {
    const res = await fetchWithRetry(safe, { timeoutMs: 20_000, retries: 1 });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    const ext = pickExt(ct, safe);
    if (!ext) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength === 0 || buf.byteLength > 8 * 1024 * 1024) return null;
    const hash = createHash("sha1").update(buf).digest("hex");
    mkdirSync(IMAGE_DIR, { recursive: true });
    const path = join(IMAGE_DIR, `${hash}.${ext}`);
    if (!existsSync(path)) writeFileSync(path, buf);
    db.prepare(
      `INSERT OR REPLACE INTO images (hash, ext, source_url, bytes) VALUES (?, ?, ?, ?)`,
    ).run(hash, ext, safe, buf.byteLength);
    return hash;
  } catch {
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
    const u = new URL(raw, "https://example.com");
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function pickExt(contentType: string, url: string): string | null {
  const ct = contentType.toLowerCase();
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("avif")) return "avif";
  const m = url.match(/\.(jpe?g|png|webp|gif|avif)(?:\?|$)/i);
  if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  return null;
}
