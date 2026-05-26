import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_STUDIO_IDS } from "./studios";

interface StudioStore {
  /** Studio IDs the user has added to their watchlist (used for API fetching) */
  selectedStudioIds: number[];
  /** Studio IDs currently visible on the main page (subset of selectedStudioIds) */
  activeStudioIds: number[];

  toggleSelected: (id: number) => void;
  selectAll: (ids: number[]) => void;
  clearAll: () => void;

  toggleActive: (id: number) => void;
  /** Called after selectedStudioIds changes to reset active list */
  syncActive: () => void;
}

export const useStudioStore = create<StudioStore>()(
  persist(
    (set, get) => ({
      selectedStudioIds: DEFAULT_STUDIO_IDS,
      activeStudioIds: DEFAULT_STUDIO_IDS,

      toggleSelected(id) {
        set((s) => {
          const next = s.selectedStudioIds.includes(id)
            ? s.selectedStudioIds.filter((x) => x !== id)
            : [...s.selectedStudioIds, id];
          // active list stays in sync: remove if deselected, add if newly selected
          const active = next.filter((x) => s.activeStudioIds.includes(x));
          const added = next.filter((x) => !s.selectedStudioIds.includes(x));
          return { selectedStudioIds: next, activeStudioIds: [...active, ...added] };
        });
      },

      selectAll(ids) {
        set({ selectedStudioIds: ids, activeStudioIds: ids });
      },

      clearAll() {
        set({ selectedStudioIds: [], activeStudioIds: [] });
      },

      toggleActive(id) {
        set((s) => ({
          activeStudioIds: s.activeStudioIds.includes(id)
            ? s.activeStudioIds.filter((x) => x !== id)
            : [...s.activeStudioIds, id],
        }));
      },

      syncActive() {
        const { selectedStudioIds, activeStudioIds } = get();
        // Remove IDs that are no longer selected
        set({ activeStudioIds: activeStudioIds.filter((x) => selectedStudioIds.includes(x)) });
      },
    }),
    {
      name: "fitx-studios",
      // Only persist the selection, not the transient active state
      partialize: (s) => ({ selectedStudioIds: s.selectedStudioIds }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore active = selected on first load
          state.activeStudioIds = state.selectedStudioIds;
        }
      },
    }
  )
);
