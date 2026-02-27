"use client";

import {
    Background,
    BackgroundVariant,
    Controls,
    type Edge,
    type Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import {
    ApiKeysSheet,
    type ApiKeyWithFull,
} from "@/components/project/api-keys-sheet";
import { c4NodeTypes } from "@/components/project/c4-nodes";
import { CreateApiKeyModal } from "@/components/project/create-api-key-modal";
import {
    buildGroupWrapperNode,
    type C4NodeData,
    GROUP_WRAPPER_ID,
    layoutNodes,
} from "@/components/project/elk-layout";
import { FloatingEdge } from "@/components/project/floating-edge";
import { ProjectSidebar } from "@/components/project/project-sidebar";
import { canViewAllKeys } from "@/lib/permissions";
import { C4ModelController } from "@/services/c4models/controller";
import type {
    C4ModelResponse,
    ViewDetailResponse,
    ViewSummaryResponse,
} from "@/services/c4models/types";
import { MemberController } from "@/services/members/controller";
import { type MemberResponse, MemberRole } from "@/services/members/types";
import { ProjectApiKeyController } from "@/services/project-api-keys/controller";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

const PERSIST_DEBOUNCE_MS = 600;

const edgeTypes = {
    floating: FloatingEdge,
};

interface ProjectCanvasProps {
    projectId: string;
    organizationId: string;
    currentUserId: string;
    c4Model: C4ModelResponse | null;
    initialViews: ViewSummaryResponse[];
    initialApiKeys: ProjectApiKeyResponse[];
}

export function ProjectCanvas({
    projectId,
    organizationId,
    currentUserId,
    c4Model,
    initialViews,
    initialApiKeys,
}: ProjectCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<C4NodeData>>(
        [],
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const views = initialViews;
    const [activeViewId, setActiveViewId] = useState<string | null>(
        initialViews[0]?.id ?? null,
    );

    const [apiKeys, setApiKeys] = useState<ApiKeyWithFull[]>(initialApiKeys);
    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApiKeysLoading, setIsApiKeysLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);
    const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);

    const internalNodeIdsRef = useRef<Set<string>>(new Set());
    const activeViewIdRef = useRef<string | null>(activeViewId);

    useEffect(() => {
        activeViewIdRef.current = activeViewId;
    }, [activeViewId]);

    const currentUserRole = useMemo<MemberRole>(() => {
        const currentMember = members.find((m) => m.userId === currentUserId);
        return (
            (currentMember?.memberRole as MemberRole) || MemberRole.CONTRIBUTOR
        );
    }, [members, currentUserId]);

    const canAccessApiKeys = canViewAllKeys(currentUserRole);

    const loadView = useCallback(
        async (viewId: string) => {
            setIsLoading(true);
            try {
                const viewDetail: ViewDetailResponse =
                    await C4ModelController.getViewDetail(projectId, viewId);

                const result = await layoutNodes(
                    viewDetail.nodes,
                    viewDetail.externalNodes,
                    viewDetail.relations,
                );

                internalNodeIdsRef.current = new Set(
                    viewDetail.nodes.map((n) => n.id),
                );

                setNodes(result.nodes);
                setEdges(result.edges);
                setActiveViewId(viewId);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [projectId, setNodes, setEdges],
    );

    useEffect(() => {
        const firstViewId = initialViews[0]?.id;
        if (firstViewId) {
            loadView(firstViewId);
            return;
        }

        const firstEmbeddedView = c4Model?.c4Model?.views?.[0];
        if (firstEmbeddedView) {
            layoutNodes(
                firstEmbeddedView.nodes,
                firstEmbeddedView.externalNodes,
                firstEmbeddedView.relations,
            )
                .then((result) => {
                    internalNodeIdsRef.current = new Set(
                        firstEmbeddedView.nodes.map((n) => n.id),
                    );
                    setNodes(result.nodes);
                    setEdges(result.edges);
                    setActiveViewId(firstEmbeddedView.id);
                })
                .finally(() => setIsLoading(false));
            return;
        }

        setIsLoading(false);
    }, [initialViews, c4Model, setNodes, setEdges, loadView]);

    useEffect(() => {
        MemberController.getAll(organizationId)
            .then(setMembers)
            .catch((error: unknown) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred",
                );
            });
    }, [organizationId]);

    const persistNodePosition = useDebouncedCallback(
        (nodeId: string, x: number, y: number) => {
            const viewId = activeViewIdRef.current;
            if (!viewId) return;

            C4ModelController.updateNodePosition(projectId, viewId, nodeId, {
                x,
                y,
            }).catch((error: unknown) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred",
                );
            });
        },
        PERSIST_DEBOUNCE_MS,
    );

    // Maneja la actualización visual del wrapper en tiempo real de forma optimizada
    const handleNodeDrag = useCallback(
        (_event: React.MouseEvent, draggedNode: Node<C4NodeData>) => {
            setNodes((currentNodes) => {
                const internalNodes: Node[] = [];
                let currentWrapper: Node | null = null;

                // En una sola pasada recogemos el wrapper y los nodos internos actualizados
                for (const n of currentNodes) {
                    if (n.id === GROUP_WRAPPER_ID) {
                        currentWrapper = n;
                    } else if (internalNodeIdsRef.current.has(n.id)) {
                        internalNodes.push(
                            n.id === draggedNode.id ? draggedNode : n,
                        );
                    }
                }

                const updatedWrapper = buildGroupWrapperNode(internalNodes);
                if (!updatedWrapper || !currentWrapper) return currentNodes;

                // Bailout: si las dimensiones y posición son idénticas, no re-renderizamos
                if (
                    currentWrapper.position.x === updatedWrapper.position.x &&
                    currentWrapper.position.y === updatedWrapper.position.y &&
                    currentWrapper.width === updatedWrapper.width &&
                    currentWrapper.height === updatedWrapper.height
                ) {
                    return currentNodes;
                }

                // Actualizamos solo el wrapper en el estado de React Flow
                return currentNodes.map((n) =>
                    n.id === GROUP_WRAPPER_ID ? updatedWrapper : n,
                ) as Node<C4NodeData>[];
            });
        },
        [setNodes],
    );

    // Solo se encarga de persistir al soltar el ratón
    const handleNodeDragStop = useCallback(
        (_event: React.MouseEvent, node: Node<C4NodeData>) => {
            if (!activeViewIdRef.current) return;

            persistNodePosition(
                node.id,
                Math.round(node.position.x),
                Math.round(node.position.y),
            );
        },
        [persistNodePosition],
    );

    function handleOpenApiKeysModal(): void {
        setIsApiKeysModalOpen(true);
        refreshApiKeys();
    }

    async function refreshApiKeys(): Promise<void> {
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
                    : "An unexpected error occurred",
            );
        } finally {
            setIsApiKeysLoading(false);
        }
    }

    function handleOpenCreateModal(): void {
        setIsCreateModalOpen(true);
    }

    async function handleCreateApiKey(memberId: string): Promise<void> {
        setIsCreatingApiKey(true);
        try {
            const result = await ProjectApiKeyController.create(
                organizationId,
                projectId,
                { targetMemberId: memberId },
            );
            toast.success("API key created", {
                description: `Key: ${result.apiKeySecret}`,
                duration: 10000,
            });

            const newKeyWithFull: ApiKeyWithFull = {
                id: result.id,
                projectId: result.projectId,
                memberId: result.memberId,
                apiKeySecret: result.apiKeySecret.slice(0, 8),
                lastUsedAt: result.lastUsedAt ?? "",
                createdAt: result.createdAt,
                fullKey: result.apiKeySecret,
            };

            setApiKeys((prev) => [newKeyWithFull, ...prev]);
            setIsCreateModalOpen(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            );
        } finally {
            setIsCreatingApiKey(false);
        }
    }

    async function handleRevokeApiKey(apiKeyId: string): Promise<void> {
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
    }

    return (
        <div className="relative h-full w-full">
            <ProjectSidebar
                projectId={projectId}
                modelTitle={c4Model?.c4Model?.title || "Untitled"}
                views={views}
                activeViewId={activeViewId}
                onViewSelect={loadView}
                canAccessApiKeys={canAccessApiKeys}
                onOpenApiKeysModal={handleOpenApiKeysModal}
            />

            <ApiKeysSheet
                open={isApiKeysModalOpen}
                onOpenChange={setIsApiKeysModalOpen}
                apiKeys={apiKeys}
                members={members}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                onCreateApiKey={handleOpenCreateModal}
                onRevokeApiKey={handleRevokeApiKey}
                isLoading={isApiKeysLoading}
            />

            <CreateApiKeyModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                members={members}
                currentUserRole={currentUserRole}
                onCreateApiKey={handleCreateApiKey}
                isLoading={isCreatingApiKey}
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
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={50}
                    size={1}
                />
                <Controls
                    position="bottom-right"
                    showInteractive={false}
                    className="!bg-background/80 !border-border !shadow-sm [&>button]:!bg-background [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted"
                />
            </ReactFlow>

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
                        <p className="text-sm mt-1">
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
