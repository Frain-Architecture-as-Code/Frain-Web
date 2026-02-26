"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import { NodeType } from "@/services/c4models/types";
import { NODE_HEIGHT, NODE_LABELS, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";
import { useTheme } from "next-themes";

const COLOURS: Record<
    "SYSTEM" | "EXTERNAL_SYSTEM" | "CONTAINER",
    {
        dark: { bg: string; stroke: string; text: string };
        light: { bg: string; stroke: string; text: string };
    }
> = {
    SYSTEM: {
        dark: { bg: "#0055A4", stroke: "#0055A4", text: "#ffffff" },
        light: { bg: "#C7DEFF", stroke: "#1A5FA8", text: "#0D2B4E" },
    },
    EXTERNAL_SYSTEM: {
        dark: { bg: "#81788A", stroke: "#81788A", text: "#ffffff" },
        light: { bg: "#E8E4EE", stroke: "#6B5F7A", text: "#2E2640" },
    },
    CONTAINER: {
        dark: { bg: "#0097D1", stroke: "#0097D1", text: "#ffffff" },
        light: { bg: "#B3EAF9", stroke: "#0077A8", text: "#003A52" },
    },
};

interface RoundedBoxNodeProps {
    data: C4NodeData;
    nodeType: NodeType;
}

/**
 * RoundedBoxNode - Simple rounded rectangle shape
 * Used for Software Systems, External Systems, and Containers
 */
export function RoundedBoxNode({ data, nodeType }: RoundedBoxNodeProps) {
    const { theme } = useTheme();
    const colours = COLOURS[nodeType as keyof typeof COLOURS];
    const s = colours[theme as "dark" | "light"];
    const w = NODE_WIDTH[nodeType];
    const h = NODE_HEIGHT[nodeType];
    const r = 10;

    return (
        <div style={{ position: "relative", width: w, height: h }}>
            <Handle
                type="target"
                position={Position.Top}
                className="invisible"
                style={{ background: s.stroke }}
            />
            <svg
                width={w}
                height={h}
                viewBox={`0 0 ${w} ${h}`}
                role="img"
                aria-label={`${data.label} - ${NODE_LABELS[nodeType]}`}
            >
                <rect
                    x={0.75}
                    y={0.75}
                    width={w - 1.5}
                    height={h - 1.5}
                    rx={r}
                    ry={r}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                <NodeContent
                    data={data}
                    nodeType={nodeType}
                    textColor={s.text}
                    x={0}
                    y={0}
                    width={w}
                    height={h}
                />
            </svg>
            <Handle
                type="source"
                position={Position.Bottom}
                className="invisible"
                style={{ background: s.stroke }}
            />
        </div>
    );
}

/**
 * SystemNode - Software System (internal to the diagram)
 */
export function SystemNode(props: NodeProps) {
    return (
        <RoundedBoxNode
            data={props.data as C4NodeData}
            nodeType={NodeType.SYSTEM}
        />
    );
}

/**
 * ExternalSystemNode - External Software System (outside the focus area)
 */
export function ExternalSystemNode(props: NodeProps) {
    return (
        <RoundedBoxNode
            data={props.data as C4NodeData}
            nodeType={NodeType.EXTERNAL_SYSTEM}
        />
    );
}

/**
 * ContainerNode - Container within a Software System
 */
export function ContainerNode(props: NodeProps) {
    return (
        <RoundedBoxNode
            data={props.data as C4NodeData}
            nodeType={NodeType.CONTAINER}
        />
    );
}
