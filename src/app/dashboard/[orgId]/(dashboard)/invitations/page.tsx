"use client";

import { Calendar, Clock, Mail, Plus, Shield, User } from "lucide-react";
import { useCallback, useState } from "react";
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
import { useOrg } from "@/contexts/org-context";
import { InvitationRole } from "@/services/invitations/types";
import { InvitationController } from "@/services/invitations/controller";

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "PENDING":
            return (
                <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                </Badge>
            );
        case "ACCEPTED":
            return <Badge className="gap-1">Accepted</Badge>;
        case "DECLINED":
            return (
                <Badge variant="destructive" className="gap-1">
                    Declined
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

function RoleLabel({ role }: { role: string }) {
    switch (role) {
        case "ADMIN":
            return (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    Admin
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    Contributor
                </span>
            );
    }
}

function SendInvitationDialog({ orgId }: { orgId: string }) {
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
                    Invite Member
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

export default function InvitationsPage() {
    const { organization } = useOrg();

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Invitations
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage invitations for {organization.name}.
                        </p>
                    </div>
                    <SendInvitationDialog orgId={organization.organizationId} />
                </div>
            </BlurFade>

            <BlurFade delay={0.1}>
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Mail className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mb-1 text-sm font-semibold">
                            No invitations yet
                        </p>
                        <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
                            Invite people to join your organization and
                            collaborate on projects.
                        </p>
                        <SendInvitationDialog
                            orgId={organization.organizationId}
                        />
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
