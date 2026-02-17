import { MemberList } from "@/components/member-list";
import { MemberController } from "@/services/members/controller";
import { OrganizationController } from "@/services/organizations/controller";

interface MembersPageProps {
    params: Promise<{ orgId: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
    const { orgId } = await params;

    const [members, organization] = await Promise.all([
        MemberController.getAll(orgId),
        OrganizationController.getById(orgId),
    ]);

    return (
        <MemberList
            members={members}
            organizationName={organization.name}
            orgId={orgId}
        />
    );
}
