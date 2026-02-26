import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type { MemberResponse } from "@/services/members/types";
import { MemberRole } from "@/services/members/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

const { api } = await import("@/lib/api");
const { getMembers, updateMember, kickMember } =
    await import("@/services/members/actions");

const mockGet = api.get as Mock;
const mockPatch = api.patch as Mock;
const mockDelete = api.delete as Mock;

const sampleMember: MemberResponse = {
    memberId: "member-1",
    userId: "user-1",
    organizationId: "org-1",
    memberName: "Jane Doe",
    memberRole: "CONTRIBUTOR",
    picture: "https://example.com/avatar.png",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getMembers", () => {
    it("returns members for an organization", async () => {
        mockGet.mockResolvedValue({ data: [sampleMember] });

        const result = await getMembers("org-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/members",
        );
        expect(result).toEqual([sampleMember]);
    });

    it("throws Error with ApiError message", async () => {
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

        await expect(getMembers("org-999")).rejects.toThrow(
            "Organization not found",
        );
    });
});

describe("updateMember", () => {
    it("patches and returns the updated member", async () => {
        const updated = { ...sampleMember, memberName: "Updated Name" };
        mockPatch.mockResolvedValue({ data: updated });

        const request = { newName: "Updated Name" };
        const result = await updateMember("org-1", "member-1", request);

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/members/member-1",
            request,
        );
        expect(result.memberName).toBe("Updated Name");
    });

    it("can update member role", async () => {
        const updated = { ...sampleMember, memberRole: "ADMIN" };
        mockPatch.mockResolvedValue({ data: updated });

        const request = { newRole: MemberRole.ADMIN };
        const result = await updateMember("org-1", "member-1", request);

        expect(result.memberRole).toBe("ADMIN");
    });
});

describe("kickMember", () => {
    it("deletes and returns confirmation", async () => {
        mockDelete.mockResolvedValue({ data: { value: "member-1" } });

        const result = await kickMember("org-1", "member-1");

        expect(mockDelete).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/members/member-1",
        );
        expect(result).toEqual({ value: "member-1" });
    });

    it("throws on failure", async () => {
        mockDelete.mockRejectedValue(
            new ApiError(
                {
                    code: "FORBIDDEN",
                    message: "Cannot kick the owner",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                403,
            ),
        );

        await expect(kickMember("org-1", "member-1")).rejects.toThrow(
            "Cannot kick the owner",
        );
    });
});
