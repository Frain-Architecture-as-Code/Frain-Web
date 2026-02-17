"use server";

import { api } from "@/lib/api";
import type {
    CreateApiKeyRequest,
    ProjectApiKeyCreatedResponse,
    ProjectApiKeyResponse,
} from "./types";

export async function listApiKeys(
    organizationId: string,
    projectId: string,
): Promise<ProjectApiKeyResponse[]> {
    const { data } = await api.get<ProjectApiKeyResponse[]>(
        `/api/v1/organizations/${organizationId}/projects/${projectId}/api-keys`,
    );
    return data;
}

export async function createApiKey(
    organizationId: string,
    projectId: string,
    request: CreateApiKeyRequest,
): Promise<ProjectApiKeyCreatedResponse> {
    const { data } = await api.post<ProjectApiKeyCreatedResponse>(
        `/api/v1/organizations/${organizationId}/projects/${projectId}/api-keys`,
        request,
    );
    return data;
}

export async function revokeApiKey(
    organizationId: string,
    projectId: string,
    apiKeyId: string,
): Promise<void> {
    await api.delete(
        `/api/v1/organizations/${organizationId}/projects/${projectId}/api-keys/${apiKeyId}`,
    );
}
