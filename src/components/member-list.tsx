"use client";

import {
    Calendar,
    Crown,
    MoreHorizontal,
    Pencil,
    Shield,
    ShieldPlus,
    User,
    UserMinus,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SendInvitationDialog } from "@/components/send-invitation-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MemberController } from "@/services/members/controller";
import type { MemberResponse } from "@/services/members/types";
import { MemberRole } from "@/services/members/types";

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function RoleBadge({ role }: { role: string }) {
    switch (role) {
        case "OWNER":
            return (
                <Badge className="gap-1">
                    <Crown className="h-3 w-3" />
                    Owner
                </Badge>
            );
        case "ADMIN":
            return (
                <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="gap-1">
                    <User className="h-3 w-3" />
                    Contributor
                </Badge>
            );
    }
}

interface MemberListProps {
    members: MemberResponse[];
    organizationName: string;
    orgId: string;
    currentUserId: string;
}

export function MemberList({
    members: initialMembers,
    organizationName,
    orgId,
    currentUserId,
}: MemberListProps) {
    const router = useRouter();
    const [members, setMembers] = useState(initialMembers);

    const currentMember = members.find((m) => m.userId === currentUserId);
    const currentRole = currentMember?.memberRole ?? "CONTRIBUTOR";

    const sortedMembers = [...members].sort((a, b) => {
        if (a.userId === currentUserId) return -1;
        if (b.userId === currentUserId) return 1;
        return 0;
    });

    // Edit name dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<MemberResponse | null>(
        null,
    );
    const [editName, setEditName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Change role dialog state
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [roleMember, setRoleMember] = useState<MemberResponse | null>(null);
    const [newRole, setNewRole] = useState<MemberRole>(MemberRole.CONTRIBUTOR);
    const [isChangingRole, setIsChangingRole] = useState(false);

    // Kick member alert state
    const [kickAlertOpen, setKickAlertOpen] = useState(false);
    const [kickingMember, setKickingMember] = useState<MemberResponse | null>(
        null,
    );
    const [isKicking, setIsKicking] = useState(false);

    function canEditName(member: MemberResponse): boolean {
        return member.userId === currentUserId;
    }

    function canChangeRole(member: MemberResponse): boolean {
        if (member.memberRole === "OWNER") return false;
        if (currentRole === "OWNER") return true;
        if (currentRole === "ADMIN" && member.memberRole === "CONTRIBUTOR") {
            return true;
        }
        return false;
    }

    function canKickMember(member: MemberResponse): boolean {
        if (member.userId === currentUserId) return false;
        if (member.memberRole === "OWNER") return false;
        return currentRole === "OWNER";
    }

    function getAvailableRoles(member: MemberResponse): MemberRole[] {
        if (currentRole === "OWNER") {
            return [MemberRole.ADMIN, MemberRole.CONTRIBUTOR].filter(
                (r) => r !== member.memberRole,
            );
        }
        if (currentRole === "ADMIN" && member.memberRole === "CONTRIBUTOR") {
            return [MemberRole.ADMIN];
        }
        return [];
    }

    function openEditDialog(member: MemberResponse) {
        setEditingMember(member);
        setEditName(member.memberName);
        setEditDialogOpen(true);
    }

    function openRoleDialog(member: MemberResponse) {
        setRoleMember(member);
        const roles = getAvailableRoles(member);
        setNewRole(roles[0] ?? MemberRole.CONTRIBUTOR);
        setRoleDialogOpen(true);
    }

    function openKickAlert(member: MemberResponse) {
        setKickingMember(member);
        setKickAlertOpen(true);
    }

    async function handleEditName(event: React.FormEvent) {
        event.preventDefault();
        if (!editingMember || !editName.trim()) return;

        setIsUpdating(true);
        try {
            const updated = await MemberController.update(
                orgId,
                editingMember.memberId,
                { newName: { value: editName.trim() } },
            );
            setMembers((prev) =>
                prev.map((m) =>
                    m.memberId === updated.memberId ? updated : m,
                ),
            );
            toast.success("Name updated successfully.");
            setEditDialogOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            );
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleChangeRole(event: React.FormEvent) {
        event.preventDefault();
        if (!roleMember) return;

        setIsChangingRole(true);
        try {
            const updated = await MemberController.update(
                orgId,
                roleMember.memberId,
                { newRole },
            );
            setMembers((prev) =>
                prev.map((m) =>
                    m.memberId === updated.memberId ? updated : m,
                ),
            );
            toast.success("Role updated successfully.");
            setRoleDialogOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            );
        } finally {
            setIsChangingRole(false);
        }
    }

    async function handleKickMember() {
        if (!kickingMember) return;

        setIsKicking(true);
        try {
            await MemberController.kick(orgId, kickingMember.memberId);
            setMembers((prev) =>
                prev.filter((m) => m.memberId !== kickingMember.memberId),
            );
            toast.success(
                `${kickingMember.memberName} has been removed from the organization.`,
            );
            setKickAlertOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            );
        } finally {
            setIsKicking(false);
        }
    }

    function hasAnyAction(member: MemberResponse): boolean {
        return (
            canEditName(member) ||
            canChangeRole(member) ||
            canKickMember(member)
        );
    }

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Members
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            People in {organizationName}.
                        </p>
                    </div>
                    {currentMember?.memberRole !== MemberRole.CONTRIBUTOR && (
                        <SendInvitationDialog orgId={orgId} />
                    )}
                </div>
            </BlurFade>

            {sortedMembers.length > 0 ? (
                <div className="grid gap-3">
                    {sortedMembers.map((member, index) => {
                        const isSelf = member.userId === currentUserId;
                        return (
                            <BlurFade
                                key={member.memberId}
                                delay={0.1 + index * 0.05}
                            >
                                <Card className="transition-colors hover:bg-muted/50">
                                    <CardContent className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={
                                                        member.picture ||
                                                        undefined
                                                    }
                                                    alt={member.memberName}
                                                />
                                                <AvatarFallback className="text-sm">
                                                    {member.memberName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {member.memberName}
                                                    {isSelf && (
                                                        <span className="ml-1.5 text-xs text-muted-foreground">
                                                            (you)
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        Joined{" "}
                                                        {formatDate(
                                                            member.createdAt,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RoleBadge
                                                role={member.memberRole}
                                            />
                                            {hasAnyAction(member) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Actions
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {canEditName(
                                                            member,
                                                        ) && (
                                                            <DropdownMenuItem
                                                                onSelect={() =>
                                                                    openEditDialog(
                                                                        member,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit name
                                                            </DropdownMenuItem>
                                                        )}
                                                        {canChangeRole(
                                                            member,
                                                        ) && (
                                                            <DropdownMenuItem
                                                                onSelect={() =>
                                                                    openRoleDialog(
                                                                        member,
                                                                    )
                                                                }
                                                            >
                                                                <ShieldPlus className="mr-2 h-4 w-4" />
                                                                Change role
                                                            </DropdownMenuItem>
                                                        )}
                                                        {canKickMember(
                                                            member,
                                                        ) && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onSelect={() =>
                                                                        openKickAlert(
                                                                            member,
                                                                        )
                                                                    }
                                                                >
                                                                    <UserMinus className="mr-2 h-4 w-4" />
                                                                    Remove
                                                                    member
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </BlurFade>
                        );
                    })}
                </div>
            ) : (
                <BlurFade delay={0.1}>
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="mb-1 text-sm font-semibold">
                                No members yet
                            </p>
                            <p className="max-w-sm text-center text-sm text-muted-foreground">
                                Invite people to your organization to
                                collaborate on projects.
                            </p>
                        </CardContent>
                    </Card>
                </BlurFade>
            )}

            {/* Edit Name Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Name</DialogTitle>
                        <DialogDescription>
                            Update your display name in this organization.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditName} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="member-name">Name</Label>
                            <Input
                                id="member-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    isUpdating ||
                                    !editName.trim() ||
                                    editName === editingMember?.memberName
                                }
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Change Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Role</DialogTitle>
                        <DialogDescription>
                            Update the role for{" "}
                            <span className="font-medium">
                                {roleMember?.memberName}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangeRole} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="member-role">Role</Label>
                            <Select
                                value={newRole}
                                onValueChange={(value: MemberRole) =>
                                    setNewRole(value)
                                }
                            >
                                <SelectTrigger id="member-role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleMember &&
                                        getAvailableRoles(roleMember).map(
                                            (role) => (
                                                <SelectItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role === "ADMIN" ? (
                                                        <>
                                                            <Shield className="mr-2 inline h-3.5 w-3.5" />
                                                            Admin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <User className="mr-2 inline h-3.5 w-3.5" />
                                                            Contributor
                                                        </>
                                                    )}
                                                </SelectItem>
                                            ),
                                        )}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isChangingRole}>
                                {isChangingRole ? "Updating..." : "Update Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Kick Member Alert */}
            <AlertDialog open={kickAlertOpen} onOpenChange={setKickAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Member</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove{" "}
                            <span className="font-medium">
                                {kickingMember?.memberName}
                            </span>{" "}
                            from the organization? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isKicking}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleKickMember}
                            disabled={isKicking}
                        >
                            {isKicking ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
