"use client";

import { Globe, Lock, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrg } from "@/contexts/org-context";
import { OrganizationController } from "@/services/organizations/controller";
import type { OrganizationVisibility } from "@/services/organizations/types";

export default function OrgSettingsPage() {
    const router = useRouter();
    const { organization } = useOrg();
    const [name, setName] = useState(organization.name);
    const [visibility, setVisibility] = useState<OrganizationVisibility>(
        organization.visibility as OrganizationVisibility,
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!name.trim() || !hasChanges) return;

        setIsSaving(true);

        try {
            await OrganizationController.update(organization.organizationId, {
                ...(name !== organization.name && {
                    name: { value: name.trim() },
                }),
                ...(visibility !== organization.visibility && { visibility }),
            });
            toast.success("Organization settings updated.");
            router.refresh();
        } catch {
            toast.error("Failed to update organization settings.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        setIsDeleting(true);

        try {
            await OrganizationController.delete(organization.organizationId);
            toast.success("Organization deleted.");
            router.push("/dashboard");
        } catch {
            toast.error("Failed to delete organization.");
            setIsDeleting(false);
        }
    }

    const hasChanges =
        name !== organization.name || visibility !== organization.visibility;

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage settings for {organization.name}.
                    </p>
                </div>
            </BlurFade>

            <BlurFade delay={0.1}>
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>
                            Update your organization&apos;s basic information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name">
                                    Organization Name
                                </Label>
                                <Input
                                    id="org-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Organization name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="org-visibility">
                                    Visibility
                                </Label>
                                <Select
                                    value={visibility}
                                    onValueChange={(
                                        value: OrganizationVisibility,
                                    ) => setVisibility(value)}
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
                            <Button
                                type="submit"
                                disabled={isSaving || !hasChanges}
                                size="sm"
                            >
                                <Save className="mr-1 h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>

            <BlurFade delay={0.15}>
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Irreversible actions for this organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={isDeleting}
                                >
                                    {isDeleting
                                        ? "Deleting..."
                                        : "Delete Organization"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Organization
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete{" "}
                                        <span className="font-medium">
                                            {organization.name}
                                        </span>{" "}
                                        and all its projects, members, and data.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting
                                            ? "Deleting..."
                                            : "Delete Organization"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Once deleted, this organization and all its data
                            will be permanently removed.
                        </p>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
