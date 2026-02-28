"use client";

import {
    Background,
    BackgroundVariant,
    type Edge,
    type Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
    Panel,
    useReactFlow,
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
import {
    ViewType,
    type C4ModelResponse,
    type ViewDetailResponse,
    type ViewSummaryResponse,
} from "@/services/c4models/types";
import { MemberController } from "@/services/members/controller";
import { type MemberResponse, MemberRole } from "@/services/members/types";
import { ProjectApiKeyController } from "@/services/project-api-keys/controller";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Focus, Layout } from "lucide-react";

const PERSIST_DEBOUNCE_MS = 600;

const edgeTypes = { floating: FloatingEdge };

// Static objects to prevent unnecessary ReactFlow re-renders
const FIT_VIEW_OPTIONS = { padding: 0.2, duration: 800 };
const PRO_OPTIONS = { hideAttribution: true };

// Canvas action panel
function FlowActions({ onRelayout }: { onRelayout: () => Promise<void> }) {
    const { fitView } = useReactFlow();

    const onLayoutClick = async () => {
        await onRelayout();
        requestAnimationFrame(() => {
            fitView(FIT_VIEW_OPTIONS);
        });
    };

    return (
        <Panel position="bottom-right" className="flex gap-2">
            <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => fitView(FIT_VIEW_OPTIONS)}
                title="Center view"
            >
                <Focus />
            </Button>
            <Button
                variant={"secondary"}
                size={"icon"}
                onClick={onLayoutClick}
                title="Layout nodes"
            >
                <Layout />
            </Button>
        </Panel>
    );
}

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
    const [apiKeys, setApiKeys] = useState<ApiKeyWithFull[]>(initialApiKeys);
    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApiKeysLoading, setIsApiKeysLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);
    const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentViewId = searchParams.get("view");

    const internalNodeIdsRef = useRef<Set<string>>(new Set());
    const activeViewIdRef = useRef<string | null>(
        currentViewId ?? initialViews[0]?.id ?? null,
    );

    const currentViewDetailRef = useRef<ViewDetailResponse | null>(null);

    const currentUserRole = useMemo<MemberRole>(() => {
        const member = members.find((m) => m.userId === currentUserId);
        return (member?.memberRole as MemberRole) ?? MemberRole.CONTRIBUTOR;
    }, [members, currentUserId]);

    const canAccessApiKeys = canViewAllKeys(currentUserRole);

    const updateParam = useCallback(
        (viewId: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", viewId);
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, router],
    );

    const loadView = useCallback(
        async (viewId: string) => {
            setIsLoading(true);
            try {
                const viewDetail = await C4ModelController.getViewDetail(
                    projectId,
                    viewId,
                );

                currentViewDetailRef.current = viewDetail;

                const result = await layoutNodes(
                    viewDetail.nodes,
                    viewDetail.externalNodes,
                    viewDetail.relations,
                    false,
                    viewDetail.type,
                );

                internalNodeIdsRef.current = new Set(
                    viewDetail.nodes.map((n) => n.id),
                );
                activeViewIdRef.current = viewId;

                setNodes(result.nodes);
                setEdges(result.edges);
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

    const handleRelayout = useCallback(async () => {
        if (!currentViewDetailRef.current) return;
        const viewId = activeViewIdRef.current;

        setIsLoading(true);
        try {
            const {
                nodes: rawNodes,
                externalNodes,
                relations,
                type: viewType,
            } = currentViewDetailRef.current;

            const result = await layoutNodes(
                rawNodes,
                externalNodes,
                relations,
                true,
                viewType,
            );

            setNodes(result.nodes);
            setEdges(result.edges);

            if (viewId) {
                const updatePromises = result.nodes
                    .filter(
                        (n) =>
                            n.id !== GROUP_WRAPPER_ID &&
                            internalNodeIdsRef.current.has(n.id),
                    )
                    .map((n) =>
                        C4ModelController.updateNodePosition(
                            projectId,
                            viewId,
                            n.id,
                            {
                                x: Math.round(n.position.x),
                                y: Math.round(n.position.y),
                            },
                        ).catch((err) =>
                            console.error("Error saving node position:", err),
                        ),
                    );

                await Promise.all(updatePromises);
                toast.success("Layout actualizado y guardado");
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error applying layout",
            );
        } finally {
            setIsLoading(false);
        }
    }, [projectId, setNodes, setEdges]);

    // Load initial view
    useEffect(() => {
        const viewToLoad = currentViewId ?? initialViews[0]?.id;

        if (viewToLoad) {
            loadView(viewToLoad);
            return;
        }

        const firstEmbeddedView = c4Model?.c4Model?.views?.[0];
        if (firstEmbeddedView) {
            layoutNodes(
                firstEmbeddedView.nodes,
                firstEmbeddedView.externalNodes,
                firstEmbeddedView.relations,
                firstEmbeddedView.type !== ViewType.CONTEXT,
                firstEmbeddedView.type,
            )
                .then((result) => {
                    internalNodeIdsRef.current = new Set(
                        firstEmbeddedView.nodes.map((n) => n.id),
                    );
                    activeViewIdRef.current = firstEmbeddedView.id;
                    setNodes(result.nodes);
                    setEdges(result.edges);
                })
                .finally(() => setIsLoading(false));
            return;
        }

        setIsLoading(false);
    }, [initialViews, c4Model, setNodes, setEdges, loadView, currentViewId]);

    // Load organization members
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

    const handleNodeDrag = useCallback(
        (_event: React.MouseEvent, draggedNode: Node<C4NodeData>) => {
            setNodes((currentNodes) => {
                const internalNodes: Node[] = [];
                let currentWrapper: Node | null = null;

                for (const n of currentNodes) {
                    if (n.id === GROUP_WRAPPER_ID) {
                        currentWrapper = n;
                    } else if (internalNodeIdsRef.current.has(n.id)) {
                        internalNodes.push(
                            n.id === draggedNode.id ? draggedNode : n,
                        );
                    }
                }

                const updatedWrapper = buildGroupWrapperNode(
                    internalNodes as Node<C4NodeData>[],
                );
                if (!updatedWrapper || !currentWrapper) return currentNodes;

                const unchanged =
                    currentWrapper.position.x === updatedWrapper.position.x &&
                    currentWrapper.position.y === updatedWrapper.position.y &&
                    currentWrapper.width === updatedWrapper.width &&
                    currentWrapper.height === updatedWrapper.height;

                if (unchanged) return currentNodes;

                return currentNodes.map((n) =>
                    n.id === GROUP_WRAPPER_ID ? updatedWrapper : n,
                ) as Node<C4NodeData>[];
            });
        },
        [setNodes],
    );

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

    const handleViewClick = useCallback(
        (viewId: string) => {
            updateParam(viewId);
            loadView(viewId);
        },
        [updateParam, loadView],
    );

    const refreshApiKeys = useCallback(async (): Promise<void> => {
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
    }, [organizationId, projectId]);

    const handleOpenApiKeysModal = useCallback((): void => {
        setIsApiKeysModalOpen(true);
        refreshApiKeys();
    }, [refreshApiKeys]);

    const handleCreateApiKey = useCallback(
        async (memberId: string): Promise<void> => {
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

                setApiKeys((prev) => [
                    {
                        id: result.id,
                        projectId: result.projectId,
                        memberId: result.memberId,
                        apiKeySecret: result.apiKeySecret.slice(0, 8),
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
                        : "An unexpected error occurred",
                );
            } finally {
                setIsCreatingApiKey(false);
            }
        },
        [organizationId, projectId],
    );

    const handleRevokeApiKey = useCallback(
        async (apiKeyId: string): Promise<void> => {
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

    return (
        <div className="relative h-full w-full">
            <ProjectSidebar
                projectId={projectId}
                modelTitle={c4Model?.c4Model?.title ?? "Untitled"}
                views={initialViews}
                activeViewId={currentViewId ?? initialViews[0]?.id ?? null}
                onViewSelect={handleViewClick}
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
                onCreateApiKey={() => setIsCreateModalOpen(true)}
                onRevokeApiKey={handleRevokeApiKey}
                isLoading={isApiKeysLoading}
                projectId={projectId}
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
                fitViewOptions={FIT_VIEW_OPTIONS}
                minZoom={0.1}
                maxZoom={2}
                proOptions={PRO_OPTIONS}
            >
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={50}
                    size={1}
                />

                <FlowActions onRelayout={handleRelayout} />
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
