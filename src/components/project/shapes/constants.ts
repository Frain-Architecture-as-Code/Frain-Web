import type { NodeType } from "@/services/c4models/types";

/**
 * Structurizr conventional colour palette
 * Based on the C4 model visual standards from structurizr.com
 */
export const NODE_STYLES: Record<
    NodeType,
    { bg: string; stroke: string; text: string }
> = {
    PERSON: { bg: "#003668", stroke: "#003668", text: "#ffffff" },
    SYSTEM: { bg: "#0055A4", stroke: "#0055A4", text: "#ffffff" },
    EXTERNAL_SYSTEM: { bg: "#81788A", stroke: "#81788A", text: "#ffffff" },
    DATABASE: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    WEB_APP: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    CONTAINER: { bg: "#0097D1", stroke: "#0097D1", text: "#ffffff" },
    COMPONENT: { bg: "#50B5ED", stroke: "#50B5ED", text: "#ffffff" },
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
