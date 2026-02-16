"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import { NODE_HEIGHT, NODE_STYLES, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";

/**
 * ComponentNode - UML-style component shape with side tabs
 * Features a main rectangle with two protruding tabs on the left edge
 */
export function ComponentNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const s = NODE_STYLES.COMPONENT;
    const w = NODE_WIDTH.COMPONENT;
    const h = NODE_HEIGHT.COMPONENT;

    const r = 6;
    const tabW = 16;
    const tabH = 10;
    const tabX = -tabW / 2;
    const inset = 0.75;

    return (
        <div style={{ position: "relative", width: w, height: h }}>
            <Handle
                type="target"
                position={Position.Top}
                className="invisible"
                style={{ background: s.stroke }}
            />
            <svg
                width={w + tabW / 2}
                height={h}
                viewBox={`${-tabW / 2} 0 ${w + tabW / 2} ${h}`}
                style={{ overflow: "visible" }}
                role="img"
                aria-label={`${data.label} - Component`}
            >
                {/* Main body */}
                <rect
                    x={inset}
                    y={inset}
                    width={w - inset * 2}
                    height={h - inset * 2}
                    rx={r}
                    ry={r}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                {/* Top tab */}
                <rect
                    x={tabX}
                    y={h * 0.25 - tabH / 2}
                    width={tabW}
                    height={tabH}
                    rx={2}
                    ry={2}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                {/* Bottom tab */}
                <rect
                    x={tabX}
                    y={h * 0.55 - tabH / 2}
                    width={tabW}
                    height={tabH}
                    rx={2}
                    ry={2}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                <NodeContent
                    data={data}
                    nodeType="COMPONENT"
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
