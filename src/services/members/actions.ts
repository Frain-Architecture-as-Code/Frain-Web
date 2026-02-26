"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type { MemberResponse, UpdateMemberRequest } from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function getMembers(
    organizationId: string,
): Promise<MemberResponse[]> {
    try {
        const { data } = await api.get<MemberResponse[]>(
            `/api/v1/organizations/${organizationId}/members`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateMember(
    organizationId: string,
    memberId: string,
    request: UpdateMemberRequest,
): Promise<MemberResponse> {
    try {
        const { data } = await api.patch<MemberResponse>(
            `/api/v1/organizations/${organizationId}/members/${memberId}`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function kickMember(
    organizationId: string,
    memberId: string,
): Promise<{ value: string }> {
    try {
        const { data } = await api.delete<{ value: string }>(
            `/api/v1/organizations/${organizationId}/members/${memberId}`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
