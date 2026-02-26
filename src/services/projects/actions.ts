"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type {
    CreateProjectRequest,
    ProjectResponse,
    UpdateProjectVisibilityRequest,
} from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function getProjects(
    organizationId: string,
): Promise<ProjectResponse[]> {
    try {
        const { data } = await api.get<ProjectResponse[]>(
            `/api/v1/organizations/${organizationId}/projects`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getProjectById(
    organizationId: string,
    projectId: string,
): Promise<ProjectResponse> {
    try {
        const { data } = await api.get<ProjectResponse>(
            `/api/v1/organizations/${organizationId}/projects/${projectId}`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function createProject(
    organizationId: string,
    request: CreateProjectRequest,
): Promise<ProjectResponse> {
    try {
        const { data } = await api.post<ProjectResponse>(
            `/api/v1/organizations/${organizationId}/projects`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateProject(
    organizationId: string,
    projectId: string,
    request: UpdateProjectVisibilityRequest,
): Promise<ProjectResponse> {
    try {
        const { data } = await api.patch<ProjectResponse>(
            `/api/v1/organizations/${organizationId}/projects/${projectId}`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
