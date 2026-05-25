"use client";

import { useEffect, useRef } from "react";
import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { formatDayShort, capitalize } from "@/lib/utils";

interface DayPickerProps {
  days: Date[];
  selectedDay: Date | null;
  onSelect: (day: Date) => void;
}

export default function DayPicker({ days, selectedDay, onSelect }: DayPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to the active day on mount / when selectedDay changes
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedDay]);

  if (days.length === 0) return null;

  return (
    <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {days.map((day) => {
        const active =
          selectedDay !== null &&
          format(day, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd");
        const today = isToday(day);

        return (
          <button
            key={format(day, "yyyy-MM-dd")}
            ref={active ? activeRef : null}
            onClick={() => onSelect(day)}
            className={[
              "flex flex-col items-center shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : today
                ? "bg-zinc-700 text-white border border-red-600/50"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
            ].join(" ")}
          >
            <span className="text-xs uppercase tracking-wide opacity-75">
              {format(day, "EEE", { locale: de })}
            </span>
            <span className="text-lg font-bold leading-tight">{format(day, "dd")}</span>
            {today && (
              <span className="text-[10px] uppercase tracking-widest text-red-400 mt-0.5">
                Heute
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
