import { createProject, updateProject } from "./actions";
import type {
    CreateProjectRequest,
    ProjectResponse,
    UpdateProjectVisibilityRequest,
} from "./types";

export class ProjectController {
    static async create(
        organizationId: string,
        request: CreateProjectRequest,
    ): Promise<ProjectResponse> {
        return createProject(organizationId, request);
    }

    static async update(
        organizationId: string,
        projectId: string,
        request: UpdateProjectVisibilityRequest,
    ): Promise<ProjectResponse> {
        return updateProject(organizationId, projectId, request);
    }
}
