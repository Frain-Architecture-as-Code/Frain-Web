"use client";

import { Bell, Check, Mail, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InvitationController } from "@/services/invitations/controller";
import { NotificationController } from "@/services/notifications/controller";
import {
    type NotificationResponse,
    NotificationType,
} from "@/services/notifications/types";

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function NotificationCard({
    notification,
    onUpdate,
}: {
    notification: NotificationResponse;
    onUpdate: () => void;
}) {
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);

    async function handleAccept() {
        setIsAccepting(true);
        try {
            await InvitationController.accept(notification.resourceId);
            await NotificationController.updateStatus(
                notification.notificationId,
                { newStatus: "READ" },
            );
            toast.success("Invitation accepted!");
            onUpdate();
        } catch {
            toast.error("Failed to accept invitation");
        } finally {
            setIsAccepting(false);
        }
    }

    async function handleDecline() {
        setIsDeclining(true);
        try {
            await InvitationController.decline(notification.resourceId);
            await NotificationController.updateStatus(
                notification.notificationId,
                { newStatus: "READ" },
            );
            toast.success("Invitation declined");
            onUpdate();
        } catch {
            toast.error("Failed to decline invitation");
        } finally {
            setIsDeclining(false);
        }
    }

    const isUnread = notification.status === "UNREAD";
    const isInvitation = notification.type === NotificationType.INVITATION;

    return (
        <Card
            className={`transition-colors ${isUnread ? "border-primary/50" : ""}`}
        >
            <CardContent className="py-4">
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isUnread ? "bg-primary/10" : "bg-muted"
                        }`}
                    >
                        {isInvitation ? (
                            <Mail
                                className={`h-4 w-4 ${isUnread ? "text-primary" : "text-muted-foreground"}`}
                            />
                        ) : (
                            <Bell
                                className={`h-4 w-4 ${isUnread ? "text-primary" : "text-muted-foreground"}`}
                            />
                        )}
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    From {notification.senderEmail} •{" "}
                                    {formatDate(notification.createdAt)}
                                </p>
                            </div>
                            {isUnread && (
                                <Badge variant="default" className="shrink-0">
                                    New
                                </Badge>
                            )}
                        </div>

                        {isInvitation && isUnread && (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleAccept}
                                    disabled={isAccepting || isDeclining}
                                >
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                    Accept
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDecline}
                                    disabled={isAccepting || isDeclining}
                                >
                                    <X className="mr-1.5 h-3.5 w-3.5" />
                                    Decline
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function NotificationList({
    notifications: initialNotifications,
}: {
    notifications: NotificationResponse[];
}) {
    const [notifications, setNotifications] = useState(initialNotifications);

    async function refreshNotifications() {
        try {
            const updated = await NotificationController.getAll();
            setNotifications(updated);
        } catch {
            toast.error("Failed to refresh notifications");
        }
    }

    const unreadCount = notifications.filter(
        (n) => n.status === "UNREAD",
    ).length;

    return (
        <div className="space-y-4">
            {unreadCount > 0 && (
                <BlurFade delay={0.05}>
                    <p className="text-sm text-muted-foreground">
                        {unreadCount} unread notification
                        {unreadCount !== 1 ? "s" : ""}
                    </p>
                </BlurFade>
            )}

            {notifications.length > 0 ? (
                <div className="grid gap-3">
                    {notifications.map((notification, index) => (
                        <BlurFade
                            key={notification.notificationId}
                            delay={0.1 + index * 0.05}
                        >
                            <NotificationCard
                                notification={notification}
                                onUpdate={refreshNotifications}
                            />
                        </BlurFade>
                    ))}
                </div>
            ) : (
                <BlurFade delay={0.1}>
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <Bell className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="mb-1 text-sm font-semibold">
                                No notifications
                            </p>
                            <p className="max-w-sm text-center text-sm text-muted-foreground">
                                You're all caught up! Check back later for new
                                notifications.
                            </p>
                        </CardContent>
                    </Card>
                </BlurFade>
            )}
        </div>
    );
}
