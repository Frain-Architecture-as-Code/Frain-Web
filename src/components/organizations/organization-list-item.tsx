import { OrganizationResponse } from "@/services/organizations/types";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Building2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import OrganizationVisibilityBadge from "./organization-visibility-badge";

export default function OrganizationListItem({
    org,
}: {
    org: OrganizationResponse;
}) {
    return (
        <Link href={`/dashboard/${org.organizationId}`}>
            <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none">
                                {org.name}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Created {formatDate(org.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <OrganizationVisibilityBadge visibility={org.visibility} />
                </CardContent>
            </Card>
        </Link>
    );
}
