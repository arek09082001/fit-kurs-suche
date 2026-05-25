"use client";

import { BRANCHES } from "@/lib/constants";

interface StudioLegendProps {
  activeStudioIds: Set<number>;
  onToggle: (id: number) => void;
}

export default function StudioLegend({ activeStudioIds, onToggle }: StudioLegendProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {BRANCHES.map((branch) => {
        const active = activeStudioIds.has(branch.id);
        return (
          <button
            key={branch.id}
            onClick={() => onToggle(branch.id)}
            className={[
              "flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer select-none",
              active ? "" : "opacity-30",
            ].join(" ")}
            style={{
              backgroundColor: active ? branch.colorHex + "22" : "#27272a",
              border: `1px solid ${active ? branch.colorHex + "55" : "#3f3f46"}`,
              color: active ? branch.colorHex : "#71717a",
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-colors duration-200"
              style={{ backgroundColor: active ? branch.colorHex : "#52525b" }}
            />
            {branch.name}
          </button>
        );
      })}
    </div>
  );
}
