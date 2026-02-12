import { getMembers, updateMember } from "./actions";
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
}
