import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_STUDIO_IDS } from "@/lib/studios";
import { STUDIO_BY_ID } from "@/lib/studios";
import type { Course } from "@/lib/types";

// No static ISR – the branch list varies per user request
export const dynamic = "force-dynamic";

/** Fetch one branch URL and return its payload, or [] on failure */
async function fetchBranchUrl(url: string): Promise<Course[]> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    console.error(`Failed to fetch ${url}: ${res.status}`);
    return [];
  }
  const json = await res.json() as { payload: Course[] };
  return json.payload ?? [];
}

export async function GET(request: NextRequest) {
  try {
    // Parse ?branches=27,111,90,... — fall back to default IDs if absent
    const param = request.nextUrl.searchParams.get("branches");
    const branchIds: number[] = param
      ? param
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => Number.isFinite(n) && n > 0 && STUDIO_BY_ID[n] !== undefined)
      : DEFAULT_STUDIO_IDS;

    const ids = branchIds.length > 0 ? branchIds : DEFAULT_STUDIO_IDS;

    // Fetch current week AND next week for every branch in parallel
    const urls = ids.flatMap((id) => [
      `https://www.fitx.de/courses/${id}`,
      `https://www.fitx.de/courses/${id}?week=1`,
    ]);
    const results = await Promise.all(urls.map(fetchBranchUrl));

    // Deduplicate by course id — current-week sessions appear in both fetches
    const seen = new Set<string>();
    const merged: Course[] = [];
    for (const course of results.flat()) {
      if (!seen.has(course.id)) {
        seen.add(course.id);
        merged.push(course);
      }
    }

    return NextResponse.json({ courses: merged });
  } catch (err) {
    console.error("Error fetching FitX courses:", err);
    return NextResponse.json(
      { error: "Kurse konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
