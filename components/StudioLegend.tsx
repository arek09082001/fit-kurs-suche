"use client";

import { BRANCHES } from "@/lib/constants";

export default function StudioLegend() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {BRANCHES.map((branch) => (
        <div
          key={branch.id}
          className="flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: branch.colorHex + "22",
            border: `1px solid ${branch.colorHex}55`,
            color: branch.colorHex,
          }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: branch.colorHex }}
          />
          {branch.name}
        </div>
      ))}
    </div>
  );
}
