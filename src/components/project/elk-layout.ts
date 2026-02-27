import type { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk-api";
import type {
    FrainNodeJSON,
    FrainRelationJSON,
    NodeType,
} from "@/services/c4models/types";

// Create a singleton ELK instance on demand, avoiding SSR execution.
let elkInstance: ELK | null = null;

function getElk(): ELK {
    if (!elkInstance) {
        // Check if we're in the client (browser)
        if (typeof window !== "undefined" && typeof Worker !== "undefined") {
            elkInstance = new ELK({
                workerFactory: () =>
                    new Worker(
                        new URL("elkjs/lib/elk-worker.min.js", import.meta.url),
                    ),
            });
        } else {
            // Fallback for SSR environments
            elkInstance = new ELK();
        }
    }
    return elkInstance;
}

const NODE_WIDTH: Record<NodeType, number> = {
    PERSON: 200,
    SYSTEM: 240,
    EXTERNAL_SYSTEM: 240,
    DATABASE: 200,
    WEB_APP: 220,
    CONTAINER: 220,
    COMPONENT: 200,
};

const NODE_HEIGHT: Record<NodeType, number> = {
    PERSON: 170,
    SYSTEM: 120,
    EXTERNAL_SYSTEM: 120,
    DATABASE: 140,
    WEB_APP: 140,
    CONTAINER: 120,
    COMPONENT: 120,
};

const DEFAULT_LABEL_BG_PADDING: [number, number] = [8, 4];

const DEFAULT_MARKER_END = {
    type: "arrowclosed",
    color: "var(--edge-arrow)",
    width: 20,
    height: 20,
} as const;

const DEFAULT_EDGE_STYLE = {
    stroke: "var(--edge-stroke)",
    strokeWidth: 0.75,
    strokeDasharray: "5 5",
};

const DEFAULT_LABEL_STYLE = {
    fontSize: 11,
    fill: "var(--edge-label)",
    fontWeight: 500,
};

const DEFAULT_LABEL_BG_STYLE = {
    fill: "hsl(var(--background))",
    fillOpacity: 1,
};
// --------------------------------------------------------------------------------

export interface C4NodeData {
    label: string;
    description: string;
    technology: string;
    nodeType: NodeType;
    viewId?: string;
    [key: string]: unknown;
}

export interface LayoutResult {
    nodes: Node<C4NodeData>[];
    edges: Edge[];
}

const WRAPPER_PADDING = 40;
export const GROUP_WRAPPER_ID = "__group-wrapper__";

function hasPositions(nodes: FrainNodeJSON[]): boolean {
    return nodes.every(
        (n) => n.x !== undefined && n.x !== 0 && n.y !== undefined && n.y !== 0,
    );
}

function toReactFlowNode(
    node: FrainNodeJSON,
    position: { x: number; y: number },
): Node<C4NodeData> {
    return {
        id: node.id,
        type: `c4-${node.type.toLowerCase().replace("_", "-")}`,
        position,
        data: {
            label: node.name,
            description: node.description,
            technology: node.technology,
            nodeType: node.type,
            viewId: node.viewId,
        },
        width: NODE_WIDTH[node.type],
        height: NODE_HEIGHT[node.type],
    };
}

function toReactFlowEdge(relation: FrainRelationJSON, index: number): Edge {
    return {
        id: `e-${relation.sourceId}-${relation.targetId}-${index}`,
        source: relation.sourceId,
        target: relation.targetId,
        label: relation.description,
        type: "floating",
        animated: false,
        markerEnd: DEFAULT_MARKER_END,
        style: DEFAULT_EDGE_STYLE,
        labelStyle: DEFAULT_LABEL_STYLE,
        labelBgStyle: DEFAULT_LABEL_BG_STYLE,
        labelBgPadding: DEFAULT_LABEL_BG_PADDING,
        labelBgBorderRadius: 4,
    };
}

export function buildGroupWrapperNode(internalNodes: Node[]): Node | null {
    if (internalNodes.length === 0) return null;

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const n of internalNodes) {
        const x = n.position.x;
        const y = n.position.y;
        const w = (n.width as number) ?? 200;
        const h = (n.height as number) ?? 120;

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x + w > maxX) maxX = x + w;
        if (y + h > maxY) maxY = y + h;
    }

    const wrapX = minX - WRAPPER_PADDING;
    const wrapY = minY - WRAPPER_PADDING;
    const wrapW = maxX - minX + WRAPPER_PADDING * 2;
    const wrapH = maxY - minY + WRAPPER_PADDING * 2;

    return {
        id: GROUP_WRAPPER_ID,
        type: "c4-group-wrapper",
        position: { x: wrapX, y: wrapY },
        selectable: false,
        draggable: false,
        connectable: false,
        focusable: false,
        zIndex: -1,
        data: { width: wrapW, height: wrapH },
        width: wrapW,
        height: wrapH,
        style: { pointerEvents: "none" },
    };
}

export async function layoutNodes(
    nodes: FrainNodeJSON[],
    externalNodes: FrainNodeJSON[],
    relations: FrainRelationJSON[],
): Promise<LayoutResult> {
    const allNodes = [...nodes, ...externalNodes];
    const edges = relations.map((r, i) => toReactFlowEdge(r, i));

    if (hasPositions(allNodes)) {
        const rfNodes = allNodes.map((n) =>
            toReactFlowNode(n, { x: n.x ?? 0, y: n.y ?? 0 }),
        );
        const internalRfNodes = rfNodes.filter((n) =>
            nodes.some((orig) => orig.id === n.id),
        );
        const wrapper = buildGroupWrapperNode(internalRfNodes);
        return {
            nodes: (wrapper
                ? [wrapper, ...rfNodes]
                : rfNodes) as Node<C4NodeData>[],
            edges,
        };
    }

    const elkGraph = {
        id: "root",
        layoutOptions: {
            "elk.algorithm": "layered",
            "elk.direction": "DOWN",
            "elk.spacing.nodeNode": "80",
            "elk.layered.spacing.nodeNodeBetweenLayers": "100",
            "elk.padding": "[top=50,left=50,bottom=50,right=50]",
        },
        children: allNodes.map((n) => ({
            id: n.id,
            width: NODE_WIDTH[n.type],
            height: NODE_HEIGHT[n.type],
        })),
        edges: relations.map((r, i) => ({
            id: `elk-e-${i}`,
            sources: [r.sourceId],
            targets: [r.targetId],
        })),
    };

    const elk = getElk();
    const layoutedGraph = await elk.layout(elkGraph);

    const rfNodes = allNodes.map((n) => {
        const elkNode = layoutedGraph.children?.find((c) => c.id === n.id);
        return toReactFlowNode(n, {
            x: elkNode?.x ?? 0,
            y: elkNode?.y ?? 0,
        });
    });

    const internalRfNodes = rfNodes.filter((n) =>
        nodes.some((orig) => orig.id === n.id),
    );
    const wrapper = buildGroupWrapperNode(internalRfNodes);

    return {
        nodes: (wrapper
            ? [wrapper, ...rfNodes]
            : rfNodes) as Node<C4NodeData>[],
        edges,
    };
}
