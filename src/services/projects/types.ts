export enum ProjectVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export interface CreateProjectRequest {
    visibility?: ProjectVisibility;
}

export interface UpdateProjectVisibilityRequest {
    visibility?: ProjectVisibility;
}

export interface ProjectResponse {
    projectId: string;
    organizationId: string;
    visibility: ProjectVisibility;
    createdAt: string;
    updatedAt: string;
}
