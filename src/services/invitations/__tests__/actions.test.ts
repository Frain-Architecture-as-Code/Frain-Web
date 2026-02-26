import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type { InvitationResponse } from "@/services/invitations/types";
import { InvitationRole } from "@/services/invitations/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

const { api } = await import("@/lib/api");
const { getInvitations, sendInvitation, acceptInvitation, declineInvitation } =
    await import("@/services/invitations/actions");

const mockGet = api.get as Mock;
const mockPost = api.post as Mock;
const mockPatch = api.patch as Mock;

const sampleInvitation: InvitationResponse = {
    invitationId: "inv-1",
    targetEmail: "invitee@example.com",
    status: "PENDING",
    role: InvitationRole.CONTRIBUTOR,
    organizationId: "org-1",
    inviterId: "user-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getInvitations", () => {
    it("returns invitations for an organization", async () => {
        mockGet.mockResolvedValue({ data: [sampleInvitation] });

        const result = await getInvitations("org-1");

        expect(mockGet).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/invitations",
        );
        expect(result).toEqual([sampleInvitation]);
    });

    it("throws Error with ApiError message", async () => {
        mockGet.mockRejectedValue(
            new ApiError(
                {
                    code: "FORBIDDEN",
                    message: "Not authorized",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                403,
            ),
        );

        await expect(getInvitations("org-1")).rejects.toThrow("Not authorized");
    });
});

describe("sendInvitation", () => {
    it("posts and returns the created invitation", async () => {
        mockPost.mockResolvedValue({ data: sampleInvitation });

        const request = {
            targetEmail: "invitee@example.com",
            role: InvitationRole.CONTRIBUTOR,
        };
        const result = await sendInvitation("org-1", request);

        expect(mockPost).toHaveBeenCalledWith(
            "/api/v1/organizations/org-1/invitations",
            request,
        );
        expect(result).toEqual(sampleInvitation);
    });

    it("throws on validation error", async () => {
        mockPost.mockRejectedValue(
            new ApiError(
                {
                    code: "VALIDATION_ERROR",
                    message: "Invalid email",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                400,
            ),
        );

        await expect(
            sendInvitation("org-1", {
                targetEmail: "bad",
                role: InvitationRole.CONTRIBUTOR,
            }),
        ).rejects.toThrow("Invalid email");
    });
});

describe("acceptInvitation", () => {
    it("patches the invitation to accept", async () => {
        mockPatch.mockResolvedValue({});

        await acceptInvitation("inv-1");

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/invitations/inv-1/accept",
        );
    });

    it("throws on failure", async () => {
        mockPatch.mockRejectedValue(
            new ApiError(
                {
                    code: "NOT_FOUND",
                    message: "Invitation not found",
                    details: null,
                    timestamp: "2024-01-01T00:00:00Z",
                },
                404,
            ),
        );

        await expect(acceptInvitation("inv-999")).rejects.toThrow(
            "Invitation not found",
        );
    });
});

describe("declineInvitation", () => {
    it("patches the invitation to reject", async () => {
        mockPatch.mockResolvedValue({});

        await declineInvitation("inv-1");

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/invitations/inv-1/reject",
        );
    });
});
