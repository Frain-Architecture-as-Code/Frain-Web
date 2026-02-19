import {
    acceptInvitation,
    declineInvitation,
    getInvitations,
    sendInvitation,
} from "./actions";
import type { InvitationResponse, SendInvitationRequest } from "./types";

export class InvitationController {
    static async getAll(organizationId: string): Promise<InvitationResponse[]> {
        return getInvitations(organizationId);
    }

    static async send(
        organizationId: string,
        request: SendInvitationRequest,
    ): Promise<InvitationResponse> {
        return sendInvitation(organizationId, request);
    }

    static async accept(invitationId: string): Promise<void> {
        return acceptInvitation(invitationId);
    }

    static async decline(invitationId: string): Promise<void> {
        return declineInvitation(invitationId);
    }
}
