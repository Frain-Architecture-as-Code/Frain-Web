import type { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk-api";
import type {
    FrainNodeJSON,
    FrainRelationJSON,
    NodeType,
} from "@/services/c4models/types";

// Lazy singleton ELK instance (SSR-safe).
let elkInstance: InstanceType<typeof ELK> | null = null;

function getElk(): InstanceType<typeof ELK> {
    if (!elkInstance) {
        if (typeof window !== "undefined" && typeof Worker !== "undefined") {
            elkInstance = new ELK({
                workerFactory: () =>
                    new Worker(
                        new URL("elkjs/lib/elk-worker.min.js", import.meta.url),
                    ),
            });
        } else {
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

// Layout spacing constants
const NODE_V_GAP = 80;
const WRAPPER_PADDING = 40;
const EXTERNAL_H_GAP = 120;
const EXTERNAL_V_GAP = 60;
const PERSON_TO_CONTAINER_GAP = 60;

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

export const GROUP_WRAPPER_ID = "__group-wrapper__";

function hasPositions(nodes: FrainNodeJSON[]): boolean {
    if (nodes.length === 0) return false;
    const allValidNumbers = nodes.every(
        (n) => typeof n.x === "number" && typeof n.y === "number",
    );
    if (!allValidNumbers) return false;
    return !nodes.every((n) => n.x === 0 && n.y === 0);
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

/**
 * TWO-PHASE GROUPED LAYOUT
 *
 * Phase 1 — Vertical inner group (internal nodes only):
 *   - PERSON nodes: centered horizontally at the top
 *   - Container/System/DB/etc nodes: laid out via ELK (direction=DOWN) below persons
 *   All nodes share a single vertical axis — no horizontal spreading of persons.
 *
 * Phase 2 — Horizontal outer placement:
 *   - Inner group on the left
 *   - EXTERNAL_SYSTEM nodes stacked vertically to the right, centered on inner group height
 */
async function computeGroupedLayout(
    nodes: FrainNodeJSON[],
    externalNodes: FrainNodeJSON[],
    relations: FrainRelationJSON[],
): Promise<Map<string, { x: number; y: number }>> {
    const positions = new Map<string, { x: number; y: number }>();

    const personNodes = nodes.filter((n) => n.type === "PERSON");
    const containerNodes = nodes.filter((n) => n.type !== "PERSON");
    const internalIds = new Set(nodes.map((n) => n.id));

    // Relations only between container-layer nodes (for ELK ordering)
    const containerIds = new Set(containerNodes.map((n) => n.id));
    const containerRelations = relations.filter(
        (r) => containerIds.has(r.sourceId) && containerIds.has(r.targetId),
    );

    // ── Step 1: layout container nodes with ELK (vertical) ───────────────────
    let containerOffsetY = 0;
    let innerGroupW = 0;

    if (containerNodes.length > 0) {
        const elkGraph = {
            id: "root",
            layoutOptions: {
                "elk.algorithm": "layered",
                "elk.direction": "DOWN",
                "elk.spacing.nodeNode": "60",
                "elk.layered.spacing.nodeNodeBetweenLayers": String(NODE_V_GAP),
                "elk.padding": "[top=0,left=0,bottom=0,right=0]",
                "elk.edgeRouting": "ORTHOGONAL",
                "elk.separateConnectedComponents": "false",
                "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
            },
            children: containerNodes.map((n) => ({
                id: n.id,
                width: NODE_WIDTH[n.type],
                height: NODE_HEIGHT[n.type],
            })),
            edges: containerRelations.map((r, i) => ({
                id: `elk-c-${i}`,
                sources: [r.sourceId],
                targets: [r.targetId],
            })),
        };

        const elk = getElk();
        const layouted = await elk.layout(elkGraph);

        // Compute bounding box of container layout to know innerGroupW
        let cMinX = Number.POSITIVE_INFINITY;
        let cMaxX = Number.NEGATIVE_INFINITY;

        for (const child of layouted.children ?? []) {
            const x = child.x ?? 0;
            const w = child.width ?? 0;
            if (x < cMinX) cMinX = x;
            if (x + w > cMaxX) cMaxX = x + w;
            positions.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
        }

        innerGroupW = cMaxX - cMinX;
        containerOffsetY = 0; // will be shifted after persons are placed
    }

    // ── Step 2: place person nodes centered above containers ──────────────────
    if (personNodes.length > 0) {
        // Total width of persons row
        const personRowW =
            personNodes.reduce((acc, n) => acc + NODE_WIDTH[n.type], 0) +
            Math.max(0, personNodes.length - 1) * 60;

        // Use the wider of person row or container group to center both
        innerGroupW = Math.max(innerGroupW, personRowW);

        // Center persons horizontally
        let px = (innerGroupW - personRowW) / 2;
        const personRowH = Math.max(
            ...personNodes.map((n) => NODE_HEIGHT[n.type]),
        );

        for (const n of personNodes) {
            positions.set(n.id, { x: px, y: 0 });
            px += NODE_WIDTH[n.type] + 60;
        }

        // Shift all container nodes down below person row
        containerOffsetY = personRowH + PERSON_TO_CONTAINER_GAP;
        for (const n of containerNodes) {
            const pos = positions.get(n.id);
            if (pos) {
                positions.set(n.id, {
                    x: pos.x,
                    y: pos.y + containerOffsetY,
                });
            }
        }
    }

    // Fallback for any internal node not placed
    for (const n of nodes) {
        if (!positions.has(n.id)) {
            positions.set(n.id, { x: 0, y: 0 });
        }
    }

    // ── Phase 2: place external systems to the right ──────────────────────────
    // Compute bounding box of inner group
    let innerMinX = Number.POSITIVE_INFINITY;
    let innerMinY = Number.POSITIVE_INFINITY;
    let innerMaxX = Number.NEGATIVE_INFINITY;
    let innerMaxY = Number.NEGATIVE_INFINITY;

    for (const n of nodes) {
        const pos = positions.get(n.id)!;
        const w = NODE_WIDTH[n.type];
        const h = NODE_HEIGHT[n.type];
        if (pos.x < innerMinX) innerMinX = pos.x;
        if (pos.y < innerMinY) innerMinY = pos.y;
        if (pos.x + w > innerMaxX) innerMaxX = pos.x + w;
        if (pos.y + h > innerMaxY) innerMaxY = pos.y + h;
    }

    if (nodes.length === 0) {
        innerMinX = 0;
        innerMinY = 0;
        innerMaxX = 0;
        innerMaxY = 0;
    }

    const innerGroupHeight = innerMaxY - innerMinY;

    // Total height of stacked external nodes
    const extTotalH =
        externalNodes.reduce((acc, n) => acc + NODE_HEIGHT[n.type], 0) +
        Math.max(0, externalNodes.length - 1) * EXTERNAL_V_GAP;

    // X: to the right of the inner group (accounting for wrapper padding)
    const externalX = innerMaxX + WRAPPER_PADDING + EXTERNAL_H_GAP;

    // Y: vertically centered relative to inner group
    const extStartY = innerMinY + (innerGroupHeight - extTotalH) / 2;

    let cursorY = extStartY;
    for (const n of externalNodes) {
        positions.set(n.id, { x: externalX, y: cursorY });
        cursorY += NODE_HEIGHT[n.type] + EXTERNAL_V_GAP;
    }

    return positions;
}

export async function layoutNodes(
    nodes: FrainNodeJSON[],
    externalNodes: FrainNodeJSON[],
    relations: FrainRelationJSON[],
    forceRelayout: boolean = false,
): Promise<LayoutResult> {
    const allNodes = [...nodes, ...externalNodes];
    const edges = relations.map((r, i) => toReactFlowEdge(r, i));
    const internalNodeIds = new Set(nodes.map((n) => n.id));

    // If not forcing relayout and valid positions exist, keep current positions
    if (!forceRelayout && hasPositions(allNodes)) {
        const rfNodes = allNodes.map((n) =>
            toReactFlowNode(n, { x: n.x ?? 0, y: n.y ?? 0 }),
        );
        const internalRfNodes = rfNodes.filter((n) =>
            internalNodeIds.has(n.id),
        );
        const wrapper = buildGroupWrapperNode(internalRfNodes);
        return {
            nodes: (wrapper
                ? [wrapper, ...rfNodes]
                : rfNodes) as Node<C4NodeData>[],
            edges,
        };
    }

    const positions = await computeGroupedLayout(
        nodes,
        externalNodes,
        relations,
    );

    const rfNodes = allNodes.map((n) => {
        const position = positions.get(n.id) ?? { x: 0, y: 0 };
        return toReactFlowNode(n, position);
    });

    const internalRfNodes = rfNodes.filter((n) => internalNodeIds.has(n.id));
    const wrapper = buildGroupWrapperNode(internalRfNodes);

    return {
        nodes: (wrapper
            ? [wrapper, ...rfNodes]
            : rfNodes) as Node<C4NodeData>[],
        edges,
    };
}
