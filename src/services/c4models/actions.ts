"use server";

import { api } from "@/lib/api";
import type {
    C4Model,
    C4ModelResponse,
    GetProjectDetailsResponse,
    UpdateNodePositionRequest,
    ViewDetailResponse,
    ViewSummaryResponse,
} from "./types";

export async function getC4Model(projectId: string): Promise<C4ModelResponse> {
    const { data } = await api.get<C4ModelResponse>(
        `/api/v1/c4models/projects/${projectId}`,
    );
    return data;
}

export async function updateC4Model(
    projectId: string,
    model: C4Model,
): Promise<C4ModelResponse> {
    const { data } = await api.put<C4ModelResponse>(
        `/api/v1/c4models/projects/${projectId}`,
        model,
    );
    return data;
}

export async function getViewSummaries(
    projectId: string,
): Promise<ViewSummaryResponse[]> {
    const { data } = await api.get<ViewSummaryResponse[]>(
        `/api/v1/c4models/projects/${projectId}/views`,
    );
    return data;
}

export async function getViewDetail(
    projectId: string,
    viewId: string,
): Promise<ViewDetailResponse> {
    const { data } = await api.get<ViewDetailResponse>(
        `/api/v1/c4models/projects/${projectId}/views/${viewId}`,
    );
    return data;
}

export async function updateNodePosition(
    projectId: string,
    viewId: string,
    nodeId: string,
    request: UpdateNodePositionRequest,
): Promise<ViewDetailResponse> {
    const { data } = await api.patch<ViewDetailResponse>(
        `/api/v1/c4models/projects/${projectId}/views/${viewId}/nodes/${nodeId}`,
        request,
    );
    return data;
}

export async function getProjectDetails(projectId: string) {
    const { data } = await api.get<GetProjectDetailsResponse>(
        `/api/v1/c4models/projects/${projectId}/details`,
    );
    return data;
}
