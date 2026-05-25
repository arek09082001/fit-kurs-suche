"use client";

import { formatTime } from "@/lib/utils";
import type { GroupedSession } from "@/lib/types";

interface SessionCardProps {
  session: GroupedSession;
  onStudioClick?: (branchId: number) => void;
}

export default function SessionCard({ session, onStudioClick }: SessionCardProps) {
  const startTime = formatTime(session.startDateTime);
  const endTime = formatTime(session.endDateTime);
  const isCancelled = session.cancelled;
  const isSpecial = session.special;
  const courseByBranchId = new Map<number, (typeof session.courses)[number]>();
  for (const c of session.courses) {
    if (!courseByBranchId.has(c.branchId)) {
      courseByBranchId.set(c.branchId, c);
    }
  }

  return (
    <div
      className={[
        "relative rounded-2xl p-4 flex gap-4 items-start transition-all duration-200",
        isCancelled
          ? "bg-zinc-900 border border-zinc-800 opacity-60"
          : "bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600",
      ].join(" ")}
    >
      {/* Left — Time block */}
      <div className="flex flex-col items-center min-w-14 pt-0.5">
        <span
          className={[
            "text-2xl font-bold tabular-nums leading-none",
            isCancelled ? "text-zinc-500 line-through" : "text-white",
          ].join(" ")}
        >
          {startTime}
        </span>
        <span className="text-xs text-zinc-500 mt-1">{endTime}</span>
        <span className="text-xs text-zinc-500 mt-1 bg-zinc-700/50 rounded-full px-2 py-0.5 whitespace-nowrap">
          {session.duration} min
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-px self-stretch shrink-0 rounded-full"
        style={{
          background:
            session.branches.length === 1
              ? session.branches[0].colorHex
              : "linear-gradient(to bottom, " +
                session.branches.map((b) => b.colorHex).join(", ") +
                ")",
        }}
      />

      {/* Right — Info */}
      <div className="flex-1 min-w-0">
        {/* Status badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {isCancelled && (
            <span className="text-[11px] font-semibold uppercase tracking-wide bg-red-900/50 text-red-400 border border-red-700/50 rounded-full px-2.5 py-0.5">
              Abgesagt
            </span>
          )}
          {isSpecial && !isCancelled && (
            <span className="text-[11px] font-semibold uppercase tracking-wide bg-amber-900/40 text-amber-400 border border-amber-700/50 rounded-full px-2.5 py-0.5">
              ✦ Special
            </span>
          )}
        </div>

        {/* Studio badges */}
        <div className="flex flex-wrap gap-1.5">
          {session.branches.map((branch) => {
            const branchCourse = courseByBranchId.get(branch.id);
            const showAvailability =
              !!branchCourse?.bookable &&
              branchCourse.availableParticipants !== null &&
              !isCancelled;

            return (
              <button
                key={branch.id}
                onClick={onStudioClick ? () => onStudioClick(branch.id) : undefined}
                className={[
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150",
                  onStudioClick
                    ? "cursor-pointer active:scale-95 hover:brightness-125"
                    : "cursor-default",
                ].join(" ")}
                style={{
                  backgroundColor: branch.colorHex + "20",
                  border: `1px solid ${branch.colorHex}50`,
                  color: branch.colorHex,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: branch.colorHex }}
                />
                {branch.name}
                {showAvailability && (
                  <span className="ml-1 rounded-full border border-emerald-600/50 bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {branchCourse.availableParticipants}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Room */}
        {session.location && (
          <p className="text-xs text-zinc-500 mt-2 truncate">
            📍 {session.location}
          </p>
        )}
      </div>
    </div>
  );
}
