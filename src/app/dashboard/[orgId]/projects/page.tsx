"use client";

import { Calendar, FolderKanban, Globe, Lock, Plus } from "lucide-react";
import { useState } from "react";
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
import { useOrg } from "@/contexts/org-context";
import type {
    ProjectResponse,
    ProjectVisibility,
} from "@/services/projects/types";

const sampleProjects: ProjectResponse[] = [
    {
        projectId: "proj-1",
        organizationId: "org-1",
        visibility: "PUBLIC",
        createdAt: "2026-01-15T10:30:00Z",
        updatedAt: "2026-02-10T14:00:00Z",
    },
    {
        projectId: "proj-2",
        organizationId: "org-1",
        visibility: "PRIVATE",
        createdAt: "2026-01-20T08:00:00Z",
        updatedAt: "2026-02-08T17:45:00Z",
    },
    {
        projectId: "proj-3",
        organizationId: "org-1",
        visibility: "PUBLIC",
        createdAt: "2026-02-01T12:15:00Z",
        updatedAt: "2026-02-11T09:30:00Z",
    },
];

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function CreateProjectDialog() {
    const [open, setOpen] = useState(false);
    const [visibility, setVisibility] = useState<ProjectVisibility>("PUBLIC");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        // TODO: Wire up to ProjectController.create()
        setTimeout(() => {
            setIsSubmitting(false);
            setOpen(false);
            setVisibility("PUBLIC");
        }, 500);
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

export default function ProjectsPage() {
    const { organization } = useOrg();
    const projects = sampleProjects.filter(
        (p) => p.organizationId === organization.organizationId,
    );

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Projects
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage projects in {organization.name}.
                        </p>
                    </div>
                    <CreateProjectDialog />
                </div>
            </BlurFade>

            {projects.length > 0 ? (
                <div className="grid gap-3">
                    {projects.map((project, index) => (
                        <BlurFade
                            key={project.projectId}
                            delay={0.1 + index * 0.05}
                        >
                            <Card className="transition-colors hover:bg-muted/50">
                                <CardContent className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                            <FolderKanban className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {project.projectId}
                                            </p>
                                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    Created{" "}
                                                    {formatDate(
                                                        project.createdAt,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {project.visibility === "PUBLIC" ? (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <Globe className="h-3 w-3" />
                                            Public
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            <Lock className="h-3 w-3" />
                                            Private
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        </BlurFade>
                    ))}
                </div>
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
                            <CreateProjectDialog />
                        </CardContent>
                    </Card>
                </BlurFade>
            )}
        </div>
    );
}
