import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { OrgSidebar } from "@/components/org-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { OrgProvider } from "@/contexts/org-context";
import type { OrganizationResponse } from "@/services/organizations/types";

// TODO: Replace with OrganizationController.getById() when backend is available
const sampleOrganizations: Record<string, OrganizationResponse> = {
    "org-1": {
        organizationId: "org-1",
        ownerMemberId: "member-1",
        name: "Acme Corp",
        visibility: "PUBLIC",
        createdAt: "2025-11-15T10:30:00Z",
        updatedAt: "2026-02-10T14:00:00Z",
    },
    "org-2": {
        organizationId: "org-2",
        ownerMemberId: "member-1",
        name: "Startup Inc",
        visibility: "PRIVATE",
        createdAt: "2026-01-03T08:00:00Z",
        updatedAt: "2026-02-08T17:45:00Z",
    },
    "org-3": {
        organizationId: "org-3",
        ownerMemberId: "member-2",
        name: "Open Source Foundation",
        visibility: "PUBLIC",
        createdAt: "2025-09-20T12:15:00Z",
        updatedAt: "2026-01-28T09:30:00Z",
    },
    "org-4": {
        organizationId: "org-4",
        ownerMemberId: "member-1",
        name: "Internal Tools Team",
        visibility: "PRIVATE",
        createdAt: "2026-02-01T16:45:00Z",
        updatedAt: "2026-02-11T11:20:00Z",
    },
};

interface OrgLayoutProps {
    children: ReactNode;
    params: Promise<{ orgId: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
    const { orgId } = await params;

    // TODO: Replace with OrganizationController.getById(orgId)
    const organization = sampleOrganizations[orgId];

    if (!organization) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Organization not found
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        The organization you&apos;re looking for doesn&apos;t
                        exist.
                    </p>
                </div>
            </div>
        );
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
