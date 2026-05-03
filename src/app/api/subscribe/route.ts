import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;

function ensureTable(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      email TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
    );
  `);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const email =
    body && typeof body === "object" && "email" in body
      ? String((body as { email: unknown }).email ?? "")
          .trim()
          .toLowerCase()
      : "";
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  ensureTable();
  const db = getDb();
  db.prepare(
    "INSERT OR IGNORE INTO subscribers (email) VALUES (?)",
  ).run(email);
  return NextResponse.json({ ok: true }, { status: 202 });
}
