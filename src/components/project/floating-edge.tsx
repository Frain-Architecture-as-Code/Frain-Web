"use client";

import {
    BaseEdge,
    type EdgeProps,
    getStraightPath,
    useStore,
} from "@xyflow/react";
import { getEdgeParams } from "./floating-edge-utils";

/**
 * Floating Edge component with dashed lines
 * Dynamically calculates connection points based on node positions
 */
export function FloatingEdge({
    id,
    source,
    target,
    markerEnd,
    style,
}: EdgeProps) {
    const sourceNode = useStore((store) => store.nodeLookup.get(source));
    const targetNode = useStore((store) => store.nodeLookup.get(target));

    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    const [edgePath] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
    });

    return (
        <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
    );
}
