"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALL_STUDIOS } from "@/lib/studios";
import { useStudioStore } from "@/lib/store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFirstLetter(name: string): string {
  return name.charAt(0).toUpperCase();
}

function groupByLetter(studios: typeof ALL_STUDIOS) {
  const map = new Map<string, typeof ALL_STUDIOS>();
  for (const studio of studios) {
    const letter = getFirstLetter(studio.name);
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(studio);
  }
  return map;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudiosPage() {
  const router = useRouter();
  const { selectedStudioIds, toggleSelected, selectAll, clearAll } = useStudioStore();

  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q
      ? ALL_STUDIOS.filter((s) => s.name.toLowerCase().includes(q))
      : ALL_STUDIOS;
  }, [query]);

  const grouped = useMemo(() => groupByLetter(filtered), [filtered]);
  const letters = useMemo(() => Array.from(grouped.keys()).sort(), [grouped]);

  const selectedSet = useMemo(() => new Set(selectedStudioIds), [selectedStudioIds]);
  const count = selectedStudioIds.length;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors duration-200 shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            <span className="text-sm font-medium">Zurück</span>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <span
              className="tabular-nums text-sm font-bold text-white transition-all duration-300"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {mounted ? count : 0}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {count === 1 ? "Studio" : "Studios"}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-lg mx-auto px-4 pb-4">
          <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-1">
            Studios konfigurieren
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Wähle die Studios, für die Kurse geladen werden sollen.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Studio suchen…"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors duration-150"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Studio List ─────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-36 pt-2">
        {letters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-zinc-400 font-semibold">Kein Studio gefunden</p>
            <p className="text-zinc-600 text-sm mt-1">Versuche einen anderen Suchbegriff.</p>
          </div>
        )}

        {letters.map((letter, letterIdx) => (
          <section key={letter} className="mb-2">
            {/* Letter divider */}
            <div className="sticky top-[170px] z-10 py-1.5 bg-zinc-950">
              <span
                className="text-[11px] font-bold tracking-[0.15em] uppercase"
                style={{ color: "#52525b" }}
              >
                {letter}
              </span>
            </div>

            {/* Studios in this letter group */}
            <div className="rounded-2xl overflow-hidden border border-white/5 divide-y divide-white/5">
              {grouped.get(letter)!.map((studio, i) => {
                const checked = mounted ? selectedSet.has(studio.id) : false;
                const delay = Math.min((letterIdx * 3 + i) * 18, 400);
                return (
                  <button
                    key={studio.id}
                    onClick={() => toggleSelected(studio.id)}
                    className="studio-row w-full flex items-center gap-3 px-4 py-3.5 text-left bg-zinc-900/50 hover:bg-zinc-800/70 active:bg-zinc-800 transition-colors duration-150"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {/* Color dot */}
                    <span
                      className="w-3 h-3 rounded-full shrink-0 transition-transform duration-200"
                      style={{
                        backgroundColor: checked ? studio.colorHex : "#3f3f46",
                        transform: checked ? "scale(1.15)" : "scale(1)",
                      }}
                    />

                    {/* Name */}
                    <span
                      className="flex-1 text-sm font-medium transition-colors duration-150"
                      style={{ color: checked ? "#fafafa" : "#a1a1aa" }}
                    >
                      {studio.name}
                    </span>

                    {/* Custom checkbox */}
                    <span
                      className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor: checked ? studio.colorHex : "transparent",
                        border: checked ? `2px solid ${studio.colorHex}` : "2px solid #52525b",
                        transform: checked ? "scale(1)" : "scale(0.92)",
                      }}
                    >
                      {checked && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* ── Sticky Footer ───────────────────────────────────────────────────── */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => selectAll(ALL_STUDIOS.map((s) => s.id))}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-zinc-800 active:bg-zinc-700"
          >
            Alle
          </button>
          <button
            onClick={() => clearAll()}
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-zinc-800 active:bg-zinc-700"
          >
            Keine
          </button>

          <div className="flex-1" />

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-400 active:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
            style={{ boxShadow: "0 0 20px rgba(239,68,68,0.25)" }}
          >
            Fertig
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .studio-row {
          opacity: 0;
          animation: slide-in-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .studio-row { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
