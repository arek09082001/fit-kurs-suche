import { NextResponse } from "next/server";
import { BRANCHES } from "@/lib/constants";
import type { Course } from "@/lib/types";

export const revalidate = 60; // ISR: re-fetch from FitX every 60 seconds

export async function GET() {
  try {
    const results = await Promise.all(
      BRANCHES.map(async (branch) => {
        const res = await fetch(
          `https://www.fitx.de/courses/${branch.id}`,
          { next: { revalidate: 60 } }
        );
        if (!res.ok) {
          console.error(`Failed to fetch branch ${branch.id}: ${res.status}`);
          return [] as Course[];
        }
        const json = await res.json() as { payload: Course[] };
        return json.payload ?? [];
      })
    );

    const merged: Course[] = results.flat();
    return NextResponse.json({ courses: merged });
  } catch (err) {
    console.error("Error fetching FitX courses:", err);
    return NextResponse.json(
      { error: "Kurse konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
