import type { NodeType } from "@/services/c4models/types";

/**
 * Human-readable labels for each C4 node type
 */
export const NODE_LABELS: Record<NodeType, string> = {
    PERSON: "Person",
    SYSTEM: "Software System",
    EXTERNAL_SYSTEM: "External System",
    DATABASE: "Database",
    WEB_APP: "Web Application",
    CONTAINER: "Container",
    COMPONENT: "Component",
};

/**
 * Node width dimensions (must match elk-layout.ts)
 */
export const NODE_WIDTH: Record<NodeType, number> = {
    PERSON: 200,
    SYSTEM: 240,
    EXTERNAL_SYSTEM: 240,
    DATABASE: 200,
    WEB_APP: 220,
    CONTAINER: 220,
    COMPONENT: 200,
};

/**
 * Node height dimensions (must match elk-layout.ts)
 */
export const NODE_HEIGHT: Record<NodeType, number> = {
    PERSON: 170,
    SYSTEM: 120,
    EXTERNAL_SYSTEM: 120,
    DATABASE: 140,
    WEB_APP: 140,
    CONTAINER: 120,
    COMPONENT: 120,
};
