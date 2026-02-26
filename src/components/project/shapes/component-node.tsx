"use client";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";
import { useTheme } from "next-themes";
import { NodeType } from "@/services/c4models/types";
const COLOURS = {
    dark: { bg: "#50B5ED", stroke: "#50B5ED", text: "#ffffff" },
    light: { bg: "#C5EAF8", stroke: "#2190C4", text: "#003A52" },
};
/**
 * ComponentNode - UML-style component shape with side tabs
 * Features a main rectangle with two protruding tabs on the left edge
 */
export function ComponentNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const { theme } = useTheme();
    const s = COLOURS[theme as "dark" | "light"];
    const w = NODE_WIDTH.COMPONENT;
    const h = NODE_HEIGHT.COMPONENT;
    const r = 6;
    const tabW = 16;
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
                viewBox={`0 0 ${w} ${h}`}
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
                <NodeContent
                    data={data}
                    nodeType={NodeType.COMPONENT}
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
