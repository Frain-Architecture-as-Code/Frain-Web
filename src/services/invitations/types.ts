export type InvitationRole = "ADMIN" | "CONTRIBUTOR" | "OWNER";

export interface SendInvitationRequest {
    targetEmail: string;
    role?: InvitationRole;
}

export interface InvitationResponse {
    invitationId: string;
    targetEmail: string;
    status: string;
    role: string;
    organizationId: string;
    inviterId: string;
    createdAt: string;
    updatedAt: string;
}
