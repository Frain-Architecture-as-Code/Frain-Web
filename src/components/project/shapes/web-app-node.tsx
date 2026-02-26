"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { NodeContent } from "./node-content";
import { useTheme } from "next-themes";

const COLOURS = {
    dark: { bg: "#438DD5", stroke: "#3A7BC0", text: "#ffffff" },
    light: { bg: "#BFD9F5", stroke: "#2B6CB0", text: "#0D2B4E" },
};

/**
 * WebAppNode - Browser window shape for web applications
 * Features a chrome bar with control dots and URL bar
 */
export function WebAppNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const { theme } = useTheme();
    const s = COLOURS[theme as "dark" | "light"];
    const w = NODE_WIDTH.WEB_APP;
    const h = NODE_HEIGHT.WEB_APP;

    const r = 10;
    const barH = 24;
    const dotR = 3.5;
    const dotY = barH / 2;
    const urlBarFill =
        theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)";

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
                aria-label={`${data.label} - Web Application`}
            >
                {/* Outer rounded rect */}
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
                {/* Browser chrome bar line */}
                <line
                    x1={0.75}
                    y1={barH}
                    x2={w - 0.75}
                    y2={barH}
                    stroke={s.stroke}
                    strokeWidth={1}
                />
                {/* Window control dots */}
                <circle cx={14} cy={dotY} r={dotR} fill={s.stroke} />
                <circle cx={26} cy={dotY} r={dotR} fill={s.stroke} />
                <circle cx={38} cy={dotY} r={dotR} fill={s.stroke} />
                {/* URL bar */}
                <rect
                    x={50}
                    y={dotY - 5}
                    width={w - 66}
                    height={10}
                    rx={3}
                    fill={urlBarFill}
                />
                <NodeContent
                    data={data}
                    nodeType="WEB_APP"
                    textColor={s.text}
                    x={0}
                    y={barH}
                    width={w}
                    height={h - barH}
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
