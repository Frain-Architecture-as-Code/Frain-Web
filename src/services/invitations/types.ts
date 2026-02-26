export enum InvitationRole {
    ADMIN = "ADMIN",
    CONTRIBUTOR = "CONTRIBUTOR",
    OWNER = "OWNER",
}

export interface SendInvitationRequest {
    targetEmail: string;
    role: InvitationRole;
}

export interface InvitationResponse {
    invitationId: string;
    targetEmail: string;
    status: string;
    role: InvitationRole;
    organizationId: string;
    inviterId: string;
    createdAt: string;
    updatedAt: string;
}
