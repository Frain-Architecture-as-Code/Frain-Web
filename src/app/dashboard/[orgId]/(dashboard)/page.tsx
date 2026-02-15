"use client";

import { Calendar, FolderKanban, Globe, Lock, Mail, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrg } from "@/contexts/org-context";

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function OrgOverviewPage() {
    const { organization } = useOrg();

    const stats = [
        {
            title: "Projects",
            value: "3",
            icon: FolderKanban,
            href: `/dashboard/${organization.organizationId}/projects`,
        },
        {
            title: "Members",
            value: "5",
            icon: Users,
            href: `/dashboard/${organization.organizationId}/members`,
        },
        {
            title: "Invitations",
            value: "2",
            icon: Mail,
            href: `/dashboard/${organization.organizationId}/invitations`,
        },
    ];

    return (
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {organization.name}
                        </h1>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                Created {formatDate(organization.createdAt)}
                            </span>
                            {organization.visibility === "PUBLIC" ? (
                                <Badge variant="secondary" className="gap-1">
                                    <Globe className="h-3 w-3" />
                                    Public
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1">
                                    <Lock className="h-3 w-3" />
                                    Private
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </BlurFade>

            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                    <BlurFade key={stat.title} delay={0.1 + index * 0.05}>
                        <Link href={stat.href}>
                            <Card className="transition-colors hover:bg-muted/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stat.value}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </BlurFade>
                ))}
            </div>
        </div>
    );
}
