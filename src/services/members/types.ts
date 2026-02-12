export interface MemberName {
    value: string;
}

export type MemberRole = "ADMIN" | "CONTRIBUTOR" | "OWNER";

export interface UpdateMemberRequest {
    newName?: MemberName;
    newRole?: MemberRole;
}

export interface MemberResponse {
    memberId: string;
    userId: string;
    organizationId: string;
    memberName: string;
    memberRole: string;
    createdAt: string;
    updatedAt: string;
}
