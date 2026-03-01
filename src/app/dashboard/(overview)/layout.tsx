import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function OverviewLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashboardNavbar />
                <main className="flex-1 p-6">
                    <section className="max-w-7xl mx-auto">{children}</section>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
