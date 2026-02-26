"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type {
    CreateApiKeyRequest,
    ProjectApiKeyCreatedResponse,
    ProjectApiKeyResponse,
} from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function listApiKeys(
    organizationId: string,
    projectId: string,
): Promise<ProjectApiKeyResponse[]> {
    try {
        const { data } = await api.get<ProjectApiKeyResponse[]>(
            `/api/v1/organizations/${organizationId}/projects/${projectId}/api-keys`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function createApiKey(
    organizationId: string,
    projectId: string,
    request: CreateApiKeyRequest,
): Promise<ProjectApiKeyCreatedResponse> {
    try {
        const { data } = await api.post<ProjectApiKeyCreatedResponse>(
            `/api/v1/organizations/${organizationId}/projects/${projectId}/api-keys`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function revokeApiKey(
    organizationId: string,
    projectId: string,
    apiKeyId: string,
): Promise<void> {
    try {
        await api.delete(
            `/api/v1/organizations/${organizationId}/projects/${projectId}/api-keys/${apiKeyId}`,
        );
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
