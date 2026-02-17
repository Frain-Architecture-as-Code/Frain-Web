"use client";

import { Copy, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    canCreateKeys,
    canRevokeKey,
    filterVisibleKeys,
} from "@/lib/permissions";
import type { MemberResponse, MemberRole } from "@/services/members/types";
import type { ProjectApiKeyResponse } from "@/services/project-api-keys/types";

export interface ApiKeyWithFull extends ProjectApiKeyResponse {
    fullKey?: string;
}

interface ApiKeysSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    apiKeys: ApiKeyWithFull[];
    members: MemberResponse[];
    currentUserId: string;
    currentUserRole: MemberRole;
    onCreateApiKey: () => void;
    onRevokeApiKey: (apiKeyId: string) => Promise<void>;
    isLoading?: boolean;
}

export function ApiKeysSheet({
    open,
    onOpenChange,
    apiKeys,
    members,
    currentUserId,
    currentUserRole,
    onCreateApiKey,
    onRevokeApiKey,
    isLoading = false,
}: ApiKeysSheetProps) {
    const [keyToRevoke, setKeyToRevoke] = useState<{
        id: string;
        prefix: string;
        memberName: string;
    } | null>(null);
    const [isRevoking, setIsRevoking] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

    const filteredKeys = useMemo(
        () =>
            filterVisibleKeys(apiKeys, currentUserRole, currentUserId, members),
        [apiKeys, currentUserRole, currentUserId, members],
    );

    const canCreate = canCreateKeys(currentUserRole);
    const canRevoke = canRevokeKey(currentUserRole);

    function getMemberName(memberId: string): string {
        const member = members.find((m) => m.memberId === memberId);
        return member?.memberName || "Unknown";
    }

    function getMemberRole(memberId: string): string {
        const member = members.find((m) => m.memberId === memberId);
        return member?.memberRole || "Unknown";
    }

    function toggleKeyVisibility(keyId: string): void {
        setVisibleKeys((prev) => ({
            ...prev,
            [keyId]: !prev[keyId],
        }));
    }

    function handleCopyKey(key: ApiKeyWithFull): void {
        navigator.clipboard.writeText(key.apiKeyPrefix);
        toast.success("API key copied to clipboard");
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
        return `${Math.floor(diffDays / 365)}y ago`;
    }

    function handleRevokeClick(
        keyId: string,
        prefix: string,
        memberId: string,
    ): void {
        const memberName = getMemberName(memberId);
        setKeyToRevoke({ id: keyId, prefix, memberName });
    }

    async function handleConfirmRevoke(): Promise<void> {
        if (!keyToRevoke) return;

        setIsRevoking(true);
        try {
            await onRevokeApiKey(keyToRevoke.id);
            toast.success("API key revoked successfully");
            setKeyToRevoke(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to revoke API key",
            );
        } finally {
            setIsRevoking(false);
        }
    }

    function renderKeyDisplay(key: ApiKeyWithFull): React.ReactNode {
        console.log("KEY", key);
        return (
            <span className="font-mono text-xs">
                {key.apiKeyPrefix.slice(0, 16)}...
            </span>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-3xl">
                <SheetHeader>
                    <SheetTitle>API Keys Management</SheetTitle>
                    <SheetDescription>
                        Manage API keys for this project. Keys provide
                        programmatic access to the project resources.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4 px-4">
                    {canCreate && (
                        <div className="flex justify-end">
                            <Button
                                onClick={onCreateApiKey}
                                size="sm"
                                disabled={isLoading}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create New API Key
                            </Button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="mt-4 text-sm text-muted-foreground">
                                Loading API keys...
                            </p>
                        </div>
                    ) : filteredKeys.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                No API keys found
                            </p>
                            {canCreate && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Create a new API key to get started
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>API Key</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Last Used</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredKeys.map((key) => (
                                        <TableRow key={key.id}>
                                            <TableCell>
                                                {renderKeyDisplay(key)}
                                            </TableCell>
                                            <TableCell>
                                                {getMemberName(key.memberId)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                                    {getMemberRole(
                                                        key.memberId,
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(key.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {key.lastUsedAt
                                                    ? formatDate(key.lastUsedAt)
                                                    : "Never"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleCopyKey(key)
                                                        }
                                                        disabled={isRevoking}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Copy key
                                                        </span>
                                                    </Button>
                                                    {canRevoke && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                handleRevokeClick(
                                                                    key.id,
                                                                    key.apiKeyPrefix,
                                                                    key.memberId,
                                                                )
                                                            }
                                                            disabled={
                                                                isRevoking
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Revoke key
                                                            </span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
                        <p className="font-medium">Permissions:</p>
                        <ul className="mt-2 space-y-1">
                            {currentUserRole === "OWNER" && (
                                <>
                                    <li>• You can view all API keys</li>
                                    <li>
                                        • You can create API keys for any member
                                    </li>
                                    <li>• You can revoke any API key</li>
                                </>
                            )}
                            {currentUserRole === "ADMIN" && (
                                <>
                                    <li>• You can view all API keys</li>
                                    <li>
                                        • You can create API keys for
                                        contributors only
                                    </li>
                                    <li>• Only owners can revoke API keys</li>
                                </>
                            )}
                            {currentUserRole === "CONTRIBUTOR" && (
                                <>
                                    <li>
                                        • You can only view your own API key
                                    </li>
                                    <li>
                                        • Only admins and owners can create API
                                        keys
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                <AlertDialog
                    open={keyToRevoke !== null}
                    onOpenChange={(open) => !open && setKeyToRevoke(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to revoke the API key{" "}
                                <span className="font-mono font-semibold">
                                    {keyToRevoke?.prefix}...
                                </span>{" "}
                                for{" "}
                                <span className="font-semibold">
                                    {keyToRevoke?.memberName}
                                </span>
                                ? This action cannot be undone and the key will
                                immediately stop working.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isRevoking}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmRevoke}
                                disabled={isRevoking}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isRevoking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Revoking...
                                    </>
                                ) : (
                                    "Revoke Key"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SheetContent>
        </Sheet>
    );
}
