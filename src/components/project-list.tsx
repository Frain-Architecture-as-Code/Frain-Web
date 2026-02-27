"use client";

import {
    Calendar,
    ExternalLink,
    FolderKanban,
    Globe,
    LayoutGrid,
    List,
    Lock,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { C4ModelController } from "@/services/c4models/controller";
import type { GetProjectDetailsResponse } from "@/services/c4models/types";
import { ProjectController } from "@/services/projects/controller";
import type {
    ProjectResponse,
    ProjectVisibility,
} from "@/services/projects/types";
import { useUserPreferences, type ViewMode } from "@/stores/user-preferences";

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function VisibilityBadge({ visibility }: { visibility: string }) {
    if (visibility === "PUBLIC") {
        return (
            <Badge variant="secondary" className="gap-1">
                <Globe className="h-3 w-3" />
                Public
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Private
        </Badge>
    );
}

function CreateProjectDialog({ organizationId }: { organizationId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [visibility, setVisibility] = useState<ProjectVisibility>("PUBLIC");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await ProjectController.create(organizationId, { visibility });
            setOpen(false);
            setVisibility("PUBLIC");
            router.refresh();
            toast.success("Project created successfully");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new project in this organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-visibility">Visibility</Label>
                        <Select
                            value={visibility}
                            onValueChange={(value: ProjectVisibility) =>
                                setVisibility(value)
                            }
                        >
                            <SelectTrigger id="project-visibility">
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">
                                    <Globe className="mr-2 inline h-3.5 w-3.5" />
                                    Public
                                </SelectItem>
                                <SelectItem value="PRIVATE">
                                    <Lock className="mr-2 inline h-3.5 w-3.5" />
                                    Private
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ProjectListItem({
    project,
    projectDetails,
}: {
    project: ProjectResponse;
    projectDetails: GetProjectDetailsResponse | null;
}) {
    return (
        <Card className="transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                        <FolderKanban className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">
                            {projectDetails?.title || project.projectId}
                        </p>
                        {projectDetails?.description && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                {projectDetails.description}
                            </p>
                        )}
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Created {formatDate(project.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <VisibilityBadge visibility={project.visibility} />
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={`/dashboard/${project.organizationId}/project/${project.projectId}`}
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open project</span>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ProjectGridItem({
    project,
    projectDetails,
}: {
    project: ProjectResponse;
    projectDetails: GetProjectDetailsResponse | null;
}) {
    return (
        <Card className="transition-colors hover:bg-muted/50">
            <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                        <VisibilityBadge visibility={project.visibility} />
                        <Button variant="ghost" size="icon" asChild>
                            <Link
                                href={`/dashboard/${project.organizationId}/project/${project.projectId}`}
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Open project</span>
                            </Link>
                        </Button>
                    </div>
                </div>
                <div>
                    <p className="font-medium">
                        {projectDetails?.title || project.projectId}
                    </p>
                    {projectDetails?.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {projectDetails.description}
                        </p>
                    )}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function ProjectList({
    projects,
    organizationId,
    organizationName,
}: {
    projects: ProjectResponse[];
    organizationId: string;
    organizationName: string;
}) {
    const viewMode = useUserPreferences((state) => state.projectsViewMode);
    const setViewMode = useUserPreferences(
        (state) => state.setProjectsViewMode,
    );
    const [projectDetailsMap, setProjectDetailsMap] = useState<
        Map<string, GetProjectDetailsResponse>
    >(new Map());

    useEffect(() => {
        async function fetchProjectDetails() {
            const detailsMap = new Map<string, GetProjectDetailsResponse>();

            await Promise.all(
                projects.map(async (project) => {
                    try {
                        const details =
                            await C4ModelController.getProjectDetails(
                                project.projectId,
                            );
                        detailsMap.set(project.projectId, details);
                    } catch (error) {
                        // Silently fail - will fall back to projectId
                        console.error(
                            `Failed to fetch details for project ${project.projectId}:`,
                            error,
                        );
                    }
                }),
            );

            setProjectDetailsMap(detailsMap);
        }

        if (projects.length > 0) {
            fetchProjectDetails();
        }
    }, [projects]);

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Projects
                        </h1>
                        <p className="text-muted-foreground">
                            Manage projects in {organizationName}.
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
                        <CreateProjectDialog organizationId={organizationId} />
                    </div>
                </div>
            </BlurFade>

            {projects.length > 0 ? (
                viewMode === "list" ? (
                    <div className="grid gap-3">
                        {projects.map((project, index) => (
                            <BlurFade
                                key={project.projectId}
                                delay={0.1 + index * 0.05}
                            >
                                <ProjectListItem
                                    project={project}
                                    projectDetails={
                                        projectDetailsMap.get(
                                            project.projectId,
                                        ) || null
                                    }
                                />
                            </BlurFade>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <BlurFade
                                key={project.projectId}
                                delay={0.1 + index * 0.05}
                            >
                                <ProjectGridItem
                                    project={project}
                                    projectDetails={
                                        projectDetailsMap.get(
                                            project.projectId,
                                        ) || null
                                    }
                                />
                            </BlurFade>
                        ))}
                    </div>
                )
            ) : (
                <BlurFade delay={0.1}>
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <FolderKanban className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="mb-1 text-sm font-semibold">
                                No projects yet
                            </p>
                            <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
                                Create your first project to start modeling your
                                architecture.
                            </p>
                            <CreateProjectDialog
                                organizationId={organizationId}
                            />
                        </CardContent>
                    </Card>
                </BlurFade>
            )}
        </div>
    );
}
