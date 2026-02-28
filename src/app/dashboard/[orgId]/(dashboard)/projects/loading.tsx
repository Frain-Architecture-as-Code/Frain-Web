import CreateOrganizationDialog from "@/components/organizations/create-organization-dialog";
import ProjectListItemSkeleton from "@/components/project/project-list-item-skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

const NRO_ITEMS = 6;

export default function ProjectsLoadingScreen() {
    const loadingItems = Array.from({ length: NRO_ITEMS });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Projects
                    </h1>
                    <p className="text-muted-foreground">Manage projects.</p>
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
            <div className="flex flex-col gap-3">
                {loadingItems.map((_, index) => (
                    <ProjectListItemSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
