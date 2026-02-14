import { notFound } from "next/navigation";
import { ProjectCanvas } from "@/components/project/project-canvas";
import { C4ModelController } from "@/services/c4models/controller";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

interface ProjectPageProps {
    params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectId } = await params;

    try {
        const [c4ModelResponse, views] = await Promise.all([
            C4ModelController.get(projectId),
            C4ModelController.getViewSummaries(projectId),
        ]);

        // API keys require organizationId which we don't have in this route.
        // Pass an empty array -- the sidebar will allow creating keys once
        // we have the org context from the project response.
        const apiKeys: ProjectApiKeyResponse[] = [];

        return (
            <ProjectCanvas
                projectId={projectId}
                organizationId=""
                c4Model={c4ModelResponse}
                initialViews={views}
                initialApiKeys={apiKeys}
            />
        );
    } catch {
        notFound();
    }
}
