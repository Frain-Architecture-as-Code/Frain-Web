import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function OrganizationGridItemSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
