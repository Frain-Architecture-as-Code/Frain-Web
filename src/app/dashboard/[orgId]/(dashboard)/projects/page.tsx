import { ProjectList } from "@/components/project-list";
import { OrganizationController } from "@/services/organizations/controller";
import { ProjectController } from "@/services/projects/controller";

interface ProjectsPageProps {
    params: Promise<{ orgId: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
    const { orgId } = await params;

    const [projects, organization] = await Promise.all([
        ProjectController.getAll(orgId),
        OrganizationController.getById(orgId),
    ]);

    return (
        <ProjectList
            projects={projects}
            organizationId={orgId}
            organizationName={organization.name}
        />
    );
}
