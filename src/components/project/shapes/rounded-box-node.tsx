"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import type { NodeType } from "@/services/c4models/types";
import { NODE_HEIGHT, NODE_LABELS, NODE_STYLES, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";

interface RoundedBoxNodeProps {
    data: C4NodeData;
    nodeType: NodeType;
}

/**
 * RoundedBoxNode - Simple rounded rectangle shape
 * Used for Software Systems, External Systems, and Containers
 */
export function RoundedBoxNode({ data, nodeType }: RoundedBoxNodeProps) {
    const s = NODE_STYLES[nodeType];
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
    return <RoundedBoxNode data={props.data as C4NodeData} nodeType="SYSTEM" />;
}

/**
 * ExternalSystemNode - External Software System (outside the focus area)
 */
export function ExternalSystemNode(props: NodeProps) {
    return (
        <RoundedBoxNode
            data={props.data as C4NodeData}
            nodeType="EXTERNAL_SYSTEM"
        />
    );
}

/**
 * ContainerNode - Container within a Software System
 */
export function ContainerNode(props: NodeProps) {
    return (
        <RoundedBoxNode data={props.data as C4NodeData} nodeType="CONTAINER" />
    );
}
