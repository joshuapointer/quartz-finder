import { NextResponse } from "next/server";
import { getAllProducts, getMetadata } from "@/lib/catalog";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return NextResponse.json(
    {
      meta: getMetadata(),
      products: getAllProducts(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    },
  );
}
