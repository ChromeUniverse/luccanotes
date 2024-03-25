import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ThemeType = "dark" | "light";

interface ThemeStore {
  theme: ThemeType;
  setTheme: (newTheme: ThemeType) => void;
}

const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: "light",
        setTheme: (newTheme) => set(() => ({ theme: newTheme })),
      }),
      {
        name: "theme-storage",
      }
    )
  )
);

export default useThemeStore;
