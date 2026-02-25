import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum ViewMode {
    List = "list",
    Grid = "grid",
}

type UserPreferencesState = {
    organizationsViewMode: ViewMode;
    projectsViewMode: ViewMode;
    setOrganizationsViewMode: (mode: ViewMode) => void;
    setProjectsViewMode: (mode: ViewMode) => void;
};

export const useUserPreferences = create<UserPreferencesState>()(
    persist(
        (set) => ({
            organizationsViewMode: ViewMode.Grid,
            projectsViewMode: ViewMode.List,
            setOrganizationsViewMode: (mode: ViewMode) =>
                set({ organizationsViewMode: mode }),
            setProjectsViewMode: (mode: ViewMode) =>
                set({ projectsViewMode: mode }),
        }),
        {
            name: "frain-user-preferences",
        },
    ),
);
