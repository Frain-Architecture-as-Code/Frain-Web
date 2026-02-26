import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type {
    ProjectApiKeyCreatedResponse,
    ProjectApiKeyResponse,
} from "@/services/project-api-keys/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

const { api } = await import("@/lib/api");
const { listApiKeys, createApiKey, revokeApiKey } = await import(
    "@/services/project-api-keys/actions"
);

const mockGet = api.get as Mock;
const mockPost = api.post as Mock;
const mockDelete = api.delete as Mock;

const sampleApiKey: ProjectApiKeyResponse = {
    id: "key-1",
    projectId: "project-1",
    memberId: "member-1",
    apiKeySecret: "sk-***",
    lastUsedAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
};

const sampleCreatedKey: ProjectApiKeyCreatedResponse = {
    id: "key-1",
    projectId: "project-1",
    memberId: "member-1",
    apiKeySecret: "sk-full-api-key-visible-once",
    lastUsedAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("listApiKeys", () => {
    it("returns api keys for a project", async () => {
        mockGet.mockResolvedValue({ data: [sampleApiKey] });

        const result = await listApiKeys("org-1", "project-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects/project-1/api-keys",
        );
        expect(result).toEqual([sampleApiKey]);
    });

    it("throws Error with ApiError message", async () => {
        mockGet.mockRejectedValue(
            new ApiError(
                {
                    code: "NOT_FOUND",
                    message: "Project not found",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                404,
            ),
        );

        await expect(listApiKeys("org-1", "project-999")).rejects.toThrow(
            "Project not found",
        );
    });
});

describe("createApiKey", () => {
    it("posts and returns the created api key with full key visible", async () => {
        mockPost.mockResolvedValue({ data: sampleCreatedKey });

        const request = { targetMemberId: "member-1" };
        const result = await createApiKey("org-1", "project-1", request);

        expect(mockPost).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects/project-1/api-keys",
            request,
        );
        expect(result).toEqual(sampleCreatedKey);
        expect(result.apiKeySecret).toBe("sk-full-api-key-visible-once");
    });

    it("throws on failure", async () => {
        mockPost.mockRejectedValue(
            new ApiError(
                {
                    code: "FORBIDDEN",
                    message: "Cannot create key for this member",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                403,
            ),
        );

        await expect(
            createApiKey("org-1", "project-1", {
                targetMemberId: "member-1",
            }),
        ).rejects.toThrow("Cannot create key for this member");
    });
});

describe("revokeApiKey", () => {
    it("deletes the api key", async () => {
        mockDelete.mockResolvedValue({});

        await revokeApiKey("org-1", "project-1", "key-1");

        expect(mockDelete).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/projects/project-1/api-keys/key-1",
        );
    });

    it("throws on failure", async () => {
        mockDelete.mockRejectedValue(
            new ApiError(
                {
                    code: "FORBIDDEN",
                    message: "Only the owner can revoke keys",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                403,
            ),
        );

        await expect(
            revokeApiKey("org-1", "project-1", "key-1"),
        ).rejects.toThrow("Only the owner can revoke keys");
    });

    it("throws generic message for unexpected errors", async () => {
        mockDelete.mockRejectedValue(new Error("timeout"));

        await expect(
            revokeApiKey("org-1", "project-1", "key-1"),
        ).rejects.toThrow("An unexpected error occurred");
    });
});
