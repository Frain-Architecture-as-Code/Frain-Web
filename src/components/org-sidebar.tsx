"use client";

import {
    Building2,
    FolderKanban,
    LayoutDashboard,
    Mail,
    Settings,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useOrg } from "@/contexts/org-context";

function getNavigation(orgId: string) {
    return [
        {
            title: "Overview",
            href: `/dashboard/${orgId}`,
            icon: LayoutDashboard,
        },
        {
            title: "Projects",
            href: `/dashboard/${orgId}/projects`,
            icon: FolderKanban,
        },
        {
            title: "Members",
            href: `/dashboard/${orgId}/members`,
            icon: Users,
        },
        {
            title: "Invitations",
            href: `/dashboard/${orgId}/invitations`,
            icon: Mail,
        },
        {
            title: "Settings",
            href: `/dashboard/${orgId}/settings`,
            icon: Settings,
        },
    ] as const;
}

export function OrgSidebar() {
    const pathname = usePathname();
    const { organization } = useOrg();
    const navigation = getNavigation(organization.organizationId);

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={`/dashboard/${organization.organizationId}`}
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Building2 className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {organization.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Organization
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="sm" asChild>
                            <Link href="/dashboard">
                                <span className="text-xs text-muted-foreground">
                                    Back to Dashboard
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
