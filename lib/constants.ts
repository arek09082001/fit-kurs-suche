import type { Branch } from "./types";

export const BRANCHES: Branch[] = [
  { id: 27,  name: "Gelsenkirchen-Heßler",   color: "blue",   colorHex: "#3B82F6" },
  { id: 111, name: "Gelsenkirchen-Erle",      color: "emerald",colorHex: "#10B981" },
  { id: 90,  name: "Gelsenkirchen-Mitte",     color: "amber",  colorHex: "#F59E0B" },
  { id: 88,  name: "Gladbeck",                color: "violet", colorHex: "#8B5CF6" },
  { id: 125, name: "Herten",                  color: "rose",   colorHex: "#F43F5E" },
  { id: 32,  name: "Bochum-Riemke",           color: "orange", colorHex: "#F97316" },
  { id: 17,  name: "Bochum-Wattenscheid",     color: "cyan",   colorHex: "#06B6D4" },
  { id: 78,  name: "Bottrop",                 color: "pink",   colorHex: "#EC4899" },
];

export const BRANCH_BY_ID: Record<number, Branch> = Object.fromEntries(
  BRANCHES.map((b) => [b.id, b])
);
