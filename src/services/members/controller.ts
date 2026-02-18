import { getMembers, kickMember, updateMember } from "./actions";
import type { MemberResponse, UpdateMemberRequest } from "./types";

export class MemberController {
    static async getAll(organizationId: string): Promise<MemberResponse[]> {
        return getMembers(organizationId);
    }

    static async update(
        organizationId: string,
        memberId: string,
        request: UpdateMemberRequest,
    ): Promise<MemberResponse> {
        return updateMember(organizationId, memberId, request);
    }

    static async kick(
        organizationId: string,
        memberId: string,
    ): Promise<{ value: string }> {
        return kickMember(organizationId, memberId);
    }
}
