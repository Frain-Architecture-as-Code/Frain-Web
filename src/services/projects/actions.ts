"use server";

import { api } from "@/lib/api";
import type {
    CreateProjectRequest,
    ProjectResponse,
    UpdateProjectVisibilityRequest,
} from "./types";

export async function getProjects(
    organizationId: string,
): Promise<ProjectResponse[]> {
    const { data } = await api.get<ProjectResponse[]>(
        `/api/v1/organizations/${organizationId}/projects`,
    );
    return data;
}

export async function getProjectById(
    organizationId: string,
    projectId: string,
): Promise<ProjectResponse> {
    const { data } = await api.get<ProjectResponse>(
        `/api/v1/organizations/${organizationId}/projects/${projectId}`,
    );
    return data;
}

export async function createProject(
    organizationId: string,
    request: CreateProjectRequest,
): Promise<ProjectResponse> {
    const { data } = await api.post<ProjectResponse>(
        `/api/v1/organizations/${organizationId}/projects`,
        request,
    );
    return data;
}

export async function updateProject(
    organizationId: string,
    projectId: string,
    request: UpdateProjectVisibilityRequest,
): Promise<ProjectResponse> {
    const { data } = await api.patch<ProjectResponse>(
        `/api/v1/organizations/${organizationId}/projects/${projectId}`,
        request,
    );
    return data;
}
