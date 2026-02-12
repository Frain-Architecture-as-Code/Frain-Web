export type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED";

export interface UpdateNotificationStatusRequest {
    newStatus: NotificationStatus;
}

export interface NotificationResponse {
    notificationId: string;
    type: string;
    message: string;
    senderEmail: string;
    status: string;
    resourceId: string;
    recipientEmail: string;
    createdAt: string;
    updatedAt: string;
}
