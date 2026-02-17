export type ProjectVisibility = "PUBLIC" | "PRIVATE";

export interface CreateProjectRequest {
    visibility?: ProjectVisibility;
}

export interface UpdateProjectVisibilityRequest {
    visibility?: ProjectVisibility;
}

export interface ProjectResponse {
    projectId: string;
    organizationId: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
}
