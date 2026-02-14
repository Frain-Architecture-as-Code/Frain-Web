import { Clock, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import type { RecentProject } from "@/types/dashboard";

export const metadata = {
    title: "Dashboard",
};

const sampleRecentProjects: RecentProject[] = [
    {
        projectId: "proj-1",
        name: "E-Commerce Platform",
        organizationName: "Acme Corp",
        lastModifiedAt: "2026-02-11T14:30:00Z",
    },
    {
        projectId: "proj-2",
        name: "Payment Gateway",
        organizationName: "Acme Corp",
        lastModifiedAt: "2026-02-10T09:15:00Z",
    },
    {
        projectId: "proj-3",
        name: "Mobile App Backend",
        organizationName: "Startup Inc",
        lastModifiedAt: "2026-02-08T17:45:00Z",
    },
    {
        projectId: "proj-4",
        name: "Analytics Dashboard",
        organizationName: "Startup Inc",
        lastModifiedAt: "2026-02-05T11:00:00Z",
    },
    {
        projectId: "proj-5",
        name: "Auth Service",
        organizationName: "Acme Corp",
        lastModifiedAt: "2026-01-28T08:20:00Z",
    },
];

function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export default async function DashboardPage() {
    const session = await auth();
    const firstName = session?.user?.name?.split(" ")[0] ?? "there";

    return (
        <div className="space-y-8">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back, {firstName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Here&apos;s what you&apos;ve been working on
                            recently.
                        </p>
                    </div>
                    <Button size="sm" asChild>
                        <Link href="/dashboard/organizations">
                            <Plus className="mr-1 h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
                </div>
            </BlurFade>

            <section className="space-y-4">
                <BlurFade delay={0.1}>
                    <h2 className="text-lg font-semibold tracking-tight">
                        Latest Projects
                    </h2>
                </BlurFade>

                {sampleRecentProjects.length > 0 ? (
                    <div className="grid gap-3">
                        {sampleRecentProjects.map((project, index) => (
                            <BlurFade
                                key={project.projectId}
                                delay={0.15 + index * 0.05}
                            >
                                <Card className="transition-colors hover:bg-muted/50">
                                    <CardContent className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                                <FolderKanban className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {project.name}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {project.organizationName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                {formatRelativeDate(
                                                    project.lastModifiedAt,
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </BlurFade>
                        ))}
                    </div>
                ) : (
                    <BlurFade delay={0.15}>
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="mb-4 rounded-full bg-muted p-3">
                                    <Plus className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <CardTitle className="mb-1 text-sm">
                                    No projects yet
                                </CardTitle>
                                <CardDescription className="mb-4 max-w-sm text-center">
                                    Create your first project to start modeling
                                    your infrastructure as diagrams.
                                </CardDescription>
                                <Button size="sm">
                                    <Plus className="mr-1 h-4 w-4" />
                                    Create Project
                                </Button>
                            </CardContent>
                        </Card>
                    </BlurFade>
                )}
            </section>
        </div>
    );
}
