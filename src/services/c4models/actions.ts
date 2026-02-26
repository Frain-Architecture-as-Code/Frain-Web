"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type {
    C4Model,
    C4ModelResponse,
    GetProjectDetailsResponse,
    UpdateNodePositionRequest,
    ViewDetailResponse,
    ViewSummaryResponse,
} from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function getC4Model(projectId: string): Promise<C4ModelResponse> {
    try {
        const { data } = await api.get<C4ModelResponse>(
            `/api/v1/c4models/projects/${projectId}`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateC4Model(
    projectId: string,
    model: C4Model,
): Promise<C4ModelResponse> {
    try {
        const { data } = await api.put<C4ModelResponse>(
            `/api/v1/c4models/projects/${projectId}`,
            model,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getViewSummaries(
    projectId: string,
): Promise<ViewSummaryResponse[]> {
    try {
        const { data } = await api.get<ViewSummaryResponse[]>(
            `/api/v1/c4models/projects/${projectId}/views`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getViewDetail(
    projectId: string,
    viewId: string,
): Promise<ViewDetailResponse> {
    try {
        const { data } = await api.get<ViewDetailResponse>(
            `/api/v1/c4models/projects/${projectId}/views/${viewId}`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateNodePosition(
    projectId: string,
    viewId: string,
    nodeId: string,
    request: UpdateNodePositionRequest,
): Promise<ViewDetailResponse> {
    try {
        const { data } = await api.patch<ViewDetailResponse>(
            `/api/v1/c4models/projects/${projectId}/views/${viewId}/nodes/${nodeId}`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function getProjectDetails(
    projectId: string,
): Promise<GetProjectDetailsResponse> {
    try {
        const { data } = await api.get<GetProjectDetailsResponse>(
            `/api/v1/c4models/projects/${projectId}/details`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
