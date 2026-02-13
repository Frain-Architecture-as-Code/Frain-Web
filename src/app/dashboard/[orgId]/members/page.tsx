"use client";

import { Calendar, Crown, Shield, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { useOrg } from "@/contexts/org-context";
import type { MemberResponse } from "@/services/members/types";

const sampleMembers: MemberResponse[] = [
    {
        memberId: "member-1",
        userId: "user-1",
        organizationId: "org-1",
        memberName: "John Doe",
        memberRole: "OWNER",
        createdAt: "2025-11-15T10:30:00Z",
        updatedAt: "2026-02-10T14:00:00Z",
    },
    {
        memberId: "member-2",
        userId: "user-2",
        organizationId: "org-1",
        memberName: "Jane Smith",
        memberRole: "ADMIN",
        createdAt: "2025-12-01T09:00:00Z",
        updatedAt: "2026-02-08T17:45:00Z",
    },
    {
        memberId: "member-3",
        userId: "user-3",
        organizationId: "org-1",
        memberName: "Bob Wilson",
        memberRole: "CONTRIBUTOR",
        createdAt: "2026-01-10T14:15:00Z",
        updatedAt: "2026-02-05T11:00:00Z",
    },
    {
        memberId: "member-4",
        userId: "user-4",
        organizationId: "org-1",
        memberName: "Alice Johnson",
        memberRole: "CONTRIBUTOR",
        createdAt: "2026-01-20T08:30:00Z",
        updatedAt: "2026-02-09T10:20:00Z",
    },
    {
        memberId: "member-5",
        userId: "user-5",
        organizationId: "org-1",
        memberName: "Charlie Brown",
        memberRole: "ADMIN",
        createdAt: "2026-02-01T16:45:00Z",
        updatedAt: "2026-02-11T11:20:00Z",
    },
];

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

export default function MembersPage() {
    const { organization } = useOrg();

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Members
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        People in {organization.name}.
                    </p>
                </div>
            </BlurFade>

            {sampleMembers.length > 0 ? (
                <div className="grid gap-3">
                    {sampleMembers.map((member, index) => (
                        <BlurFade
                            key={member.memberId}
                            delay={0.1 + index * 0.05}
                        >
                            <Card className="transition-colors hover:bg-muted/50">
                                <CardContent className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                            <span className="text-sm font-medium text-primary">
                                                {member.memberName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {member.memberName}
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
                                    <RoleBadge role={member.memberRole} />
                                </CardContent>
                            </Card>
                        </BlurFade>
                    ))}
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
        </div>
    );
}
