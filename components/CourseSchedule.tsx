"use client";

import type { GroupedSession } from "@/lib/types";
import SessionCard from "./SessionCard";
import { formatDayLong, capitalize } from "@/lib/utils";

interface CourseScheduleProps {
  sessions: GroupedSession[];
  selectedDay: Date | null;
  selectedTitle: string;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 flex gap-4 items-start bg-zinc-800 border border-zinc-700/50 animate-pulse">
      <div className="flex flex-col items-center min-w-14 gap-2 pt-1">
        <div className="h-7 w-12 bg-zinc-700 rounded-lg" />
        <div className="h-3 w-10 bg-zinc-700 rounded-full" />
        <div className="h-4 w-12 bg-zinc-700 rounded-full" />
      </div>
      <div className="w-px self-stretch bg-zinc-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-20 bg-zinc-700 rounded-full" />
        <div className="h-4 w-32 bg-zinc-700 rounded-full" />
        <div className="h-3 w-24 bg-zinc-700 rounded-full" />
      </div>
    </div>
  );
}

export default function CourseSchedule({
  sessions,
  selectedDay,
  selectedTitle,
  loading = false,
}: CourseScheduleProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!selectedTitle) return null;

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="text-5xl mb-4">&#x1F3CB;&#xFE0F;</div>
        <p className="text-zinc-400 font-medium text-base">
          Kein <span className="text-white font-semibold">{selectedTitle}</span>{" "}
          {selectedDay ? `am ${capitalize(formatDayLong(selectedDay))}` : "an diesem Tag"}
        </p>
        <p className="text-zinc-600 text-sm mt-1">Waehle einen anderen Tag.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionCard
          key={`${session.startDateTime}-${session.branches.map((b) => b.id).join("-")}`}
          session={session}
        />
      ))}
    </div>
  );
}
