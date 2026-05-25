"use client";

import { useEffect } from "react";
import type { Branch, Course } from "@/lib/types";
import { formatTime, formatDayLong, capitalize, getStudioDayCourses } from "@/lib/utils";

interface StudioDayModalProps {
  branch: Branch;
  day: Date;
  courses: Course[];
  selectedTitle?: string;
  onClose: () => void;
}

export default function StudioDayModal({
  branch,
  day,
  courses,
  selectedTitle,
  onClose,
}: StudioDayModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const dayCourses = getStudioDayCourses(courses, branch.id, day);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="relative bg-zinc-900 rounded-t-3xl max-h-[82dvh] flex flex-col animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: branch.colorHex }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-lg leading-tight truncate">
                {branch.name}
              </p>
              <p className="text-sm text-zinc-400 mt-0.5">
                {capitalize(formatDayLong(day))}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1.5 -mr-1 shrink-0 text-lg leading-none"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2.5">
            {dayCourses.length === 0
              ? "Keine Kurse"
              : `${dayCourses.length} Einheit${dayCourses.length !== 1 ? "en" : ""}`}
          </p>
        </div>

        {/* Course list */}
        <div className="overflow-y-auto overscroll-contain flex-1">
          {dayCourses.length === 0 ? (
            <div className="py-14 text-center text-zinc-500 text-sm">
              Keine Kurse an diesem Tag
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {dayCourses.map((course) => {
                const isSelected = selectedTitle === course.title;
                return (
                <div
                  key={course.id}
                  className={[
                    "px-5 py-3.5 flex items-center gap-4 transition-colors",
                    isSelected ? "bg-zinc-800" : "",
                  ].join(" ")}
                >
                  {/* Time */}
                  <div className="shrink-0 w-14 text-right">
                    <span
                      className={[
                        "font-bold tabular-nums text-sm",
                        course.isCancelled ? "text-zinc-600 line-through" : "text-white",
                      ].join(" ")}
                    >
                      {formatTime(course.startDateTime)}
                    </span>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {formatTime(course.endDateTime)}
                    </p>
                  </div>

                  {/* Colour line */}
                  <div
                    className="w-px self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: isSelected ? branch.colorHex : branch.colorHex + "70" }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={[
                        "text-sm font-semibold truncate",
                        course.isCancelled
                          ? "line-through text-zinc-500"
                          : isSelected
                          ? "text-white"
                          : "text-zinc-300",
                      ].join(" ")}
                    >
                      {course.title}
                      {isSelected && (
                        <span
                          className="ml-2 text-[10px] font-bold uppercase tracking-wide rounded-full px-1.5 py-0.5"
                          style={{ backgroundColor: branch.colorHex + "30", color: branch.colorHex }}
                        >
                          Ausgewählt
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-zinc-500 text-xs">{course.duration} min</span>
                      {course.isCancelled && (
                        <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wide">
                          Abgesagt
                        </span>
                      )}
                      {course.bookable && !course.isCancelled && (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          Buchbar
                          {course.availableParticipants !== null
                            ? ` · ${course.availableParticipants} Plätze`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
          {/* Safe-area spacer */}
          <div className="h-6 shrink-0" />
        </div>
      </div>
    </div>
  );
}
