"use server";

import { api } from "@/lib/api";
import type { MemberResponse, UpdateMemberRequest } from "./types";

export async function getMembers(
    organizationId: string,
): Promise<MemberResponse[]> {
    const { data } = await api.get<MemberResponse[]>(
        `/api/v1/organizations/${organizationId}/members`,
    );
    return data;
}

export async function updateMember(
    organizationId: string,
    memberId: string,
    request: UpdateMemberRequest,
): Promise<MemberResponse> {
    const { data } = await api.patch<MemberResponse>(
        `/api/v1/organizations/${organizationId}/members/${memberId}`,
        request,
    );
    return data;
}
