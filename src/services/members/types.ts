export interface MemberName {
    value: string;
}

export enum MemberRole {
    ADMIN = "ADMIN",
    CONTRIBUTOR = "CONTRIBUTOR",
    OWNER = "OWNER",
}

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
    picture: string;
    createdAt: string;
    updatedAt: string;
}
