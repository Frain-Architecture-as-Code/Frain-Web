"use client";

import { Camera, Save, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    updateAvatarAction,
    updateProfileAction,
} from "@/services/auth/actions/profile";

interface ProfileFormProps {
    user: {
        name: string;
        email: string;
        image: string | null;
    };
}

function getInitials(name: string, email: string): string {
    if (name) {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }
    if (email) {
        return email[0].toUpperCase();
    }
    return "U";
}

async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        throw new Error("Cloudinary cloud name is not configured.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "frain_avatars");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
    );

    if (!response.ok) {
        throw new Error("Failed to upload image.");
    }

    const data = await response.json();
    return data.secure_url as string;
}

function DeleteAccountDialog({ userEmail }: { userEmail: string }) {
    const [confirmEmail, setConfirmEmail] = useState("");
    const isConfirmed = confirmEmail === userEmail;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is permanent and cannot be undone. All your
                        data, workspaces, and projects will be permanently
                        deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 py-2">
                    <Label htmlFor="confirm-email">
                        Type{" "}
                        <span className="font-semibold text-foreground">
                            {userEmail}
                        </span>{" "}
                        to confirm
                    </Label>
                    <Input
                        id="confirm-email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        placeholder={userEmail}
                        autoComplete="off"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmEmail("")}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={!isConfirmed}
                        onClick={() => {
                            toast.error(
                                "Account deletion is not available yet.",
                            );
                        }}
                    >
                        Delete Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.image);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const hasNameChanged = name !== user.name;

    async function handleNameSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();

        if (!name.trim() || !hasNameChanged) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.set("name", name);

        const result = await updateProfileAction(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Profile updated successfully.");
            router.refresh();
        }

        setIsSaving(false);
    }

    async function handleFileSelected(
        event: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        setIsUploading(true);

        try {
            const url = await uploadToCloudinary(file);
            setAvatarUrl(url);

            const result = await updateAvatarAction(url);
            if (result.error) {
                toast.error(result.error);
                setAvatarUrl(user.image);
            } else {
                toast.success("Avatar updated successfully.");
                router.refresh();
            }
        } catch {
            toast.error("Failed to upload avatar. Please try again.");
            setAvatarUrl(user.image);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    async function handleRemoveAvatar(): Promise<void> {
        setIsUploading(true);
        setAvatarUrl(null);

        const result = await updateAvatarAction("");
        if (result.error) {
            toast.error(result.error);
            setAvatarUrl(user.image);
        } else {
            toast.success("Avatar removed.");
            router.refresh();
        }

        setIsUploading(false);
    }

    return (
        <div className="mx-auto w-full max-w-2xl space-y-8 py-4">
            <BlurFade delay={0.05}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        My Account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your Frain account.
                    </p>
                </div>
            </BlurFade>

            <BlurFade delay={0.1}>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={isUploading}>
                                <button
                                    type="button"
                                    className="group relative shrink-0"
                                >
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={avatarUrl ?? undefined}
                                            alt={name || "User"}
                                        />
                                        <AvatarFallback className="text-lg">
                                            {getInitials(name, user.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Camera className="h-4 w-4 text-white" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onSelect={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload photo
                                </DropdownMenuItem>
                                {avatarUrl && (
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onSelect={handleRemoveAvatar}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove photo
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="min-w-0 flex-1">
                            <CardTitle className="truncate">
                                {user.name || "User"}
                            </CardTitle>
                            <CardDescription className="truncate">
                                {user.email}
                            </CardDescription>
                        </div>
                        {isUploading && (
                            <p className="text-xs text-muted-foreground">
                                Uploading...
                            </p>
                        )}
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6">
                        <form onSubmit={handleNameSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="profile-name">Name</Label>
                                <Input
                                    id="profile-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profile-email">Email</Label>
                                <Input
                                    id="profile-email"
                                    value={user.email}
                                    disabled
                                    className="opacity-60"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSaving || !hasNameChanged}
                                size="sm"
                            >
                                <Save className="mr-1 h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </BlurFade>

            <BlurFade delay={0.15}>
                <Card className="border-destructive/30">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Permanently delete your account and all associated
                            data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeleteAccountDialog userEmail={user.email} />
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
