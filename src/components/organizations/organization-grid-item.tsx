import { OrganizationResponse } from "@/services/organizations/types";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Building2, Calendar } from "lucide-react";
import OrganizationVisibilityBadge from "./organization-visibility-badge";
import { formatDate } from "@/lib/utils";

export default function OrganizationGridItem({
    org,
}: {
    org: OrganizationResponse;
}) {
    return (
        <Link href={`/dashboard/${org.organizationId}`}>
            <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <OrganizationVisibilityBadge
                            visibility={org.visibility}
                        />
                    </div>
                    <div>
                        <p className="font-medium">{org.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Created {formatDate(org.createdAt)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
