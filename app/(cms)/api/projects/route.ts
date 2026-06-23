import { NextRequest, NextResponse } from "next/server";
import { fetchProjectsThumbnails } from "@/sanity/services/fetchProjects";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const lang = searchParams.get("lang") === "en" ? "en" : "es";
    const start = Number(searchParams.get("start") ?? "0");
    const limit = Number(searchParams.get("limit") ?? "12");
    const orderParam = searchParams.get("order") ?? "asc";
    const order =
      orderParam === "desc" || orderParam === "alphabetical"
        ? orderParam
        : "asc";
    const service = searchParams.get("service") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const end = start + limit;

    if (Number.isNaN(start) || Number.isNaN(limit)) {
      return NextResponse.json({ error: "Invalid start/limit" }, { status: 400 });
    }

    const projects = await fetchProjectsThumbnails(lang, start, end, order, service, tag);

    return NextResponse.json(projects, { status: 200 });
  } catch (err) {
    console.error("[GET /api/projects] ", err);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}
