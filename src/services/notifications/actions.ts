"use server";

import { api } from "@/lib/api";
import type {
    NotificationResponse,
    UpdateNotificationStatusRequest,
} from "./types";

export async function getNotifications(): Promise<NotificationResponse[]> {
    const { data } = await api.get<NotificationResponse[]>(
        "/api/v1/notifications",
    );
    return data;
}

export async function updateNotificationStatus(
    notificationId: string,
    request: UpdateNotificationStatusRequest,
): Promise<NotificationResponse> {
    const { data } = await api.patch<NotificationResponse>(
        `/api/v1/notifications/${notificationId}`,
        request,
    );
    return data;
}
