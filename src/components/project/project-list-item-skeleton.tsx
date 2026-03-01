import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProjectListItemSkeleton() {
    return (
        <Card className="transition-colors">
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-md" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />

                        <Skeleton className="h-3 w-64" />

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-sm" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
            </CardContent>
        </Card>
    );
}
