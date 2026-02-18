import { MemberList } from "@/components/member-list";
import { auth } from "@/lib/auth";
import { MemberController } from "@/services/members/controller";
import { OrganizationController } from "@/services/organizations/controller";

interface MembersPageProps {
    params: Promise<{ orgId: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
    const { orgId } = await params;

    const [members, organization, session] = await Promise.all([
        MemberController.getAll(orgId),
        OrganizationController.getById(orgId),
        auth(),
    ]);

    return (
        <MemberList
            members={members}
            organizationName={organization.name}
            orgId={orgId}
            currentUserId={session?.user?.id ?? ""}
        />
    );
}
