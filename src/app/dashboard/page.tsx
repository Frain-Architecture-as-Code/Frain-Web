import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export const metadata = {
    title: "Dashboard",
};

export default async function DashboardPage() {
    const session = await auth();
    const firstName = session?.user?.name?.split(" ")[0] ?? "there";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Here&apos;s an overview of your projects.
                    </p>
                </div>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Projects</CardDescription>
                        <CardTitle className="text-3xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Create your first project to get started
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Diagrams</CardDescription>
                        <CardTitle className="text-3xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Across all projects
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Last Updated</CardDescription>
                        <CardTitle className="text-3xl">&mdash;</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            No recent activity
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 rounded-full bg-muted p-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">
                        No projects yet
                    </h3>
                    <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
                        Create your first project to start modeling your
                        infrastructure as diagrams.
                    </p>
                    <Button size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Create Project
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
