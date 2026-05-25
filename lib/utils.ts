import { format, parseISO, addHours, startOfDay, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import type { Course, GroupedSession } from "./types";
import { BRANCH_BY_ID } from "./constants";

// Germany is UTC+2 in summer (CEST, May–Oct), UTC+1 in winter (CET)
// We dynamically detect the offset for any given date
function getGermanOffset(utcDate: Date): number {
  // CEST runs last Sunday in March → last Sunday in October
  const year = utcDate.getUTCFullYear();

  // Last Sunday in March
  const marchEnd = new Date(Date.UTC(year, 2, 31));
  const dstStart = new Date(
    Date.UTC(year, 2, 31 - ((marchEnd.getUTCDay() + 7) % 7))
  );
  // Last Sunday in October
  const octoberEnd = new Date(Date.UTC(year, 9, 31));
  const dstEnd = new Date(
    Date.UTC(year, 9, 31 - ((octoberEnd.getUTCDay() + 7) % 7))
  );

  return utcDate >= dstStart && utcDate < dstEnd ? 2 : 1;
}

/** Convert a UTC ISO string to the German local Date object */
export function toGermanTime(utcString: string): Date {
  const utcDate = parseISO(utcString);
  const offset = getGermanOffset(utcDate);
  return addHours(utcDate, offset);
}

/** Format "HH:mm" in German local time */
export function formatTime(utcString: string): string {
  return format(toGermanTime(utcString), "HH:mm");
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
    const localDate = toGermanTime(c.startDateTime);
    const key = format(startOfDay(localDate), "yyyy-MM-dd");
    if (!seen.has(key)) seen.set(key, startOfDay(localDate));
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
  // Filter by title and by day (German local time)
  const filtered = courses.filter((c) => {
    if (c.title !== titleFilter) return false;
    const localDate = toGermanTime(c.startDateTime);
    return isSameDay(localDate, day);
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
