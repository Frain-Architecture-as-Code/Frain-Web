export enum NodeType {
    PERSON = "PERSON",
    SYSTEM = "SYSTEM",
    EXTERNAL_SYSTEM = "EXTERNAL_SYSTEM",
    DATABASE = "DATABASE",
    WEB_APP = "WEB_APP",
    CONTAINER = "CONTAINER",
    COMPONENT = "COMPONENT",
}

export type ViewType = "CONTEXT" | "CONTAINER" | "COMPONENT";

export interface ContainerInfo {
    name: string;
    description: string;
    technology: string;
}

export interface FrainNodeJSON {
    id: string;
    type: NodeType;
    name: string;
    description: string;
    technology: string;
    viewId?: string;
    x?: number;
    y?: number;
}

export interface FrainRelationJSON {
    sourceId: string;
    targetId: string;
    description: string;
    technology?: string;
}

export interface FrainViewJSON {
    id: string;
    type: ViewType;
    container?: ContainerInfo;
    name: string;
    nodes: FrainNodeJSON[];
    externalNodes: FrainNodeJSON[];
    relations: FrainRelationJSON[];
}

export interface C4Model {
    title: string;
    description: string;
    updatedAt: string;
    views: FrainViewJSON[];
}

export interface C4ModelResponse {
    projectId: string;
    c4Model: C4Model;
}

export interface ViewSummaryResponse {
    id: string;
    type: ViewType;
    name: string;
    container?: ContainerInfo;
}

export interface ViewDetailResponse {
    id: string;
    type: ViewType;
    name: string;
    container?: ContainerInfo;
    nodes: FrainNodeJSON[];
    externalNodes: FrainNodeJSON[];
    relations: FrainRelationJSON[];
}

export interface UpdateNodePositionRequest {
    x: number;
    y: number;
}

export interface GetProjectDetailsResponse {
    title: string;
    description: string;
    updatedAt: string;
}
