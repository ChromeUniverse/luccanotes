import { type Tag } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ThemeType = "dark" | "light";

// Sort fields
const sortFieldLabels = {
  title: "Title",
  createdAt: "Creation Date",
  lastUpdated: "Last Updated",
} as const;
type SortField = keyof typeof sortFieldLabels;

interface ThemeStore {
  // search input
  searchInput: string;
  setSearchInput: (newSearchInput: string) => void;
  // sort field
  sortField: SortField;
  setSortField: (newSortField: SortField) => void;
  // sort order
  sortOrder: "asc" | "desc";
  setSortOrder: (newSortOrder: "asc" | "desc") => void;
  // selected tags
  selectedTagIds: string[];
  toggleSelectedTag: (tagId: string) => void;
}

const useSearchStore = create<ThemeStore>()(
  devtools(
    (set) => ({
      // search input
      searchInput: "",
      setSearchInput: (newSearchInput) => set({ searchInput: newSearchInput }),
      // sort field
      sortField: "lastUpdated",
      setSortField: (newSortField) => set({ sortField: newSortField }),
      // sort order
      sortOrder: "desc",
      setSortOrder: (newSortOrder) => set({ sortOrder: newSortOrder }),
      // selected tags
      selectedTagIds: [],
      toggleSelectedTag: (tagId) =>
        set((state) => {
          const newSelectedTags = state.selectedTagIds.includes(tagId)
            ? state.selectedTagIds.filter((id) => id !== tagId)
            : [...state.selectedTagIds, tagId];
          return { selectedTagIds: newSelectedTags };
        }),
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useSearchStore;
