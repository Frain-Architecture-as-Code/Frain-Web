"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { C4NodeData } from "@/components/project/elk-layout";
import { cn } from "@/lib/utils";
import type { NodeType } from "@/services/c4models/types";

const NODE_COLORS: Record<
    NodeType,
    { bg: string; border: string; text: string }
> = {
    PERSON: {
        bg: "bg-blue-500/15",
        border: "border-blue-500/40",
        text: "text-blue-400",
    },
    SYSTEM: {
        bg: "bg-indigo-500/15",
        border: "border-indigo-500/40",
        text: "text-indigo-400",
    },
    EXTERNAL_SYSTEM: {
        bg: "bg-slate-500/15",
        border: "border-slate-500/40",
        text: "text-slate-400",
    },
    DATABASE: {
        bg: "bg-emerald-500/15",
        border: "border-emerald-500/40",
        text: "text-emerald-400",
    },
    WEB_APP: {
        bg: "bg-violet-500/15",
        border: "border-violet-500/40",
        text: "text-violet-400",
    },
    CONTAINER: {
        bg: "bg-cyan-500/15",
        border: "border-cyan-500/40",
        text: "text-cyan-400",
    },
    COMPONENT: {
        bg: "bg-amber-500/15",
        border: "border-amber-500/40",
        text: "text-amber-400",
    },
};

const NODE_LABELS: Record<NodeType, string> = {
    PERSON: "Person",
    SYSTEM: "System",
    EXTERNAL_SYSTEM: "External System",
    DATABASE: "Database",
    WEB_APP: "Web App",
    CONTAINER: "Container",
    COMPONENT: "Component",
};

function C4NodeBase({
    data,
    nodeType,
}: {
    data: C4NodeData;
    nodeType: NodeType;
}) {
    const colors = NODE_COLORS[nodeType];
    const label = NODE_LABELS[nodeType];

    return (
        <div
            className={cn(
                "rounded-lg border px-4 py-3 shadow-sm",
                colors.bg,
                colors.border,
            )}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!h-2 !w-2 !border-none !bg-muted-foreground/50"
            />
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {label}
                    </span>
                </div>
                <p
                    className={cn(
                        "text-sm font-semibold leading-tight",
                        colors.text,
                    )}
                >
                    {data.label}
                </p>
                {data.technology && (
                    <p className="text-[10px] text-muted-foreground">
                        [{data.technology}]
                    </p>
                )}
                {data.description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground/80">
                        {data.description}
                    </p>
                )}
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="!h-2 !w-2 !border-none !bg-muted-foreground/50"
            />
        </div>
    );
}

function PersonNode(props: NodeProps) {
    return <C4NodeBase data={props.data as C4NodeData} nodeType="PERSON" />;
}

function SystemNode(props: NodeProps) {
    return <C4NodeBase data={props.data as C4NodeData} nodeType="SYSTEM" />;
}

function ExternalSystemNode(props: NodeProps) {
    return (
        <C4NodeBase
            data={props.data as C4NodeData}
            nodeType="EXTERNAL_SYSTEM"
        />
    );
}

function DatabaseNode(props: NodeProps) {
    return <C4NodeBase data={props.data as C4NodeData} nodeType="DATABASE" />;
}

function WebAppNode(props: NodeProps) {
    return <C4NodeBase data={props.data as C4NodeData} nodeType="WEB_APP" />;
}

function ContainerNode(props: NodeProps) {
    return <C4NodeBase data={props.data as C4NodeData} nodeType="CONTAINER" />;
}

function ComponentNode(props: NodeProps) {
    return <C4NodeBase data={props.data as C4NodeData} nodeType="COMPONENT" />;
}

export const c4NodeTypes = {
    "c4-person": PersonNode,
    "c4-system": SystemNode,
    "c4-external-system": ExternalSystemNode,
    "c4-database": DatabaseNode,
    "c4-web-app": WebAppNode,
    "c4-container": ContainerNode,
    "c4-component": ComponentNode,
};
