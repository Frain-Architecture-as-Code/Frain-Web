import { createApiKey, listApiKeys, revokeApiKey } from "./actions";
import type {
    CreateApiKeyRequest,
    ProjectApiKeyCreatedResponse,
    ProjectApiKeyResponse,
} from "./types";

export class ProjectApiKeyController {
    static async list(
        organizationId: string,
        projectId: string,
    ): Promise<ProjectApiKeyResponse[]> {
        return listApiKeys(organizationId, projectId);
    }

    static async create(
        organizationId: string,
        projectId: string,
        request: CreateApiKeyRequest,
    ): Promise<ProjectApiKeyCreatedResponse> {
        return createApiKey(organizationId, projectId, request);
    }

    static async revoke(
        organizationId: string,
        projectId: string,
        apiKeyId: string,
    ): Promise<void> {
        return revokeApiKey(organizationId, projectId, apiKeyId);
    }
}
