import { beforeEach, describe, expect, it } from "vitest";
import { useUserPreferences, ViewMode } from "@/stores/user-preferences";

describe("useUserPreferences store", () => {
    beforeEach(() => {
        // Reset store to defaults between tests
        useUserPreferences.setState({
            organizationsViewMode: ViewMode.Grid,
            projectsViewMode: ViewMode.List,
        });
    });

    it("has correct default values", () => {
        const state = useUserPreferences.getState();

        expect(state.organizationsViewMode).toBe(ViewMode.Grid);
        expect(state.projectsViewMode).toBe(ViewMode.List);
    });

    it("updates organizations view mode", () => {
        useUserPreferences.getState().setOrganizationsViewMode(ViewMode.List);

        expect(useUserPreferences.getState().organizationsViewMode).toBe(
            ViewMode.List,
        );
    });

    it("updates projects view mode", () => {
        useUserPreferences.getState().setProjectsViewMode(ViewMode.Grid);

        expect(useUserPreferences.getState().projectsViewMode).toBe(
            ViewMode.Grid,
        );
    });

    it("does not affect other view mode when updating one", () => {
        useUserPreferences.getState().setOrganizationsViewMode(ViewMode.List);

        expect(useUserPreferences.getState().organizationsViewMode).toBe(
            ViewMode.List,
        );
        expect(useUserPreferences.getState().projectsViewMode).toBe(
            ViewMode.List,
        );
    });

    it("can toggle between modes", () => {
        const store = useUserPreferences.getState();

        store.setOrganizationsViewMode(ViewMode.List);
        expect(useUserPreferences.getState().organizationsViewMode).toBe(
            ViewMode.List,
        );

        store.setOrganizationsViewMode(ViewMode.Grid);
        expect(useUserPreferences.getState().organizationsViewMode).toBe(
            ViewMode.Grid,
        );
    });
});

describe("ViewMode enum", () => {
    it("has List value", () => {
        expect(ViewMode.List).toBe("list");
    });

    it("has Grid value", () => {
        expect(ViewMode.Grid).toBe("grid");
    });
});
