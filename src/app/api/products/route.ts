import { NextResponse } from "next/server";
import { getAllProducts, getMetadata } from "@/lib/catalog";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return NextResponse.json(
    {
      meta: getMetadata(),
      products: getAllProducts(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    },
  );
}
