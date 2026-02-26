"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type {
    NotificationResponse,
    UpdateNotificationStatusRequest,
} from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function getNotifications(): Promise<NotificationResponse[]> {
    try {
        const { data } = await api.get<NotificationResponse[]>(
            "/api/v1/notifications",
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateNotificationStatus(
    notificationId: string,
    request: UpdateNotificationStatusRequest,
): Promise<NotificationResponse> {
    try {
        const { data } = await api.patch<NotificationResponse>(
            `/api/v1/notifications/${notificationId}`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
