import { create } from "zustand";

export type CanvasTheme = "dark" | "light";

interface CanvasThemeStore {
    theme: CanvasTheme;
    setTheme: (t: CanvasTheme) => void;
}

/**
 * Global store for the C4 canvas colour theme.
 * Default is always "dark". Updated by ProjectCanvas whenever
 * next-themes resolvedTheme changes.
 */
export const useCanvasThemeStore = create<CanvasThemeStore>((set) => ({
    theme: "dark",
    setTheme: (theme) => set({ theme }),
}));
