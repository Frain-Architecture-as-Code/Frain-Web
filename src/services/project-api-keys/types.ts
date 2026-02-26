export interface CreateApiKeyRequest {
    targetMemberId: string;
}

export interface ProjectApiKeyResponse {
    id: string;
    projectId: string;
    memberId: string;
    apiKeySecret: string;
    lastUsedAt: string;
    createdAt: string;
}

export interface ProjectApiKeyCreatedResponse {
    id: string;
    projectId: string;
    memberId: string;
    apiKeySecret: string;
    lastUsedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
