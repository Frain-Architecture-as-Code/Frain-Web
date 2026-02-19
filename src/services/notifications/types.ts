export enum NotificationStatus {
    UNREAD = "UNREAD",
    READ = "READ",
    ARCHIVED = "ARCHIVED",
}

export interface UpdateNotificationStatusRequest {
    newStatus: NotificationStatus;
}
export enum NotificationType {
    INVITATION = "INVITATION",
    REMINDER = "REMINDER",
    ALERT = "ALERT",
}

export interface NotificationResponse {
    notificationId: string;
    type: NotificationType;
    message: string;
    senderEmail: string;
    status: NotificationStatus;
    resourceId: string;
    recipientEmail: string;
    createdAt: string;
    updatedAt: string;
}
