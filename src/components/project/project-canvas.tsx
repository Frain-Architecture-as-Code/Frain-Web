"use client";

import {
    Background,
    BackgroundVariant,
    Controls,
    type Edge,
    MiniMap,
    type Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { c4NodeTypes } from "@/components/project/c4-nodes";
import { type C4NodeData, layoutNodes } from "@/components/project/elk-layout";
import { ProjectSidebar } from "@/components/project/project-sidebar";
import { C4ModelController } from "@/services/c4models/controller";
import type {
    C4ModelResponse,
    ViewDetailResponse,
    ViewSummaryResponse,
} from "@/services/c4models/types";
import { ProjectApiKeyController } from "@/services/project-api-keys/controller";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

interface ProjectCanvasProps {
    projectId: string;
    organizationId: string;
    c4Model: C4ModelResponse;
    initialViews: ViewSummaryResponse[];
    initialApiKeys: ProjectApiKeyResponse[];
}

export function ProjectCanvas({
    projectId,
    organizationId,
    c4Model,
    initialViews,
    initialApiKeys,
}: ProjectCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<C4NodeData>>(
        [],
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [views] = useState<ViewSummaryResponse[]>(initialViews);
    const [activeViewId, setActiveViewId] = useState<string | null>(
        initialViews[0]?.id ?? null,
    );
    const [apiKeys, setApiKeys] =
        useState<ProjectApiKeyResponse[]>(initialApiKeys);
    const [isLoading, setIsLoading] = useState(true);

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

        const firstEmbeddedView = c4Model.c4Model.views[0];
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

        setIsLoading(false);
    }, [initialViews, c4Model, setNodes, setEdges]);

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
    async function handleCreateApiKey(): Promise<void> {
        try {
            const result = await ProjectApiKeyController.create(
                organizationId,
                projectId,
                { targetMemberId: "" },
            );
            toast.success("API key created", {
                description: `Key: ${result.apiKey}`,
                duration: 10000,
            });
            const updatedKeys = await ProjectApiKeyController.list(
                organizationId,
                projectId,
            );
            setApiKeys(updatedKeys);
        } catch {
            toast.error("Failed to create API key");
        }
    }

    async function handleRevokeApiKey(apiKeyId: string): Promise<void> {
        try {
            await ProjectApiKeyController.revoke(
                organizationId,
                projectId,
                apiKeyId,
            );
            setApiKeys((prev) => prev.filter((k) => k.id !== apiKeyId));
            toast.success("API key revoked");
        } catch {
            toast.error("Failed to revoke API key");
        }
    }

    return (
        <div className="relative h-full w-full">
            <ProjectSidebar
                projectId={projectId}
                modelTitle={c4Model.c4Model?.title || "Untitled"}
                views={views}
                activeViewId={activeViewId}
                onViewSelect={loadView}
                apiKeys={apiKeys}
                onCreateApiKey={handleCreateApiKey}
                onRevokeApiKey={handleRevokeApiKey}
            />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDragStop={handleNodeDragStop}
                nodeTypes={c4NodeTypes}
                colorMode="dark"
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="hsl(var(--muted-foreground) / 0.15)"
                />
                <Controls
                    position="bottom-right"
                    showInteractive={false}
                    className="!bg-background/80 !border-border !shadow-sm [&>button]:!bg-background [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted"
                />
                <MiniMap
                    position="bottom-left"
                    className="!bg-background/80 !border-border !shadow-sm"
                    maskColor="hsl(var(--background) / 0.6)"
                    nodeColor="hsl(var(--primary) / 0.4)"
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
        </div>
    );
}
