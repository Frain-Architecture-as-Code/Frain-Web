import { Node } from "@xyflow/react";
import { C4NodeData } from "./elk-layout";

export const FIT_VIEW_OPTIONS = { padding: 0.2, duration: 800 };
export const COLLISION_MARGIN = 12;
export const PERSIST_DEBOUNCE_MS = 600;

export function resolveAgainstWrapper(
    node: Node<C4NodeData>,
    wrapper: Node,
): { x: number; y: number } | null {
    const nX = node.position.x;
    const nY = node.position.y;
    const nW = (node.width as number) ?? 200;
    const nH = (node.height as number) ?? 120;

    const wX = wrapper.position.x;
    const wY = wrapper.position.y;
    const wW = (wrapper.width as number) ?? 0;
    const wH = (wrapper.height as number) ?? 0;

    const overlapX = Math.min(nX + nW, wX + wW) - Math.max(nX, wX);
    const overlapY = Math.min(nY + nH, wY + wH) - Math.max(nY, wY);

    if (overlapX <= 0 || overlapY <= 0) return null;

    if (overlapX < overlapY) {
        const pushedLeft = nX + nW / 2 < wX + wW / 2;
        return {
            x: pushedLeft
                ? wX - nW - COLLISION_MARGIN
                : wX + wW + COLLISION_MARGIN,
            y: nY,
        };
    } else {
        const pushedUp = nY + nH / 2 < wY + wH / 2;
        return {
            x: nX,
            y: pushedUp
                ? wY - nH - COLLISION_MARGIN
                : wY + wH + COLLISION_MARGIN,
        };
    }
}
