import {
    getC4Model,
    getViewDetail,
    getViewSummaries,
    updateC4Model,
    updateNodePosition,
} from "./actions";
import type {
    C4Model,
    C4ModelResponse,
    UpdateNodePositionRequest,
    ViewDetailResponse,
    ViewSummaryResponse,
} from "./types";

export class C4ModelController {
    static async get(projectId: string): Promise<C4ModelResponse> {
        return getC4Model(projectId);
    }

    static async update(
        projectId: string,
        model: C4Model,
    ): Promise<C4ModelResponse> {
        return updateC4Model(projectId, model);
    }

    static async getViewSummaries(
        projectId: string,
    ): Promise<ViewSummaryResponse[]> {
        return getViewSummaries(projectId);
    }

    static async getViewDetail(
        projectId: string,
        viewId: string,
    ): Promise<ViewDetailResponse> {
        return getViewDetail(projectId, viewId);
    }

    static async updateNodePosition(
        projectId: string,
        viewId: string,
        nodeId: string,
        request: UpdateNodePositionRequest,
    ): Promise<ViewDetailResponse> {
        return updateNodePosition(projectId, viewId, nodeId, request);
    }
}
