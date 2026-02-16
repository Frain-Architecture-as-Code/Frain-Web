"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { filterAvailableMembers } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import type { MemberResponse, MemberRole } from "@/services/members/types";

interface CreateApiKeyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: MemberResponse[];
    currentUserRole: MemberRole;
    onCreateApiKey: (memberId: string) => void;
    isLoading?: boolean;
}

export function CreateApiKeyModal({
    open,
    onOpenChange,
    members,
    currentUserRole,
    onCreateApiKey,
    isLoading = false,
}: CreateApiKeyModalProps) {
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [comboboxOpen, setComboboxOpen] = useState(false);

    // Filter members based on current user's role
    const availableMembers = useMemo(
        () => filterAvailableMembers(members, currentUserRole),
        [members, currentUserRole],
    );

    function handleCreate(): void {
        if (!selectedMemberId) return;
        onCreateApiKey(selectedMemberId);
        setSelectedMemberId("");
    }

    function handleCancel(): void {
        setSelectedMemberId("");
        onOpenChange(false);
    }

    const selectedMember = availableMembers.find(
        (m) => m.memberId === selectedMemberId,
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                    <DialogDescription>
                        Select a member to create an API key for. The key will
                        be shown only once after creation.
                        {currentUserRole === "ADMIN" && (
                            <span className="mt-1 block text-xs text-muted-foreground">
                                As an admin, you can only create keys for
                                contributors.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={comboboxOpen}
                                className="w-full justify-between"
                                disabled={
                                    isLoading || availableMembers.length === 0
                                }
                            >
                                {selectedMember
                                    ? selectedMember.memberName
                                    : availableMembers.length === 0
                                      ? "No members available"
                                      : "Select member..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search member..." />
                                <CommandList>
                                    <CommandEmpty>
                                        No member found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {availableMembers.map((member) => (
                                            <CommandItem
                                                key={member.memberId}
                                                value={member.memberName}
                                                onSelect={() => {
                                                    setSelectedMemberId(
                                                        member.memberId,
                                                    );
                                                    setComboboxOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedMemberId ===
                                                            member.memberId
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span>
                                                        {member.memberName}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {member.memberRole}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!selectedMemberId || isLoading}
                    >
                        {isLoading ? "Creating..." : "Create API Key"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
