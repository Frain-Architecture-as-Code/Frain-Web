import type { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import type {
    FrainNodeJSON,
    FrainRelationJSON,
    NodeType,
} from "@/services/c4models/types";

const elk = new ELK();

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
        type: "straight",
        animated: false,
        markerEnd: {
            type: "arrowclosed",
            color: "#ffffff",
            width: 20,
            height: 20,
        },
        style: {
            stroke: "#C5C5C5",
            strokeWidth: 0.5,
        },
        labelStyle: {
            fontSize: 11,
            fill: "#ffffff",
            fontWeight: 500,
        },
        labelBgStyle: {
            fill: "#141414",
            fillOpacity: 1,
        },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 4,
    };
}

export async function layoutNodes(
    nodes: FrainNodeJSON[],
    externalNodes: FrainNodeJSON[],
    relations: FrainRelationJSON[],
): Promise<LayoutResult> {
    const allNodes = [...nodes, ...externalNodes];
    const edges = relations.map((r, i) => toReactFlowEdge(r, i));

    // If all nodes already have positions, use them directly
    if (hasPositions(allNodes)) {
        const rfNodes = allNodes.map((n) =>
            toReactFlowNode(n, { x: n.x ?? 0, y: n.y ?? 0 }),
        );
        return { nodes: rfNodes, edges };
    }

    // Use ELK for auto-layout
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

    const layoutedGraph = await elk.layout(elkGraph);

    const rfNodes = allNodes.map((n) => {
        const elkNode = layoutedGraph.children?.find((c) => c.id === n.id);
        return toReactFlowNode(n, {
            x: elkNode?.x ?? 0,
            y: elkNode?.y ?? 0,
        });
    });

    return { nodes: rfNodes, edges };
}
