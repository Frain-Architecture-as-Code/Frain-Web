import { useCallback, useEffect, useRef, useState } from "react";
import {
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
} from "@xyflow/react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { C4ModelController } from "@/services/c4models/controller";
import {
    buildGroupWrapperNode,
    layoutNodes,
    GROUP_WRAPPER_ID,
    type C4NodeData,
} from "@/components/project/elk-layout";
import {
    ViewType,
    type C4ModelResponse,
    type ViewDetailResponse,
    type ViewSummaryResponse,
} from "@/services/c4models/types";
import {
    PERSIST_DEBOUNCE_MS,
    resolveAgainstWrapper,
} from "@/components/project/canva-utils";

export function useDiagramLayout(
    projectId: string,
    initialViews: ViewSummaryResponse[],
    c4Model: C4ModelResponse | null,
    currentViewId: string | null,
) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<C4NodeData>>(
        [],
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isLoading, setIsLoading] = useState(true);

    const internalNodeIdsRef = useRef<Set<string>>(new Set());
    const activeViewIdRef = useRef<string | null>(
        currentViewId ?? initialViews[0]?.id ?? null,
    );
    const currentViewDetailRef = useRef<ViewDetailResponse | null>(null);

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

    // On Mount
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

                if (!internalNodeIdsRef.current.has(draggedNode.id)) {
                    if (!currentWrapper) return currentNodes;
                    const corrected = resolveAgainstWrapper(
                        draggedNode,
                        currentWrapper,
                    );
                    if (!corrected) return currentNodes;
                    return currentNodes.map((n) =>
                        n.id === draggedNode.id
                            ? { ...n, position: corrected }
                            : n,
                    ) as Node<C4NodeData>[];
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

            setNodes((currentNodes) => {
                const current = currentNodes.find((n) => n.id === node.id);
                if (!current) return currentNodes;

                if (!internalNodeIdsRef.current.has(node.id)) {
                    const wrapper = currentNodes.find(
                        (n) => n.id === GROUP_WRAPPER_ID,
                    );
                    const finalPos = wrapper
                        ? (resolveAgainstWrapper(
                              current as Node<C4NodeData>,
                              wrapper,
                          ) ?? current.position)
                        : current.position;

                    persistNodePosition(
                        node.id,
                        Math.round(finalPos.x),
                        Math.round(finalPos.y),
                    );

                    if (finalPos !== current.position) {
                        return currentNodes.map((n) =>
                            n.id === node.id ? { ...n, position: finalPos } : n,
                        ) as Node<C4NodeData>[];
                    }

                    return currentNodes;
                }

                persistNodePosition(
                    node.id,
                    Math.round(current.position.x),
                    Math.round(current.position.y),
                );
                return currentNodes;
            });
        },
        [persistNodePosition, setNodes],
    );

    return {
        nodes,
        edges,
        isLoading,
        onNodesChange,
        onEdgesChange,
        handleRelayout,
        handleNodeDrag,
        handleNodeDragStop,
        loadView,
    };
}
