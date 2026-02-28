import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function OrganizationListItemSkeleton() {
    return (
        <Card>
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-40" />
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </CardContent>
        </Card>
    );
}
