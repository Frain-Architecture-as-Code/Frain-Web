"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { useCanvasThemeStore } from "@/components/project/canvas-theme-store";
import type { C4NodeData } from "@/components/project/elk-layout";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";

const COLOURS = {
    dark: { bg: "#003668", stroke: "#003668", text: "#ffffff" },
    light: { bg: "#D4E5F7", stroke: "#1A5FA8", text: "#0D2B4E" },
};

/**
 * PersonNode - Human silhouette shape (circle head + rounded rectangle body)
 * Used for actors/users in C4 Context diagrams
 */
export function PersonNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const theme = useCanvasThemeStore((s) => s.theme);
    const s = COLOURS[theme];
    const w = NODE_WIDTH.PERSON;
    const h = NODE_HEIGHT.PERSON;

    const headR = 40;
    const headCy = headR + 2;
    const bodyTop = headCy + headR - 10;
    const bodyH = h - bodyTop;
    const bodyR = 20;

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
                aria-label={`${data.label} - Person`}
            >
                <rect
                    x={0}
                    y={bodyTop}
                    width={w}
                    height={bodyH}
                    rx={bodyR}
                    ry={bodyR}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                <circle
                    cx={w / 2}
                    cy={headCy}
                    r={headR}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                <NodeContent
                    data={data}
                    nodeType="PERSON"
                    textColor={s.text}
                    x={0}
                    y={bodyTop}
                    width={w}
                    height={bodyH}
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
