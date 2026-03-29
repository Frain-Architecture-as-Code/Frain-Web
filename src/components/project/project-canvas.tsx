"use client";

import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import "@xyflow/react/dist/style.css";

import { ApiKeysSheet } from "@/components/project/api-keys-sheet";
import { c4NodeTypes } from "@/components/project/c4-nodes";
import { CreateApiKeyModal } from "@/components/project/create-api-key-modal";
import { FloatingEdge } from "@/components/project/floating-edge";
import { ProjectSidebar } from "@/components/project/project-sidebar";
import { useDiagramLayout } from "@/hooks/use-diagram-layout";

import { useProjectApiKeys } from "@/hooks/use-project-api-keys";
import { useProjectMembers } from "@/hooks/use-project-members";
import { FlowActions } from "./flow-actions";

const edgeTypes = { floating: FloatingEdge };

interface ProjectCanvasProps {
    projectId: string;
    organizationId: string;
    currentUserId: string;
    c4Model: any;
    initialViews: any[];
    initialApiKeys: any[];
}

export function ProjectCanvas({
    projectId,
    organizationId,
    currentUserId,
    c4Model,
    initialViews,
    initialApiKeys,
}: ProjectCanvasProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentViewId = searchParams.get("view");

    // 1. Hook de Miembros y Permisos
    const { members, currentUserRole, canAccessApiKeys } = useProjectMembers(
        organizationId,
        currentUserId,
    );

    // 2. Hook de API Keys
    const apiKeysData = useProjectApiKeys(
        organizationId,
        projectId,
        initialApiKeys,
    );

    // 3. Hook de Layout y Lógica de ReactFlow
    const {
        nodes,
        edges,
        isLoading,
        onNodesChange,
        onEdgesChange,
        handleRelayout,
        handleNodeDrag,
        handleNodeDragStop,
        loadView,
    } = useDiagramLayout(projectId, initialViews, c4Model, currentViewId);

    // Manejo de URL
    const updateParam = useCallback(
        (viewId: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", viewId);
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, router],
    );

    const handleViewClick = useCallback(
        (viewId: string) => {
            updateParam(viewId);
            loadView(viewId);
        },
        [updateParam, loadView],
    );

    return (
        <div className="relative h-full w-full">
            <ProjectSidebar
                projectId={projectId}
                orgId={organizationId}
                modelTitle={c4Model?.c4Model?.title ?? "Untitled"}
                views={initialViews}
                activeViewId={currentViewId ?? initialViews[0]?.id ?? null}
                onViewSelect={handleViewClick}
                canAccessApiKeys={canAccessApiKeys}
                onOpenApiKeysModal={apiKeysData.handleOpenApiKeysModal}
            />

            <ApiKeysSheet
                open={apiKeysData.isApiKeysModalOpen}
                onOpenChange={apiKeysData.setIsApiKeysModalOpen}
                apiKeys={apiKeysData.apiKeys}
                members={members}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                onCreateApiKey={() => apiKeysData.setIsCreateModalOpen(true)}
                onRevokeApiKey={apiKeysData.handleRevokeApiKey}
                isLoading={apiKeysData.isApiKeysLoading}
                projectId={projectId}
            />

            <CreateApiKeyModal
                open={apiKeysData.isCreateModalOpen}
                onOpenChange={apiKeysData.setIsCreateModalOpen}
                members={members}
                currentUserRole={currentUserRole}
                onCreateApiKey={apiKeysData.handleCreateApiKey}
                isLoading={apiKeysData.isCreatingApiKey}
            />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDrag={handleNodeDrag}
                onNodeDragStop={handleNodeDragStop}
                nodeTypes={c4NodeTypes}
                edgeTypes={edgeTypes}
                minZoom={0.1}
                maxZoom={2}
            >
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={50}
                    size={1}
                />
                <FlowActions onRelayout={handleRelayout} />
            </ReactFlow>

            {/* Overlays (Loading / Empty State) */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Loading diagram...
                    </div>
                </div>
            )}

            {!isLoading && nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium">
                            No views available
                        </p>
                        <p className="mt-1 text-sm">
                            {c4Model === null
                                ? "C4 model not found"
                                : "Create a view to visualize your architecture"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
