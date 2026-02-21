"use client";
import { OrganizationController } from "@/services/organizations/controller";
import { OrganizationVisibility } from "@/services/organizations/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Globe, Lock, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function CreateOrganizationDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [visibility, setVisibility] = useState<OrganizationVisibility>(
        OrganizationVisibility.PUBLIC,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            await OrganizationController.create({
                name: name.trim(),
                visibility,
            });
            setOpen(false);
            setName("");
            setVisibility(OrganizationVisibility.PUBLIC);
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
