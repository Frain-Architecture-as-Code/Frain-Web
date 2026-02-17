import { OrganizationList } from "@/components/organization-list";
import { OrganizationController } from "@/services/organizations/controller";

export const metadata = {
    title: "Organizations",
};

export default async function OrganizationsPage() {
    const organizations = await OrganizationController.getAll();

    return <OrganizationList organizations={organizations} />;
}
