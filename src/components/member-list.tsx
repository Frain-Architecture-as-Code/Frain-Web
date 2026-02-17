"use client";

import { Calendar, Crown, Shield, User, Users } from "lucide-react";
import { SendInvitationDialog } from "@/components/send-invitation-dialog";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import type { MemberResponse } from "@/services/members/types";

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

export function MemberList({
    members,
    organizationName,
    orgId,
}: {
    members: MemberResponse[];
    organizationName: string;
    orgId: string;
}) {
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
                    <SendInvitationDialog orgId={orgId} />
                </div>
            </BlurFade>

            {members.length > 0 ? (
                <div className="grid gap-3">
                    {members.map((member, index) => (
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
