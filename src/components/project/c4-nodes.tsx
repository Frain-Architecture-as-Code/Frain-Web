"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import type { NodeType } from "@/services/c4models/types";
import { useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Structurizr conventional colour palette
// ---------------------------------------------------------------------------
const NODE_STYLES: Record<
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

const NODE_LABELS: Record<NodeType, string> = {
    PERSON: "Person",
    SYSTEM: "Software System",
    EXTERNAL_SYSTEM: "External System",
    DATABASE: "Database",
    WEB_APP: "Web Application",
    CONTAINER: "Container",
    COMPONENT: "Component",
};

// ---------------------------------------------------------------------------
// Shared node dimensions – must match elk-layout.ts
// ---------------------------------------------------------------------------
const NODE_W: Record<NodeType, number> = {
    PERSON: 200,
    SYSTEM: 240,
    EXTERNAL_SYSTEM: 240,
    DATABASE: 200,
    WEB_APP: 220,
    CONTAINER: 220,
    COMPONENT: 200,
};

const NODE_H: Record<NodeType, number> = {
    PERSON: 170,
    SYSTEM: 120,
    EXTERNAL_SYSTEM: 120,
    DATABASE: 140,
    WEB_APP: 140,
    CONTAINER: 120,
    COMPONENT: 120,
};

// ---------------------------------------------------------------------------
// Text content block shared across shapes (rendered inside foreignObject)
// ---------------------------------------------------------------------------
function NodeContent({
    data,
    nodeType,
    textColor,
    x,
    y,
    width,
    height,
}: {
    data: C4NodeData;
    nodeType: NodeType;
    textColor: string;
    x: number;
    y: number;
    width: number;
    height: number;
}) {
    const label = NODE_LABELS[nodeType];
    const mutedColor =
        textColor === "#ffffff" ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.55)";

    return (
        <foreignObject x={x} y={y} width={width} height={height}>
            <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: textColor,
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                    }}
                >
                    {data.label}
                </span>
                <span
                    style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        color: mutedColor,
                        lineHeight: 1.2,
                        marginBottom: 2,
                    }}
                >
                    [{label.toLocaleLowerCase()}
                    {data.technology && `: ${data.technology}`}]
                </span>
                {data.description && (
                    <span
                        style={{
                            fontSize: 10,
                            color: mutedColor,
                            lineHeight: 1.3,
                            marginTop: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {data.description}
                    </span>
                )}
            </div>
        </foreignObject>
    );
}

// ---------------------------------------------------------------------------
// Shape: Person – human silhouette head + rounded-rect body
// ---------------------------------------------------------------------------
function PersonNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const s = NODE_STYLES.PERSON;
    const w = NODE_W.PERSON;
    const h = NODE_H.PERSON;

    const headR = 30;
    const headCy = headR + 2;
    const bodyTop = headCy + headR - 4;
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

// ---------------------------------------------------------------------------
// Shape: Rounded box – Software System / Container / External System
// ---------------------------------------------------------------------------
function RoundedBoxNode({
    data,
    nodeType,
}: {
    data: C4NodeData;
    nodeType: NodeType;
}) {
    const s = NODE_STYLES[nodeType];
    const w = NODE_W[nodeType];
    const h = NODE_H[nodeType];
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

function SystemNode(props: NodeProps) {
    return <RoundedBoxNode data={props.data as C4NodeData} nodeType="SYSTEM" />;
}

function ExternalSystemNode(props: NodeProps) {
    return (
        <RoundedBoxNode
            data={props.data as C4NodeData}
            nodeType="EXTERNAL_SYSTEM"
        />
    );
}

function ContainerNode(props: NodeProps) {
    return (
        <RoundedBoxNode data={props.data as C4NodeData} nodeType="CONTAINER" />
    );
}

// ---------------------------------------------------------------------------
// Shape: Cylinder – Database
// ---------------------------------------------------------------------------
function DatabaseNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const s = NODE_STYLES.DATABASE;
    const w = NODE_W.DATABASE;
    const h = NODE_H.DATABASE;

    const ry = 16;

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
                    nodeType="DATABASE"
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

// ---------------------------------------------------------------------------
// Shape: Web Browser – Web Application
// ---------------------------------------------------------------------------
function WebAppNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const s = NODE_STYLES.WEB_APP;
    const w = NODE_W.WEB_APP;
    const h = NODE_H.WEB_APP;

    const r = 10;
    const barH = 24;
    const dotR = 3.5;
    const dotY = barH / 2;

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
                    fill="rgba(255,255,255,0.15)"
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

// ---------------------------------------------------------------------------
// Shape: UML Component – rect with two side-tabs
// ---------------------------------------------------------------------------
function ComponentNode(props: NodeProps) {
    const data = props.data as C4NodeData;
    const s = NODE_STYLES.COMPONENT;
    const w = NODE_W.COMPONENT;
    const h = NODE_H.COMPONENT;

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

// ---------------------------------------------------------------------------
// Export node-type registry for React Flow
// ---------------------------------------------------------------------------
export { NODE_STYLES };

export const c4NodeTypes = {
    "c4-person": PersonNode,
    "c4-system": SystemNode,
    "c4-external-system": ExternalSystemNode,
    "c4-database": DatabaseNode,
    "c4-web-app": WebAppNode,
    "c4-container": ContainerNode,
    "c4-component": ComponentNode,
};
