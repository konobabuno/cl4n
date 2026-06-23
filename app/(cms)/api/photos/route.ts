import { NextRequest, NextResponse } from "next/server";
import { fetchPhotoPage } from "@/sanity/services/fetchPage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const start = Number(searchParams.get("start") ?? "0");
    const limit = Number(searchParams.get("limit") ?? "12");
    const end = start + limit;

    const photos = await fetchPhotoPage(start, end);

    return NextResponse.json(photos.photos, { status: 200 });
  } catch (err) {
    console.error("[GET /api/photos] ", err);
    return NextResponse.json({ error: "Failed to load photos" }, { status: 500 });
  }
}