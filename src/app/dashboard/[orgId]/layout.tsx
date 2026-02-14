import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { OrgSidebar } from "@/components/org-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { OrgProvider } from "@/contexts/org-context";
import { OrganizationController } from "@/services/organizations/controller";
import type { OrganizationResponse } from "@/services/organizations/types";

interface OrgLayoutProps {
    children: ReactNode;
    params: Promise<{ orgId: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
    const { orgId } = await params;

    let organization: OrganizationResponse;
    try {
        organization = await OrganizationController.getById(orgId);
    } catch {
        notFound();
    }

    return (
        <OrgProvider organization={organization}>
            <SidebarProvider>
                <OrgSidebar />
                <SidebarInset>
                    <DashboardNavbar />
                    <main className="flex-1 p-6">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </OrgProvider>
    );
}
