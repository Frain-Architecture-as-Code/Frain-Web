import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { MemberController } from "@/services/members/controller";
import { type MemberResponse, MemberRole } from "@/services/members/types";
import { canViewAllKeys } from "@/lib/permissions";

export function useProjectMembers(
    organizationId: string,
    currentUserId: string,
) {
    const [members, setMembers] = useState<MemberResponse[]>([]);

    useEffect(() => {
        MemberController.getAll(organizationId)
            .then(setMembers)
            .catch((error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Error loading members",
                );
            });
    }, [organizationId]);

    const currentUserRole = useMemo<MemberRole>(() => {
        const member = members.find((m) => m.userId === currentUserId);
        return (member?.memberRole as MemberRole) ?? MemberRole.CONTRIBUTOR;
    }, [members, currentUserId]);

    const canAccessApiKeys = canViewAllKeys(currentUserRole);

    return { members, currentUserRole, canAccessApiKeys };
}
