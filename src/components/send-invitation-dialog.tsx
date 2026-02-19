"use client";

import { Plus, Shield, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { InvitationController } from "@/services/invitations/controller";
import { InvitationRole } from "@/services/invitations/types";

export function SendInvitationDialog({ orgId }: { orgId: string }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<InvitationRole>(
        InvitationRole.CONTRIBUTOR,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!email.trim()) return;

        InvitationController.send(orgId, { role, targetEmail: email });

        setIsSubmitting(true);

        // TODO: Wire up to InvitationController.send()
        setTimeout(() => {
            setIsSubmitting(false);
            setOpen(false);
            setEmail("");
            setRole(InvitationRole.CONTRIBUTOR);
        }, 500);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Send an invitation to join your organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="invite-email">Email</Label>
                        <Input
                            id="invite-email"
                            type="email"
                            placeholder="member@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="invite-role">Role</Label>
                        <Select
                            value={role}
                            onValueChange={(value: InvitationRole) =>
                                setRole(value)
                            }
                        >
                            <SelectTrigger id="invite-role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CONTRIBUTOR">
                                    <User className="mr-2 inline h-3.5 w-3.5" />
                                    Contributor
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                    <Shield className="mr-2 inline h-3.5 w-3.5" />
                                    Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                        >
                            {isSubmitting ? "Sending..." : "Send Invitation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
