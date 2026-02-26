import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type { ProjectResponse } from "@/services/projects/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

const { api } = await import("@/lib/api");
const { getProjects, getProjectById, createProject, updateProject } =
    await import("@/services/projects/actions");

const mockGet = api.get as Mock;
const mockPost = api.post as Mock;
const mockPatch = api.patch as Mock;

const sampleProject: ProjectResponse = {
    projectId: "project-1",
    organizationId: "org-1",
    visibility: "PUBLIC",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getProjects", () => {
    it("returns projects for an organization", async () => {
        mockGet.mockResolvedValue({ data: [sampleProject] });

        const result = await getProjects("org-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects",
        );
        expect(result).toEqual([sampleProject]);
    });

    it("throws Error with ApiError message on failure", async () => {
        mockGet.mockRejectedValue(
            new ApiError(
                {
                    code: "NOT_FOUND",
                    message: "Organization not found",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                404,
            ),
        );

        await expect(getProjects("org-999")).rejects.toThrow(
            "Organization not found",
        );
    });
});

describe("getProjectById", () => {
    it("returns a single project", async () => {
        mockGet.mockResolvedValue({ data: sampleProject });

        const result = await getProjectById("org-1", "project-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects/project-1",
        );
        expect(result).toEqual(sampleProject);
    });
});

describe("createProject", () => {
    it("posts and returns the created project", async () => {
        mockPost.mockResolvedValue({ data: sampleProject });

        const request = { visibility: "PRIVATE" as const };
        const result = await createProject("org-1", request);

        expect(mockPost).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects",
            request,
        );
        expect(result).toEqual(sampleProject);
    });
});

describe("updateProject", () => {
    it("patches and returns the updated project", async () => {
        const updated = { ...sampleProject, visibility: "PRIVATE" };
        mockPatch.mockResolvedValue({ data: updated });

        const request = { visibility: "PRIVATE" as const };
        const result = await updateProject("org-1", "project-1", request);

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects/project-1",
            request,
        );
        expect(result.visibility).toBe("PRIVATE");
    });

    it("throws generic message for unknown errors", async () => {
        mockPatch.mockRejectedValue(new TypeError("fetch failed"));

        await expect(
            updateProject("org-1", "project-1", { visibility: "PUBLIC" }),
        ).rejects.toThrow("An unexpected error occurred");
    });
});
