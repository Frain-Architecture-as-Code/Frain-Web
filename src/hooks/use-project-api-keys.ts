import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ProjectApiKeyController } from "@/services/project-api-keys/controller";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";
import type { ApiKeyWithFull } from "@/components/project/api-keys-sheet";

export function useProjectApiKeys(
    organizationId: string,
    projectId: string,
    initialApiKeys: ProjectApiKeyResponse[],
) {
    const [apiKeys, setApiKeys] = useState<ApiKeyWithFull[]>(initialApiKeys);
    const [isApiKeysLoading, setIsApiKeysLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);
    const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);

    const refreshApiKeys = useCallback(async () => {
        setIsApiKeysLoading(true);
        try {
            const updatedKeys = await ProjectApiKeyController.list(
                organizationId,
                projectId,
            );
            setApiKeys(updatedKeys);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error fetching API keys",
            );
        } finally {
            setIsApiKeysLoading(false);
        }
    }, [organizationId, projectId]);

    const handleOpenApiKeysModal = useCallback(() => {
        setIsApiKeysModalOpen(true);
        refreshApiKeys();
    }, [refreshApiKeys]);

    const handleCreateApiKey = useCallback(
        async (memberId: string) => {
            setIsCreatingApiKey(true);
            try {
                const result = await ProjectApiKeyController.create(
                    organizationId,
                    projectId,
                    { targetMemberId: memberId },
                );
                toast.success("API key created");
                setApiKeys((prev) => [
                    {
                        id: result.id,
                        projectId: result.projectId,
                        memberId: result.memberId,
                        apiKeySecret: result.apiKeySecret,
                        lastUsedAt: result.lastUsedAt ?? "",
                        createdAt: result.createdAt,
                        fullKey: result.apiKeySecret,
                    },
                    ...prev,
                ]);
                setIsCreateModalOpen(false);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Error creating API key",
                );
            } finally {
                setIsCreatingApiKey(false);
            }
        },
        [organizationId, projectId],
    );

    const handleRevokeApiKey = useCallback(
        async (apiKeyId: string) => {
            setApiKeys((prev) => prev.filter((k) => k.id !== apiKeyId));
            try {
                await ProjectApiKeyController.revoke(
                    organizationId,
                    projectId,
                    apiKeyId,
                );
            } catch (error) {
                await refreshApiKeys();
                throw error;
            }
        },
        [organizationId, projectId, refreshApiKeys],
    );

    return {
        apiKeys,
        isApiKeysLoading,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isApiKeysModalOpen,
        setIsApiKeysModalOpen,
        isCreatingApiKey,
        handleOpenApiKeysModal,
        handleCreateApiKey,
        handleRevokeApiKey,
    };
}
