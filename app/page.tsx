"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { isToday } from "date-fns";

import CourseSelector from "@/components/CourseSelector";
import DayPicker from "@/components/DayPicker";
import CourseSchedule from "@/components/CourseSchedule";
import StudioLegend from "@/components/StudioLegend";

import type { Course } from "@/lib/types";
import {
  extractUniqueTitles,
  extractWeekDays,
  groupSessionsForDay,
  countSessionsForTitle,
  countStudiosForTitle,
} from "@/lib/utils";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("API Fehler");
    return res.json();
  });

export default function HomePage() {
  const { data, error, isLoading } = useSWR<{ courses: Course[] }>(
    "/api/courses",
    fetcher,
    { revalidateOnFocus: false }
  );

  const courses: Course[] = data?.courses ?? [];

  const titles = useMemo(() => extractUniqueTitles(courses), [courses]);
  const days = useMemo(() => extractWeekDays(courses), [courses]);

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    if (days.length === 0 || selectedDay !== null) return;
    const today = days.find((d) => isToday(d));
    setSelectedDay(today ?? days[0]);
  }, [days, selectedDay]);

  const sessions = useMemo(() => {
    if (!selectedTitle || !selectedDay) return [];
    return groupSessionsForDay(courses, selectedTitle, selectedDay);
  }, [courses, selectedTitle, selectedDay]);

  const totalSessions = useMemo(
    () => (selectedTitle ? countSessionsForTitle(courses, selectedTitle) : 0),
    [courses, selectedTitle]
  );
  const totalStudios = useMemo(
    () => (selectedTitle ? countStudiosForTitle(courses, selectedTitle) : 0),
    [courses, selectedTitle]
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl font-black leading-none">FIT</span>
            <span className="text-white text-xl font-black leading-none">X</span>
          </div>
          <div className="h-5 w-px bg-zinc-700" />
          <h1 className="text-sm font-semibold text-zinc-300 tracking-wide">Kurs-Finder</h1>
          {isLoading && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" />
              Laden…
            </div>
          )}
          {error && (
            <div className="ml-auto text-xs text-red-400 font-medium">⚠ Ladefehler</div>
          )}
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-10 space-y-5 pt-5">
        <CourseSelector
          titles={titles}
          selected={selectedTitle}
          onChange={setSelectedTitle}
          loading={isLoading}
        />

        {selectedTitle && !isLoading && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-full px-3 py-1.5">
              <span className="text-red-400 font-semibold">{totalSessions}</span>
              <span>Termine diese Woche in</span>
              <span className="text-white font-semibold">{totalStudios}</span>
              <span>{totalStudios === 1 ? "Studio" : "Studios"}</span>
            </span>
          </div>
        )}

        {selectedTitle && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-2 font-medium">Studios</p>
            <StudioLegend />
          </div>
        )}

        {selectedTitle && days.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-2 font-medium">Woche</p>
            <DayPicker days={days} selectedDay={selectedDay} onSelect={setSelectedDay} />
          </div>
        )}

        {selectedTitle && selectedDay && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-3 font-medium">Termine</p>
            <CourseSchedule
              sessions={sessions}
              selectedDay={selectedDay}
              selectedTitle={selectedTitle}
              loading={isLoading}
            />
          </div>
        )}

        {!isLoading && !selectedTitle && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-4xl mb-5">
              🏋️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Finde deinen Kurs</h2>
            <p className="text-zinc-500 text-sm max-w-xs">
              Wähle einen Kurs aus und sieh sofort, in welchen Studios und zu welchen Zeiten er diese Woche stattfindet.
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-zinc-300 font-semibold">Fehler beim Laden</p>
            <p className="text-zinc-500 text-sm mt-1">Kurse konnten nicht abgerufen werden. Bitte versuche es erneut.</p>
          </div>
        )}
      </main>
    </div>
  );
}
