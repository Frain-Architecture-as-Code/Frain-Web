"use client";

import {
    ArrowLeft,
    ChevronRight,
    Copy,
    Eye,
    Key,
    Layers,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ViewSummaryResponse } from "@/services/c4models/types";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

interface ProjectSidebarProps {
    projectId: string;
    modelTitle: string;
    views: ViewSummaryResponse[];
    activeViewId: string | null;
    onViewSelect: (viewId: string) => void;
    apiKeys: ProjectApiKeyResponse[];
    onCreateApiKey: () => void;
    onRevokeApiKey: (apiKeyId: string) => void;
}

function ViewTypeLabel({ type }: { type: string }) {
    const labels: Record<string, string> = {
        CONTEXT: "Context",
        CONTAINER: "Container",
        COMPONENT: "Component",
    };
    return (
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {labels[type] ?? type}
        </span>
    );
}

export function ProjectSidebar({
    projectId,
    modelTitle,
    views,
    activeViewId,
    onViewSelect,
    apiKeys,
    onCreateApiKey,
    onRevokeApiKey,
}: ProjectSidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [viewsOpen, setViewsOpen] = useState(true);
    const [apiKeysOpen, setApiKeysOpen] = useState(false);

    if (collapsed) {
        return (
            <div className="absolute top-3 left-3 z-10">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCollapsed(false)}
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                >
                    <PanelLeftOpen className="h-4 w-4" />
                    <span className="sr-only">Open sidebar</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="absolute top-0 left-0 z-10 flex h-full w-72 flex-col border-r bg-background/95 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-3 py-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                    >
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to dashboard</span>
                        </Link>
                    </Button>
                    <span className="max-w-[160px] truncate text-sm font-semibold">
                        {modelTitle || projectId}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCollapsed(true)}
                >
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="sr-only">Close sidebar</span>
                </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {/* Views Section */}
                    <Collapsible open={viewsOpen} onOpenChange={setViewsOpen}>
                        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted">
                            <ChevronRight
                                className={cn(
                                    "h-3.5 w-3.5 transition-transform",
                                    viewsOpen && "rotate-90",
                                )}
                            />
                            <Layers className="h-3.5 w-3.5" />
                            Views
                            <span className="ml-auto text-xs text-muted-foreground">
                                {views.length}
                            </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1 space-y-0.5 pl-4">
                            {views.length === 0 ? (
                                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                                    No views available
                                </p>
                            ) : (
                                views.map((view) => (
                                    <button
                                        key={view.id}
                                        type="button"
                                        onClick={() => onViewSelect(view.id)}
                                        className={cn(
                                            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                                            activeViewId === view.id &&
                                                "bg-muted font-medium",
                                        )}
                                    >
                                        <Eye className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate">
                                                {view.name}
                                            </p>
                                            <ViewTypeLabel type={view.type} />
                                        </div>
                                    </button>
                                ))
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    <Separator className="my-2" />

                    {/* API Keys Section */}
                    <Collapsible
                        open={apiKeysOpen}
                        onOpenChange={setApiKeysOpen}
                    >
                        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted">
                            <ChevronRight
                                className={cn(
                                    "h-3.5 w-3.5 transition-transform",
                                    apiKeysOpen && "rotate-90",
                                )}
                            />
                            <Key className="h-3.5 w-3.5" />
                            API Keys
                            <span className="ml-auto text-xs text-muted-foreground">
                                {apiKeys.length}
                            </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1 space-y-1 pl-4">
                            {apiKeys.length === 0 ? (
                                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                                    No API keys created
                                </p>
                            ) : (
                                apiKeys.map((key) => (
                                    <div
                                        key={key.id}
                                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-mono text-xs">
                                                {key.apiKeyPrefix}...
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                Created{" "}
                                                {new Date(
                                                    key.createdAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        key.apiKeyPrefix,
                                                    );
                                                    toast.success(
                                                        "Prefix copied",
                                                    );
                                                }}
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span className="sr-only">
                                                    Copy prefix
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    onRevokeApiKey(key.id)
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                <span className="sr-only">
                                                    Revoke key
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2 text-xs"
                                onClick={onCreateApiKey}
                            >
                                <Plus className="h-3 w-3" />
                                Create API Key
                            </Button>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </ScrollArea>
        </div>
    );
}
