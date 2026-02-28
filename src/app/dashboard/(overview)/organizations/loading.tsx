"use client";

import CreateOrganizationDialog from "@/components/organizations/create-organization-dialog";
import OrganizationGridItemSkeleton from "@/components/organizations/organization-grid-item-skeleton";
import OrganizationListItemSkeleton from "@/components/organizations/organization-list-item-skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useUserPreferences } from "@/stores/user-preferences";
import { LayoutGrid, List } from "lucide-react";

const NRO_ITEMS = 6;

export default function OrganizationsLoadingScreen() {
    const viewMode = useUserPreferences((state) => state.organizationsViewMode);

    const loadingItems = Array.from({ length: NRO_ITEMS });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Organizations
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your organizations and their projects.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ToggleGroup type="single" variant="outline" size="sm">
                        <ToggleGroupItem value="list" aria-label="List view">
                            <List className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="grid" aria-label="Grid view">
                            <LayoutGrid className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <CreateOrganizationDialog disabled />
                </div>
            </div>

            {viewMode === "list" ? (
                <div className="flex flex-col gap-3">
                    {loadingItems.map(() => (
                        <OrganizationListItemSkeleton />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loadingItems.map(() => (
                        <OrganizationGridItemSkeleton />
                    ))}
                </div>
            )}
        </div>
    );
}
