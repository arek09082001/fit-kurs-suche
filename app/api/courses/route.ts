import { NextResponse } from "next/server";
import { BRANCHES } from "@/lib/constants";
import type { Course } from "@/lib/types";

export const revalidate = 60; // ISR: re-fetch from FitX every 60 seconds

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

export async function GET() {
  try {
    // Fetch current week (no param) AND next week (?week=1) for every branch in
    // parallel — same latency as before since all 16 requests run concurrently.
    // Together they cover: last week + current week + next week.
    const urls = BRANCHES.flatMap((branch) => [
      `https://www.fitx.de/courses/${branch.id}`,
      `https://www.fitx.de/courses/${branch.id}?week=1`,
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
