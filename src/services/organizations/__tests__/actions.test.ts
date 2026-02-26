import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type { OrganizationResponse } from "@/services/organizations/types";
import { OrganizationVisibility } from "@/services/organizations/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

// Import after mocking
const { api } = await import("@/lib/api");
const {
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
} = await import("@/services/organizations/actions");

const mockGet = api.get as Mock;
const mockPost = api.post as Mock;
const mockPatch = api.patch as Mock;
const mockDelete = api.delete as Mock;

const sampleOrg: OrganizationResponse = {
    organizationId: "org-1",
    ownerMemberId: "member-1",
    name: "Test Org",
    visibility: OrganizationVisibility.PUBLIC,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getOrganizations", () => {
    it("returns array of organizations on success", async () => {
        mockGet.mockResolvedValue({ data: [sampleOrg] });

        const result = await getOrganizations();

        expect(mockGet).toHaveBeenCalledWith("/api/v1/organizations");
        expect(result).toEqual([sampleOrg]);
    });

    it("throws Error with ApiError message on API failure", async () => {
        mockGet.mockRejectedValue(
            new ApiError(
                {
                    code: "UNAUTHORIZED",
                    message: "Not authenticated",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                401,
            ),
        );

        await expect(getOrganizations()).rejects.toThrow("Not authenticated");
    });

    it("throws generic message for non-ApiError failures", async () => {
        mockGet.mockRejectedValue(new Error("Network failure"));

        await expect(getOrganizations()).rejects.toThrow(
            "An unexpected error occurred",
        );
    });
});

describe("getOrganizationById", () => {
    it("returns a single organization on success", async () => {
        mockGet.mockResolvedValue({ data: sampleOrg });

        const result = await getOrganizationById("org-1");

        expect(mockGet).toHaveBeenCalledWith("/api/v1/organizations/org-1");
        expect(result).toEqual(sampleOrg);
    });

    it("throws on failure", async () => {
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

        await expect(getOrganizationById("org-999")).rejects.toThrow(
            "Organization not found",
        );
    });
});

describe("createOrganization", () => {
    it("posts and returns the created organization", async () => {
        mockPost.mockResolvedValue({ data: sampleOrg });

        const request = {
            name: "Test Org",
            visibility: OrganizationVisibility.PUBLIC,
        };
        const result = await createOrganization(request);

        expect(mockPost).toHaveBeenCalledWith("/api/v1/organizations", request);
        expect(result).toEqual(sampleOrg);
    });

    it("throws on failure", async () => {
        mockPost.mockRejectedValue(
            new ApiError(
                {
                    code: "VALIDATION_ERROR",
                    message: "Name is required",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                400,
            ),
        );

        await expect(createOrganization({ name: "" })).rejects.toThrow(
            "Name is required",
        );
    });
});

describe("updateOrganization", () => {
    it("patches and returns the updated organization", async () => {
        const updated = { ...sampleOrg, name: "Updated Org" };
        mockPatch.mockResolvedValue({ data: updated });

        const request = { name: "Updated Org" };
        const result = await updateOrganization("org-1", request);

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1",
            request,
        );
        expect(result.name).toBe("Updated Org");
    });
});

describe("deleteOrganization", () => {
    it("deletes and returns confirmation", async () => {
        mockDelete.mockResolvedValue({ data: { value: "org-1" } });

        const result = await deleteOrganization("org-1");

        expect(mockDelete).toHaveBeenCalledWith("/api/v1/organizations/org-1");
        expect(result).toEqual({ value: "org-1" });
    });

    it("throws on failure", async () => {
        mockDelete.mockRejectedValue(
            new ApiError(
                {
                    code: "FORBIDDEN",
                    message: "Only the owner can delete",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                403,
            ),
        );

        await expect(deleteOrganization("org-1")).rejects.toThrow(
            "Only the owner can delete",
        );
    });
});
