"use client";

import type { NodeProps } from "@xyflow/react";
import { useTheme } from "next-themes";

const COLOURS = {
    dark: {
        fill: "rgba(255,255,255,0.03)",
        stroke: "rgba(255,255,255,0.15)",
    },
    light: {
        fill: "rgba(0,0,0,0.03)",
        stroke: "rgba(0,0,0,0.18)",
    },
} as const;

export interface GroupWrapperData {
    width: number;
    height: number;
    [key: string]: unknown;
}

/**
 * GroupWrapperNode — a purely visual bounding box drawn behind all internal
 * nodes of a view. It has no handles and does not participate in edge routing.
 *
 * Position and dimensions are computed by buildGroupWrapperNode() in
 * elk-layout.ts, both on initial load and on every node drag-stop.
 */
export function GroupWrapperNode(props: NodeProps) {
    const data = props.data as GroupWrapperData;
    const { theme } = useTheme();
    const c = COLOURS[(theme as "dark" | "light") ?? "dark"];

    const w = data.width as number;
    const h = data.height as number;
    const r = 16;

    return (
        <div
            className="nopan nodrag nowheel"
            style={{ width: w, height: h, pointerEvents: "none" }}
        >
            <svg
                width={w}
                height={h}
                viewBox={`0 0 ${w} ${h}`}
                style={{ display: "block", overflow: "visible" }}
            >
                <rect
                    x={1}
                    y={1}
                    width={w - 2}
                    height={h - 2}
                    rx={r}
                    ry={r}
                    fill={c.fill}
                    stroke={c.stroke}
                    strokeWidth={1.5}
                    strokeDasharray="8 5"
                />
            </svg>
        </div>
    );
}
