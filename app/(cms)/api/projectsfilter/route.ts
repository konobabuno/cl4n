import { NextRequest, NextResponse } from "next/server";
import { fetchSanityProjectsWithFilter } from "@/sanity/services/fetchProjects";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const lang = searchParams.get("lang") === "en" ? "en" : "es";
    const start = Number(searchParams.get("start") ?? "0");
    const limit = Number(searchParams.get("limit") ?? "1");
    const service = searchParams.get("service") ?? "";
    const order = searchParams.get("order") ?? "desc";
    const end = start + limit;

    if (Number.isNaN(start) || Number.isNaN(limit)) {
      return NextResponse.json({ error: "Invalid start/limit" }, { status: 400 });
    }

  const additionalProjects = await fetchSanityProjectsWithFilter(lang, start, end, order, service);

    return NextResponse.json(additionalProjects, { status: 200 });
  } catch (err) {
    console.error("[GET /api/projects] ", err);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}
