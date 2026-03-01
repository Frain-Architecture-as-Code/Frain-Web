import { ProjectCanvas } from "@/components/project/project-canvas";
import { auth } from "@/lib/auth";
import { C4ModelController } from "@/services/c4models/controller";
import { ProjectApiKeyController } from "@/services/project-api-keys/controller";

interface ProjectPageProps {
    params: Promise<{ projectId: string; orgId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectId, orgId } = await params;
    const session = await auth();

    const [c4ModelResponse, views, apiKeys] = await Promise.all([
        C4ModelController.get(projectId),
        C4ModelController.getViewSummaries(projectId),
        ProjectApiKeyController.list(orgId, projectId),
    ]);

    return (
        <ProjectCanvas
            projectId={projectId}
            organizationId={orgId}
            currentUserId={session?.user?.id || ""}
            c4Model={c4ModelResponse}
            initialViews={views}
            initialApiKeys={apiKeys}
        />
    );
}
