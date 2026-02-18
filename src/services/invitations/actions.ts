"use server";

import { api } from "@/lib/api";
import type { InvitationResponse, SendInvitationRequest } from "./types";

export async function getInvitations(
    organizationId: string,
): Promise<InvitationResponse[]> {
    const { data } = await api.get<InvitationResponse[]>(
        `/api/v1/organizations/${organizationId}/invitations`,
    );
    return data;
}

export async function sendInvitation(
    organizationId: string,
    request: SendInvitationRequest,
): Promise<InvitationResponse> {
    const { data } = await api.post<InvitationResponse>(
        `/api/v1/organizations/${organizationId}/invitations`,
        request,
    );
    return data;
}

export async function acceptInvitation(invitationId: string): Promise<void> {
    await api.patch(`/api/v1/invitations/${invitationId}/accept`);
}

export async function declineInvitation(invitationId: string): Promise<void> {
    await api.patch(`/api/v1/invitations/${invitationId}/reject`);
}
