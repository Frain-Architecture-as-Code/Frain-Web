"use client";

import {
    Building2,
    Calendar,
    Globe,
    LayoutGrid,
    List,
    Lock,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OrganizationController } from "@/services/organizations/controller";
import type {
    OrganizationResponse,
    OrganizationVisibility,
} from "@/services/organizations/types";
import { useUserPreferences, type ViewMode } from "@/stores/user-preferences";

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function VisibilityBadge({ visibility }: { visibility: string }) {
    if (visibility === "PUBLIC") {
        return (
            <Badge variant="secondary" className="gap-1">
                <Globe className="h-3 w-3" />
                Public
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Private
        </Badge>
    );
}

function CreateOrganizationDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [visibility, setVisibility] =
        useState<OrganizationVisibility>("PUBLIC");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            await OrganizationController.create({
                name: { value: name.trim() },
                visibility,
            });
            setOpen(false);
            setName("");
            setVisibility("PUBLIC");
            router.refresh();
            toast.success("Organization created successfully");
        } catch {
            toast.error("Failed to create organization");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    New Organization
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization to manage your projects and
                        team members.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="org-name">Name</Label>
                        <Input
                            id="org-name"
                            placeholder="My Organization"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-visibility">Visibility</Label>
                        <Select
                            value={visibility}
                            onValueChange={(value: OrganizationVisibility) =>
                                setVisibility(value)
                            }
                        >
                            <SelectTrigger id="org-visibility">
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">
                                    <Globe className="mr-2 inline h-3.5 w-3.5" />
                                    Public
                                </SelectItem>
                                <SelectItem value="PRIVATE">
                                    <Lock className="mr-2 inline h-3.5 w-3.5" />
                                    Private
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {visibility === "PUBLIC"
                                ? "Anyone can see this organization and its public projects."
                                : "Only members can see this organization and its projects."}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function OrganizationListItem({ org }: { org: OrganizationResponse }) {
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
                    <VisibilityBadge visibility={org.visibility} />
                </CardContent>
            </Card>
        </Link>
    );
}

function OrganizationGridItem({ org }: { org: OrganizationResponse }) {
    return (
        <Link href={`/dashboard/${org.organizationId}`}>
            <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <VisibilityBadge visibility={org.visibility} />
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

export function OrganizationList({
    organizations,
}: {
    organizations: OrganizationResponse[];
}) {
    const viewMode = useUserPreferences((state) => state.organizationsViewMode);
    const setViewMode = useUserPreferences(
        (state) => state.setOrganizationsViewMode,
    );

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Organizations
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your organizations and their projects.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={(value: string) => {
                                if (value) setViewMode(value as ViewMode);
                            }}
                            variant="outline"
                            size="sm"
                        >
                            <ToggleGroupItem
                                value="list"
                                aria-label="List view"
                            >
                                <List className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="grid"
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <CreateOrganizationDialog />
                    </div>
                </div>
            </BlurFade>

            {organizations.length > 0 ? (
                viewMode === "list" ? (
                    <div className="grid gap-3">
                        {organizations.map((org, index) => (
                            <BlurFade
                                key={org.organizationId}
                                delay={0.1 + index * 0.05}
                            >
                                <OrganizationListItem org={org} />
                            </BlurFade>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {organizations.map((org, index) => (
                            <BlurFade
                                key={org.organizationId}
                                delay={0.1 + index * 0.05}
                            >
                                <OrganizationGridItem org={org} />
                            </BlurFade>
                        ))}
                    </div>
                )
            ) : (
                <BlurFade delay={0.1}>
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="mb-1 text-sm font-semibold">
                                No organizations yet
                            </p>
                            <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
                                Create your first organization to start managing
                                projects and collaborating with your team.
                            </p>
                            <CreateOrganizationDialog />
                        </CardContent>
                    </Card>
                </BlurFade>
            )}
        </div>
    );
}
