import { GetProjectDetailsResponse } from "@/services/c4models/types";
import { ProjectResponse } from "@/services/projects/types";
import { Card, CardContent } from "./ui/card";
import { Calendar, FolderKanban } from "lucide-react";
import { VisibilityBadge } from "./project-list";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ProjectGridItem({
    project,
    projectDetails,
}: {
    project: ProjectResponse;
    projectDetails: GetProjectDetailsResponse | null;
}) {
    return (
        <Link
            href={`/dashboard/${project.organizationId}/project/${project.projectId}`}
        >
            <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                            <VisibilityBadge visibility={project.visibility} />
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
        </Link>
    );
}
