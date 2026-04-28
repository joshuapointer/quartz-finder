import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "pillar-and-pearl", ts: Date.now() },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
