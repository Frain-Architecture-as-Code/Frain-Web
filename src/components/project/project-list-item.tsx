import { GetProjectDetailsResponse } from "@/services/c4models/types";
import { ProjectResponse } from "@/services/projects/types";
import { Card, CardContent } from "../ui/card";
import { Calendar, FolderKanban } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { VisibilityBadge } from "../project-list";
import Link from "next/link";

export default function ProjectListItem({
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
                <CardContent className="flex items-center justify-between py-4">
                    <div className="flex gap-3">
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
                                <span>
                                    Created {formatDate(project.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <VisibilityBadge visibility={project.visibility} />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
