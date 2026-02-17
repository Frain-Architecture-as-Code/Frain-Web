import type { InternalNode, Position, XYPosition } from "@xyflow/react";

/**
 * Simple floating edge utilities for rectangular nodes
 * Based on React Flow official examples
 */

/**
 * Get intersection point on node border from center to target
 * Treats all nodes as rectangles regardless of their visual shape
 */
function getNodeIntersection(
    intersectionNode: InternalNode,
    targetNode: InternalNode,
): XYPosition {
    const {
        width: intersectionNodeWidth = 0,
        height: intersectionNodeHeight = 0,
    } = intersectionNode.measured ?? {};

    const targetPosition = targetNode.internals.positionAbsolute;
    const { width: targetWidth = 0, height: targetHeight = 0 } =
        targetNode.measured ?? {};

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    // Center of intersection node
    const x2 = intersectionNode.internals.positionAbsolute.x + w;
    const y2 = intersectionNode.internals.positionAbsolute.y + h;

    // Center of target node
    const x1 = targetPosition.x + targetWidth / 2;
    const y1 = targetPosition.y + targetHeight / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

/**
 * Determine edge position based on intersection point
 */
function getEdgePosition(
    node: InternalNode,
    intersectionPoint: XYPosition,
): Position {
    const nx = Math.round(node.internals.positionAbsolute.x);
    const ny = Math.round(node.internals.positionAbsolute.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    const { width = 0, height = 0 } = node.measured ?? {};

    if (px <= nx + 1) {
        return "left" as Position;
    }
    if (px >= nx + width - 1) {
        return "right" as Position;
    }
    if (py <= ny + 1) {
        return "top" as Position;
    }
    if (py >= ny + height - 1) {
        return "bottom" as Position;
    }

    return "top" as Position;
}

/**
 * Get edge parameters for floating edge
 */
export function getEdgeParams(source: InternalNode, target: InternalNode) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}
