import type { NodeType } from "@/services/c4models/types";

/**
 * Structurizr conventional colour palette
 * Based on the C4 model visual standards from structurizr.com
 */
export const NODE_STYLES: Record<
    NodeType,
    { bg: string; stroke: string; text: string }
> = {
    PERSON: { bg: "#08427B", stroke: "#073B6F", text: "#ffffff" },
    SYSTEM: { bg: "#1168BD", stroke: "#0E5CA8", text: "#ffffff" },
    EXTERNAL_SYSTEM: { bg: "#999999", stroke: "#8A8A8A", text: "#ffffff" },
    DATABASE: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    WEB_APP: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    CONTAINER: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    COMPONENT: { bg: "#85BBF0", stroke: "#78A8DC", text: "#232323" },
};

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
