import { GetProjectDetailsResponse } from "@/services/c4models/types";
import { ProjectResponse } from "@/services/projects/types";
import { Calendar, FolderKanban } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { VisibilityBadge } from "../project-list";

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
            <Card className="transition-colors hover:bg-muted/50 h-full">
                <CardContent className="space-y-3 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                            <FolderKanban className="size-5 text-primary" />
                        </div>
                        <VisibilityBadge visibility={project.visibility} />
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
                    </div>
                    <div className="mt-2 flex items-end text-xs text-muted-foreground flex-1">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            <span>Created {formatDate(project.createdAt)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
