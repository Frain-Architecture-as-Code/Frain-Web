import { redirect } from "next/navigation";

interface OrgPageProps {
    params: Promise<{ orgId: string }>;
}

export default async function OrgOverviewPage({
    params,
}: OrgPageProps): Promise<never> {
    const { orgId } = await params;
    redirect(`/dashboard/${orgId}/projects`);
}
