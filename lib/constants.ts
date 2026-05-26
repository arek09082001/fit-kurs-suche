import type { Branch } from "./types";
import { ALL_STUDIOS, DEFAULT_STUDIO_IDS } from "./studios";

export { DEFAULT_STUDIO_IDS };

/** Runtime branch list – derived from the Zustand store on the client side.
 *  On the server (API route) we build branches from the requested IDs.
 *  This static array is kept only for legacy usage in StudioLegend / utils. */
export const BRANCHES: Branch[] = ALL_STUDIOS.map((s) => ({
  id: s.id,
  name: s.name,
  color: "",
  colorHex: s.colorHex,
}));

export const BRANCH_BY_ID: Record<number, Branch> = Object.fromEntries(
  BRANCHES.map((b) => [b.id, b])
);
