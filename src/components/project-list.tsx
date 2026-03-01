"use client";

import { FolderKanban, Globe, LayoutGrid, List, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { C4ModelController } from "@/services/c4models/controller";
import type { GetProjectDetailsResponse } from "@/services/c4models/types";
import { ProjectResponse, ProjectVisibility } from "@/services/projects/types";
import { useUserPreferences, type ViewMode } from "@/stores/user-preferences";
import CreateProjectDialog from "./create-project-dialog";
import ProjectGridItem from "./project/project-grid-item";
import ProjectListItem from "./project/project-list-item";

export function VisibilityBadge({
    visibility,
}: {
    visibility: ProjectVisibility;
}) {
    if (visibility === ProjectVisibility.PUBLIC) {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Projects
                    </h1>
                    <p className="text-muted-foreground">Manage projects.</p>
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
                        <ToggleGroupItem value="list" aria-label="List view">
                            <List className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="grid" aria-label="Grid view">
                            <LayoutGrid className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <CreateProjectDialog organizationId={organizationId} />
                </div>
            </div>

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
