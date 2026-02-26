import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { ApiError } from "@/lib/api-error";
import type { NotificationResponse } from "@/services/notifications/types";
import { NotificationStatus } from "@/services/notifications/types";

// Mock the api module
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

const { api } = await import("@/lib/api");
const { getNotifications, updateNotificationStatus } = await import(
    "@/services/notifications/actions"
);

const mockGet = api.get as Mock;
const mockPatch = api.patch as Mock;

const sampleNotification: NotificationResponse = {
    notificationId: "notif-1",
    type: "INVITATION" as NotificationResponse["type"],
    message: "You have been invited to Test Org",
    senderEmail: "owner@example.com",
    status: NotificationStatus.UNREAD,
    resourceId: "inv-1",
    recipientEmail: "user@example.com",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getNotifications", () => {
    it("returns notifications", async () => {
        mockGet.mockResolvedValue({ data: [sampleNotification] });

        const result = await getNotifications();

        expect(mockGet).toHaveBeenCalledWith("/api/v1/notifications");
        expect(result).toEqual([sampleNotification]);
    });

    it("throws Error with ApiError message", async () => {
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

        await expect(getNotifications()).rejects.toThrow("Not authenticated");
    });
});

describe("updateNotificationStatus", () => {
    it("patches and returns the updated notification", async () => {
        const updated = {
            ...sampleNotification,
            status: NotificationStatus.READ,
        };
        mockPatch.mockResolvedValue({ data: updated });

        const request = { newStatus: NotificationStatus.READ };
        const result = await updateNotificationStatus("notif-1", request);

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/v1/notifications/notif-1",
            request,
        );
        expect(result.status).toBe(NotificationStatus.READ);
    });

    it("can archive a notification", async () => {
        const archived = {
            ...sampleNotification,
            status: NotificationStatus.ARCHIVED,
        };
        mockPatch.mockResolvedValue({ data: archived });

        const request = { newStatus: NotificationStatus.ARCHIVED };
        const result = await updateNotificationStatus("notif-1", request);

        expect(result.status).toBe(NotificationStatus.ARCHIVED);
    });

    it("throws generic message for non-API errors", async () => {
        mockPatch.mockRejectedValue(new TypeError("fetch failed"));

        await expect(
            updateNotificationStatus("notif-1", {
                newStatus: NotificationStatus.READ,
            }),
        ).rejects.toThrow("An unexpected error occurred");
    });
});
