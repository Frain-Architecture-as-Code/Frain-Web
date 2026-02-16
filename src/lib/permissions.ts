import type { MemberResponse, MemberRole } from "@/services/members/types";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

/**
 * Verifica si el usuario puede ver todas las API keys del proyecto
 * OWNER y ADMIN pueden ver todas las keys
 * CONTRIBUTOR solo puede ver su propia key
 */
export function canViewAllKeys(role: MemberRole): boolean {
    return role === "OWNER" || role === "ADMIN";
}

/**
 * Verifica si el usuario puede crear nuevas API keys
 * Solo OWNER y ADMIN pueden crear keys
 */
export function canCreateKeys(role: MemberRole): boolean {
    return role === "OWNER" || role === "ADMIN";
}

/**
 * Verifica si el usuario puede revocar API keys
 * Solo OWNER puede revocar keys
 */
export function canRevokeKey(role: MemberRole): boolean {
    return role === "OWNER";
}

/**
 * Verifica si el usuario puede crear una API key para un rol específico
 * OWNER puede crear keys para cualquier rol
 * ADMIN solo puede crear keys para CONTRIBUTOR
 * CONTRIBUTOR no puede crear keys para nadie
 */
export function canCreateKeyForRole(
    userRole: MemberRole,
    targetRole: MemberRole,
): boolean {
    if (userRole === "OWNER") return true;
    if (userRole === "ADMIN" && targetRole === "CONTRIBUTOR") return true;
    return false;
}

/**
 * Filtra las API keys visibles según el rol del usuario
 * OWNER y ADMIN ven todas las keys
 * CONTRIBUTOR solo ve su propia key
 */
export function filterVisibleKeys(
    keys: ProjectApiKeyResponse[],
    userRole: MemberRole,
    currentUserId: string,
    members: MemberResponse[],
): ProjectApiKeyResponse[] {
    if (userRole === "OWNER" || userRole === "ADMIN") {
        return keys;
    }

    // CONTRIBUTOR: solo su propia key
    const currentMember = members.find((m) => m.userId === currentUserId);
    if (!currentMember) return [];

    return keys.filter((key) => key.memberId === currentMember.memberId);
}

/**
 * Filtra los members disponibles para crear API keys según el rol del usuario
 * OWNER puede seleccionar cualquier member
 * ADMIN solo puede seleccionar members con rol CONTRIBUTOR
 */
export function filterAvailableMembers(
    members: MemberResponse[],
    userRole: MemberRole,
): MemberResponse[] {
    if (userRole === "OWNER") {
        return members;
    }

    if (userRole === "ADMIN") {
        return members.filter((member) => member.memberRole === "CONTRIBUTOR");
    }

    return [];
}
