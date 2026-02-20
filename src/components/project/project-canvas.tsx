"use client";

import {
    Background,
    BackgroundVariant,
    type ColorMode,
    Controls,
    type Edge,
    MiniMap,
    type Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    ApiKeysSheet,
    type ApiKeyWithFull,
} from "@/components/project/api-keys-sheet";
import { c4NodeTypes } from "@/components/project/c4-nodes";
import { useCanvasThemeStore } from "@/components/project/canvas-theme-store";
import { CreateApiKeyModal } from "@/components/project/create-api-key-modal";
import { type C4NodeData, layoutNodes } from "@/components/project/elk-layout";
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

// Edge colour tokens — defined here so the canvas owns edge theming directly
const EDGE_COLOURS = {
    dark: { stroke: "#C5C5C5", arrow: "#ffffff", label: "#ffffff" },
    light: { stroke: "#1A1A1A", arrow: "#1A1A1A", label: "#1A1A1A" },
} as const;

interface ProjectCanvasProps {
    projectId: string;
    organizationId: string;
    currentUserId: string;
    c4Model: C4ModelResponse | null;
    initialViews: ViewSummaryResponse[];
    initialApiKeys: ProjectApiKeyResponse[];
}

const edgeTypes = {
    floating: FloatingEdge,
};

// MiniMap node colours mirror each shape's own COLOURS object
const MINIMAP_COLOURS = {
    dark: {
        PERSON: "#003668",
        SYSTEM: "#0055A4",
        EXTERNAL_SYSTEM: "#81788A",
        DATABASE: "#438DD5",
        WEB_APP: "#438DD5",
        CONTAINER: "#0097D1",
        COMPONENT: "#50B5ED",
    },
    light: {
        PERSON: "#D4E5F7",
        SYSTEM: "#C7DEFF",
        EXTERNAL_SYSTEM: "#E8E4EE",
        DATABASE: "#BFD9F5",
        WEB_APP: "#BFD9F5",
        CONTAINER: "#B3EAF9",
        COMPONENT: "#C5EAF8",
    },
} as const;

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

    // resolvedTheme is always "light" or "dark" — never "system"
    // Fall back to "dark" while next-themes is still hydrating (undefined)
    const { resolvedTheme } = useTheme();
    const canvasTheme = (resolvedTheme === "light" ? "light" : "dark") as
        | "dark"
        | "light";

    const setTheme = useCanvasThemeStore((s) => s.setTheme);

    // Keep the zustand store in sync with next-themes
    useEffect(() => {
        setTheme(canvasTheme);
    }, [canvasTheme, setTheme]);

    // Re-colour edges whenever the canvas theme changes
    useEffect(() => {
        const c = EDGE_COLOURS[canvasTheme];
        setEdges((prev) =>
            prev.map((edge) => {
                const prevMarker =
                    typeof edge.markerEnd === "object" &&
                    edge.markerEnd !== null
                        ? edge.markerEnd
                        : {
                              type: "arrowclosed" as const,
                              width: 20,
                              height: 20,
                          };
                return {
                    ...edge,
                    markerEnd: {
                        ...prevMarker,
                        type: prevMarker.type ?? ("arrowclosed" as const),
                        color: c.arrow,
                    },
                    style: { ...edge.style, stroke: c.stroke },
                    labelStyle: { ...edge.labelStyle, fill: c.label },
                };
            }),
        );
    }, [canvasTheme, setEdges]);

    // Derive current user's role from members array
    const currentUserRole = useMemo<MemberRole>(() => {
        const currentMember = members.find((m) => m.userId === currentUserId);
        return (
            (currentMember?.memberRole as MemberRole) || MemberRole.CONTRIBUTOR
        );
    }, [members, currentUserId]);

    // Check if user can access API keys management
    const canAccessApiKeys = canViewAllKeys(currentUserRole);

    // Load a specific view's detail and layout
    async function loadView(viewId: string): Promise<void> {
        setIsLoading(true);
        try {
            const viewDetail: ViewDetailResponse =
                await C4ModelController.getViewDetail(projectId, viewId);

            const result = await layoutNodes(
                viewDetail.nodes,
                viewDetail.externalNodes,
                viewDetail.relations,
            );

            setNodes(result.nodes);
            setEdges(result.edges);
            setActiveViewId(viewId);
        } catch {
            toast.error("Failed to load view");
        } finally {
            setIsLoading(false);
        }
    }

    // Load the first view on mount
    // biome-ignore lint/correctness/useExhaustiveDependencies: loadView is intentionally excluded to avoid infinite re-renders — it depends on state setters that change on every render
    useEffect(() => {
        const firstViewId = initialViews[0]?.id;
        if (firstViewId) {
            loadView(firstViewId);
            return;
        }

        // Fallback to embedded views if c4Model exists
        const firstEmbeddedView = c4Model?.c4Model?.views?.[0];
        if (firstEmbeddedView) {
            layoutNodes(
                firstEmbeddedView.nodes,
                firstEmbeddedView.externalNodes,
                firstEmbeddedView.relations,
            )
                .then((result) => {
                    setNodes(result.nodes);
                    setEdges(result.edges);
                    setActiveViewId(firstEmbeddedView.id);
                })
                .finally(() => setIsLoading(false));
            return;
        }

        // No views available - just stop loading
        setIsLoading(false);
    }, [initialViews, c4Model, setNodes, setEdges]);

    // Load organization members on mount
    useEffect(() => {
        MemberController.getAll(organizationId)
            .then(setMembers)
            .catch(() => {
                toast.error("Failed to load organization members");
            });
    }, [organizationId]);

    // Persist node position on drag end
    function handleNodeDragStop(
        _event: React.MouseEvent,
        node: Node<C4NodeData>,
    ): void {
        if (!activeViewId) return;

        C4ModelController.updateNodePosition(projectId, activeViewId, node.id, {
            x: Math.round(node.position.x),
            y: Math.round(node.position.y),
        }).catch(() => {
            toast.error("Failed to save node position");
        });
    }

    // API key handlers
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
        } catch {
            toast.error("Failed to load API keys");
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
                description: `Key: ${result.apiKey}`,
                duration: 10000,
            });

            const newKeyWithFull: ApiKeyWithFull = {
                id: result.id,
                projectId: result.projectId,
                memberId: result.memberId,
                apiKeyPrefix: result.apiKey.slice(0, 8),
                lastUsedAt: "",
                createdAt: result.createdAt,
                fullKey: result.apiKey,
            };

            setApiKeys((prev) => [newKeyWithFull, ...prev]);
            setIsCreateModalOpen(false);
        } catch {
            toast.error("Failed to create API key");
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
                <MiniMap
                    position="top-right"
                    className="!bg-background/80 !border-border !shadow-sm"
                    maskColor="hsl(var(--background) / 0.6)"
                    nodeColor={(node) => {
                        const nodeType = (node.data as C4NodeData)?.nodeType;
                        return nodeType
                            ? MINIMAP_COLOURS[canvasTheme][nodeType]
                            : MINIMAP_COLOURS[canvasTheme].SYSTEM;
                    }}
                    style={{ marginLeft: "18rem" }}
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
