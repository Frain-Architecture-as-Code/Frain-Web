"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { useTheme } from "next-themes";
import type { C4NodeData } from "@/components/project/elk-layout";
import { NodeType } from "@/services/c4models/types";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";

const COLOURS = {
    dark: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    light: { bg: "#BFD9F5", stroke: "#2B6CB0", text: "#0D2B4E" },
};

/**
 * DatabaseNode - Cylinder shape for database storage
 * Features an elliptical top cap and cylindrical body
 */
export function DatabaseNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const { theme } = useTheme();
    const s = COLOURS[theme as "dark" | "light"];
    const w = NODE_WIDTH.DATABASE;
    const h = NODE_HEIGHT.DATABASE;

    const ry = 16; // vertical radius of the ellipse cap

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
                aria-label={`${data.label} - Database`}
            >
                {/* Cylinder body */}
                <path
                    d={`
                        M 0,${ry}
                        L 0,${h - ry}
                        A ${w / 2},${ry} 0 0,0 ${w},${h - ry}
                        L ${w},${ry}
                        A ${w / 2},${ry} 0 0,1 0,${ry}
                        Z
                    `}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                {/* Top ellipse cap */}
                <ellipse
                    cx={w / 2}
                    cy={ry}
                    rx={w / 2}
                    ry={ry}
                    fill={s.bg}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                />
                <NodeContent
                    data={data}
                    nodeType={NodeType.DATABASE}
                    textColor={s.text}
                    x={0}
                    y={ry + 2}
                    width={w}
                    height={h - ry - 4}
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
