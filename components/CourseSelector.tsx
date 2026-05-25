"use client";

interface CourseSelectorProps {
  titles: string[];
  selected: string;
  onChange: (title: string) => void;
  loading: boolean;
}

export default function CourseSelector({
  titles,
  selected,
  onChange,
  loading,
}: CourseSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className={[
          "w-full appearance-none rounded-2xl px-5 py-4 pr-12",
          "bg-zinc-800 border border-zinc-700 text-white text-base font-medium",
          "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200",
        ].join(" ")}
      >
        <option value="">
          {loading ? "Kurse werden geladen…" : "Kurs auswählen…"}
        </option>
        {titles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
