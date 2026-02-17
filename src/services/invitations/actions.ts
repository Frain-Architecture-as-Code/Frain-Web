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

export async function acceptInvitation(
    organizationId: string,
    invitationId: string,
): Promise<void> {
    await api.patch(
        `/api/v1/organizations/${organizationId}/invitations/${invitationId}`,
    );
}

export async function declineInvitation(
    organizationId: string,
    invitationId: string,
): Promise<void> {
    await api.delete(
        `/api/v1/organizations/${organizationId}/invitations/${invitationId}`,
    );
}
