import { describe, expect, it } from "vitest";
import {
    canCreateKeyForRole,
    canCreateKeys,
    canRevokeKey,
    canViewAllKeys,
    filterAvailableMembers,
    filterVisibleKeys,
} from "@/lib/permissions";
import type { MemberResponse } from "@/services/members/types";
import { MemberRole } from "@/services/members/types";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

// ─── Test data factories ────────────────────────────────────────────────────

function createMember(overrides: Partial<MemberResponse> = {}): MemberResponse {
    return {
        memberId: "member-1",
        userId: "user-1",
        organizationId: "org-1",
        memberName: "Test User",
        memberRole: "CONTRIBUTOR",
        picture: "https://example.com/avatar.png",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        ...overrides,
    };
}

function createApiKey(
    overrides: Partial<ProjectApiKeyResponse> = {},
): ProjectApiKeyResponse {
    return {
        id: "key-1",
        projectId: "project-1",
        memberId: "member-1",
        apiKeySecret: "sk-***hidden***",
        lastUsedAt: "2024-01-01T00:00:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        ...overrides,
    };
}

// ─── canViewAllKeys ─────────────────────────────────────────────────────────

describe("canViewAllKeys", () => {
    it("returns true for OWNER", () => {
        expect(canViewAllKeys(MemberRole.OWNER)).toBe(true);
    });

    it("returns true for ADMIN", () => {
        expect(canViewAllKeys(MemberRole.ADMIN)).toBe(true);
    });

    it("returns false for CONTRIBUTOR", () => {
        expect(canViewAllKeys(MemberRole.CONTRIBUTOR)).toBe(false);
    });
});

// ─── canCreateKeys ──────────────────────────────────────────────────────────

describe("canCreateKeys", () => {
    it("returns true for OWNER", () => {
        expect(canCreateKeys(MemberRole.OWNER)).toBe(true);
    });

    it("returns true for ADMIN", () => {
        expect(canCreateKeys(MemberRole.ADMIN)).toBe(true);
    });

    it("returns false for CONTRIBUTOR", () => {
        expect(canCreateKeys(MemberRole.CONTRIBUTOR)).toBe(false);
    });
});

// ─── canRevokeKey ───────────────────────────────────────────────────────────

describe("canRevokeKey", () => {
    it("returns true for OWNER", () => {
        expect(canRevokeKey(MemberRole.OWNER)).toBe(true);
    });

    it("returns false for ADMIN", () => {
        expect(canRevokeKey(MemberRole.ADMIN)).toBe(false);
    });

    it("returns false for CONTRIBUTOR", () => {
        expect(canRevokeKey(MemberRole.CONTRIBUTOR)).toBe(false);
    });
});

// ─── canCreateKeyForRole ────────────────────────────────────────────────────

describe("canCreateKeyForRole", () => {
    it("OWNER can create key for OWNER", () => {
        expect(canCreateKeyForRole(MemberRole.OWNER, MemberRole.OWNER)).toBe(
            true,
        );
    });

    it("OWNER can create key for ADMIN", () => {
        expect(canCreateKeyForRole(MemberRole.OWNER, MemberRole.ADMIN)).toBe(
            true,
        );
    });

    it("OWNER can create key for CONTRIBUTOR", () => {
        expect(
            canCreateKeyForRole(MemberRole.OWNER, MemberRole.CONTRIBUTOR),
        ).toBe(true);
    });

    it("ADMIN can create key for CONTRIBUTOR", () => {
        expect(
            canCreateKeyForRole(MemberRole.ADMIN, MemberRole.CONTRIBUTOR),
        ).toBe(true);
    });

    it("ADMIN cannot create key for ADMIN", () => {
        expect(canCreateKeyForRole(MemberRole.ADMIN, MemberRole.ADMIN)).toBe(
            false,
        );
    });

    it("ADMIN cannot create key for OWNER", () => {
        expect(canCreateKeyForRole(MemberRole.ADMIN, MemberRole.OWNER)).toBe(
            false,
        );
    });

    it("CONTRIBUTOR cannot create key for anyone", () => {
        expect(
            canCreateKeyForRole(MemberRole.CONTRIBUTOR, MemberRole.CONTRIBUTOR),
        ).toBe(false);
        expect(
            canCreateKeyForRole(MemberRole.CONTRIBUTOR, MemberRole.ADMIN),
        ).toBe(false);
        expect(
            canCreateKeyForRole(MemberRole.CONTRIBUTOR, MemberRole.OWNER),
        ).toBe(false);
    });
});

// ─── filterVisibleKeys ──────────────────────────────────────────────────────

describe("filterVisibleKeys", () => {
    const ownerKey = createApiKey({
        id: "key-owner",
        memberId: "member-owner",
    });
    const adminKey = createApiKey({
        id: "key-admin",
        memberId: "member-admin",
    });
    const contributorKey = createApiKey({
        id: "key-contributor",
        memberId: "member-contributor",
    });
    const allKeys = [ownerKey, adminKey, contributorKey];

    const members: MemberResponse[] = [
        createMember({
            memberId: "member-owner",
            userId: "user-owner",
            memberRole: "OWNER",
        }),
        createMember({
            memberId: "member-admin",
            userId: "user-admin",
            memberRole: "ADMIN",
        }),
        createMember({
            memberId: "member-contributor",
            userId: "user-contributor",
            memberRole: "CONTRIBUTOR",
        }),
    ];

    it("OWNER sees all keys", () => {
        const result = filterVisibleKeys(
            allKeys,
            MemberRole.OWNER,
            "user-owner",
            members,
        );
        expect(result).toEqual(allKeys);
    });

    it("ADMIN sees all keys", () => {
        const result = filterVisibleKeys(
            allKeys,
            MemberRole.ADMIN,
            "user-admin",
            members,
        );
        expect(result).toEqual(allKeys);
    });

    it("CONTRIBUTOR sees only their own key", () => {
        const result = filterVisibleKeys(
            allKeys,
            MemberRole.CONTRIBUTOR,
            "user-contributor",
            members,
        );
        expect(result).toEqual([contributorKey]);
    });

    it("CONTRIBUTOR with no matching member sees no keys", () => {
        const result = filterVisibleKeys(
            allKeys,
            MemberRole.CONTRIBUTOR,
            "user-unknown",
            members,
        );
        expect(result).toEqual([]);
    });

    it("returns empty array when keys array is empty", () => {
        const result = filterVisibleKeys(
            [],
            MemberRole.OWNER,
            "user-owner",
            members,
        );
        expect(result).toEqual([]);
    });
});

// ─── filterAvailableMembers ─────────────────────────────────────────────────

describe("filterAvailableMembers", () => {
    const members: MemberResponse[] = [
        createMember({
            memberId: "member-owner",
            memberRole: "OWNER",
            memberName: "Owner",
        }),
        createMember({
            memberId: "member-admin",
            memberRole: "ADMIN",
            memberName: "Admin",
        }),
        createMember({
            memberId: "member-contributor-1",
            memberRole: "CONTRIBUTOR",
            memberName: "Contributor 1",
        }),
        createMember({
            memberId: "member-contributor-2",
            memberRole: "CONTRIBUTOR",
            memberName: "Contributor 2",
        }),
    ];

    it("OWNER can select all members", () => {
        const result = filterAvailableMembers(members, MemberRole.OWNER);
        expect(result).toEqual(members);
    });

    it("ADMIN can only select CONTRIBUTORs", () => {
        const result = filterAvailableMembers(members, MemberRole.ADMIN);
        expect(result).toHaveLength(2);
        expect(result.every((m) => m.memberRole === "CONTRIBUTOR")).toBe(true);
    });

    it("CONTRIBUTOR cannot select anyone", () => {
        const result = filterAvailableMembers(members, MemberRole.CONTRIBUTOR);
        expect(result).toEqual([]);
    });

    it("returns empty array when members list is empty", () => {
        const result = filterAvailableMembers([], MemberRole.OWNER);
        expect(result).toEqual([]);
    });
});
