"use client";

import { Building2, LayoutGrid, List } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OrganizationResponse } from "@/services/organizations/types";
import { useUserPreferences, type ViewMode } from "@/stores/user-preferences";
import OrganizationGridItem from "./organizations/organization-grid-item";
import OrganizationListItem from "./organizations/organization-list-item";
import CreateOrganizationDialog from "./organizations/create-organization-dialog";

export function OrganizationList({
    organizations,
}: {
    organizations: OrganizationResponse[];
}) {
    const viewMode = useUserPreferences((state) => state.organizationsViewMode);
    const setViewMode = useUserPreferences(
        (state) => state.setOrganizationsViewMode,
    );

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Organizations
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your organizations and their projects.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={(value: string) => {
                                if (value) setViewMode(value as ViewMode);
                            }}
                            variant="outline"
                            size="sm"
                        >
                            <ToggleGroupItem
                                value="list"
                                aria-label="List view"
                            >
                                <List className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="grid"
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <CreateOrganizationDialog />
                    </div>
                </div>
            </BlurFade>

            {organizations.length > 0 ? (
                viewMode === "list" ? (
                    <div className="grid gap-3">
                        {organizations.map((org, index) => (
                            <BlurFade
                                key={org.organizationId}
                                delay={0.1 + index * 0.05}
                            >
                                <OrganizationListItem org={org} />
                            </BlurFade>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {organizations.map((org, index) => (
                            <BlurFade
                                key={org.organizationId}
                                delay={0.1 + index * 0.05}
                            >
                                <OrganizationGridItem org={org} />
                            </BlurFade>
                        ))}
                    </div>
                )
            ) : (
                <BlurFade delay={0.1}>
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="mb-1 text-sm font-semibold">
                                No organizations yet
                            </p>
                            <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
                                Create your first organization to start managing
                                projects and collaborating with your team.
                            </p>
                            <CreateOrganizationDialog />
                        </CardContent>
                    </Card>
                </BlurFade>
            )}
        </div>
    );
}
