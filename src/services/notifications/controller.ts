import { getNotifications, updateNotificationStatus } from "./actions";
import type {
    NotificationResponse,
    UpdateNotificationStatusRequest,
} from "./types";

export class NotificationController {
    static async getAll(): Promise<NotificationResponse[]> {
        return getNotifications();
    }

    static async updateStatus(
        notificationId: string,
        request: UpdateNotificationStatusRequest,
    ): Promise<NotificationResponse> {
        return updateNotificationStatus(notificationId, request);
    }
}
