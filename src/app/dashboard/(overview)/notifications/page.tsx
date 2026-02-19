import { NotificationList } from "@/components/notification-list";
import { NotificationController } from "@/services/notifications/controller";

export const metadata = {
    title: "Notifications",
};

export default async function NotificationsPage() {
    const notifications = await NotificationController.getAll();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Notifications
                </h1>
                <p className="text-muted-foreground">
                    Manage your notifications and invitations
                </p>
            </div>
            <NotificationList notifications={notifications} />
        </div>
    );
}
