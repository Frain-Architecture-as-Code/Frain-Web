"use client";

import {
    BaseEdge,
    EdgeLabelRenderer,
    type EdgeProps,
    type Edge,
    getStraightPath,
    useStore,
} from "@xyflow/react";
import { getEdgeParams } from "./floating-edge-utils";
import type { FrainRelationJSON } from "@/services/c4models/types";

export type C4EdgeData = FrainRelationJSON & Record<string, unknown>;

export type FrainEdge = Edge<C4EdgeData, "floating">;

export function FloatingEdge(props: EdgeProps<FrainEdge>) {
    const { id, source, target, markerEnd, style, data } = props;

    const sourceNode = useStore((store) => store.nodeLookup.get(source));
    const targetNode = useStore((store) => store.nodeLookup.get(target));

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={style}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: "all",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                    className="nodrag nopan p-0.5 text-xs bg-background text-center"
                >
                    <span className="block font-bold text-[8px]">
                        {data?.description}
                    </span>
                    <span className="block text-[8px]">
                        {data?.technology ? `[${data.technology}]` : ""}
                    </span>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
