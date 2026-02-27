import type { C4NodeData } from "@/components/project/elk-layout";
import { NodeType } from "@/services/c4models/types";
import { NODE_LABELS } from "./constants";

interface NodeContentProps {
    data: C4NodeData;
    nodeType: NodeType;
    textColor: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const contextNodeTypes = [
    NodeType.PERSON,
    NodeType.EXTERNAL_SYSTEM,
    NodeType.SYSTEM,
];

const getFirstLetterUpperCaseForNodeType = (nodeType: NodeType) => {
    switch (nodeType) {
        case NodeType.PERSON:
            return "Person";
        case NodeType.EXTERNAL_SYSTEM:
            return "External System";
        case NodeType.SYSTEM:
            return "System";
        case NodeType.COMPONENT:
            return "Component";
        case NodeType.CONTAINER:
            return "Container";
        case NodeType.DATABASE:
            return "Database";
        default:
            return "";
    }
};
/**
 * Shared text content block rendered inside SVG foreignObject
 * Displays: node name, type label, technology, and description
 */
export function NodeContent({
    data,
    nodeType,
    textColor,
    x,
    y,
    width,
    height,
}: NodeContentProps) {
    const label = NODE_LABELS[nodeType];
    const mutedColor =
        textColor === "#ffffff" ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.55)";

    const technologyLabel = data.technology ? `${data.technology}` : "";

    console.log(nodeType);
    console.log(contextNodeTypes);

    const isAContextNode = contextNodeTypes.includes(nodeType);

    const labelWithTechnology = `[${getFirstLetterUpperCaseForNodeType(nodeType)}${!isAContextNode ? " : " + technologyLabel : ""}]`;
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
                    {labelWithTechnology}
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
