import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Course, GroupedSession } from "./types";
import { BRANCH_BY_ID } from "./constants";

const BERLIN_TZ = "Europe/Berlin";

/**
 * Returns the calendar date in Europe/Berlin as an ISO date string "yyyy-MM-dd".
 * Accepts a UTC ISO string or a Date object.
 */
function getGermanDayKey(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN_TZ }).format(date);
}

/** Format "HH:mm" in Europe/Berlin time (handles CEST/CET automatically) */
export function formatTime(utcString: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: BERLIN_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(utcString));
}

/** Format "EEE, dd.MM." (e.g. "Mo, 26.05.") in German */
export function formatDayShort(date: Date): string {
  return format(date, "EEE, dd.MM.", { locale: de });
}

/** Format "EEEE, dd. MMMM" (e.g. "Montag, 26. Mai") in German */
export function formatDayLong(date: Date): string {
  return format(date, "EEEE, dd. MMMM", { locale: de });
}

/** Capitalise first letter */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Extract all unique course titles from a flat list, sorted alphabetically */
export function extractUniqueTitles(courses: Course[]): string[] {
  const set = new Set<string>();
  for (const c of courses) set.add(c.title);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "de"));
}

/**
 * Get all distinct days (as German-local Date objects, start-of-day)
 * that appear in the course list, sorted ascending.
 */
export function extractWeekDays(courses: Course[]): Date[] {
  const seen = new Map<string, Date>();
  for (const c of courses) {
    const key = getGermanDayKey(c.startDateTime); // "yyyy-MM-dd"
    if (!seen.has(key)) {
      // Store as noon UTC so date-fns format() always shows the correct day
      // regardless of whether the runtime is in UTC or a European timezone
      seen.set(key, new Date(`${key}T12:00:00Z`));
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Filter courses by title and group into GroupedSessions for a given day.
 * Sessions that start at the same UTC time are merged into one card
 * showing all offering studios.
 */
export function groupSessionsForDay(
  courses: Course[],
  titleFilter: string,
  day: Date
): GroupedSession[] {
  // Filter by title and by day (Europe/Berlin calendar date)
  const dayKey = getGermanDayKey(day);
  const filtered = courses.filter((c) => {
    if (c.title !== titleFilter) return false;
    return getGermanDayKey(c.startDateTime) === dayKey;
  });

  // Group by exact startDateTime (UTC canonical)
  const byStart = new Map<string, Course[]>();
  for (const c of filtered) {
    const key = c.startDateTime;
    if (!byStart.has(key)) byStart.set(key, []);
    byStart.get(key)!.push(c);
  }

  const sessions: GroupedSession[] = Array.from(byStart.entries()).map(
    ([_key, group]) => {
      // Merge: pick first course's metadata, collect all branches
      const first = group[0];
      const branches = group
        .map((c) => BRANCH_BY_ID[c.branchId])
        .filter(Boolean);
      return {
        title: first.title,
        startDateTime: first.startDateTime,
        endDateTime: first.endDateTime,
        duration: first.duration,
        location: first.location,
        special: first.isSpecial,
        cancelled: first.isCancelled,
        branches,
        courses: group,
      };
    }
  );

  // Sort by start time ascending
  return sessions.sort(
    (a, b) =>
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );
}

/** Count how many unique branch IDs offer a course in the full week */
export function countStudiosForTitle(courses: Course[], title: string): number {
  const ids = new Set<number>();
  for (const c of courses) {
    if (c.title === title) ids.add(c.branchId);
  }
  return ids.size;
}

/** Count total sessions for a title across the full week */
export function countSessionsForTitle(courses: Course[], title: string): number {
  return courses.filter((c) => c.title === title).length;
}

/**
 * Returns all courses for a specific branch on a given day, sorted by start time.
 * Used by the studio-day popup to show the full day programme of one studio.
 */
export function getStudioDayCourses(
  courses: Course[],
  branchId: number,
  day: Date
): Course[] {
  const dayKey = getGermanDayKey(day);
  return courses
    .filter(
      (c) =>
        c.branchId === branchId &&
        getGermanDayKey(c.startDateTime) === dayKey
    )
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );
}

/**
 * Returns a map of dayKey ("yyyy-MM-dd" Berlin time) → number of distinct
 * session slots for a given title on that day.
 * Multiple studios at the same start time count as ONE slot.
 */
export function countSessionsPerDay(
  courses: Course[],
  title: string
): Record<string, number> {
  const counts: Record<string, number> = {};
  const seenSlots = new Set<string>();
  for (const c of courses) {
    if (c.title !== title) continue;
    const dayKey = getGermanDayKey(c.startDateTime);
    const slotKey = `${dayKey}|${c.startDateTime}`;
    if (!seenSlots.has(slotKey)) {
      seenSlots.add(slotKey);
      counts[dayKey] = (counts[dayKey] ?? 0) + 1;
    }
  }
  return counts;
}
