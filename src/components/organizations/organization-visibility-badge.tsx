import { OrganizationVisibility } from "@/services/organizations/types";
import { Globe, Lock } from "lucide-react";
import { Badge } from "../ui/badge";

export default function OrganizationVisibilityBadge({
    visibility,
}: {
    visibility: string;
}) {
    if (visibility === OrganizationVisibility.PUBLIC) {
        return (
            <Badge variant="secondary" className="gap-1">
                <Globe className="size-3" />
                Public
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="gap-1">
            <Lock className="size-3" />
            Private
        </Badge>
    );
}
