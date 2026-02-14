import type { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import type {
    FrainNodeJSON,
    FrainRelationJSON,
    NodeType,
} from "@/services/c4models/types";

const elk = new ELK();

const NODE_WIDTH: Record<NodeType, number> = {
    PERSON: 160,
    SYSTEM: 220,
    EXTERNAL_SYSTEM: 220,
    DATABASE: 180,
    WEB_APP: 200,
    CONTAINER: 200,
    COMPONENT: 180,
};

const NODE_HEIGHT: Record<NodeType, number> = {
    PERSON: 120,
    SYSTEM: 100,
    EXTERNAL_SYSTEM: 100,
    DATABASE: 100,
    WEB_APP: 100,
    CONTAINER: 100,
    COMPONENT: 80,
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
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1.5 },
        labelStyle: {
            fontSize: 11,
            fill: "hsl(var(--muted-foreground))",
        },
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
