"use server";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import type { InvitationResponse, SendInvitationRequest } from "./types";

function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return "An unexpected error occurred";
}

export async function getInvitations(
    organizationId: string,
): Promise<InvitationResponse[]> {
    try {
        const { data } = await api.get<InvitationResponse[]>(
            `/api/v1/organizations/${organizationId}/invitations`,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function sendInvitation(
    organizationId: string,
    request: SendInvitationRequest,
): Promise<InvitationResponse> {
    try {
        const { data } = await api.post<InvitationResponse>(
            `/api/v1/organizations/${organizationId}/invitations`,
            request,
        );
        return data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function acceptInvitation(invitationId: string): Promise<void> {
    try {
        await api.patch(`/api/v1/invitations/${invitationId}/accept`);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function declineInvitation(invitationId: string): Promise<void> {
    try {
        await api.patch(`/api/v1/invitations/${invitationId}/reject`);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
