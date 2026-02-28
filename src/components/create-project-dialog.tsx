"use client";
import { ProjectController } from "@/services/projects/controller";
import { ProjectVisibility } from "@/services/projects/types";
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
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Globe, Lock, Plus } from "lucide-react";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export default function CreateProjectDialog({
    organizationId,
}: {
    organizationId: string;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [visibility, setVisibility] = useState<ProjectVisibility>(
        ProjectVisibility.PRIVATE,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await ProjectController.create(organizationId, { visibility });
            setOpen(false);
            setVisibility(ProjectVisibility.PRIVATE);
            router.refresh();
            toast.success("Project created successfully");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new project in this organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-visibility">Visibility</Label>
                        <Select
                            value={visibility}
                            onValueChange={(value: ProjectVisibility) =>
                                setVisibility(value)
                            }
                        >
                            <SelectTrigger id="project-visibility">
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
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
