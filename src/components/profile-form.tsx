"use client";

import { Camera, Save, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.image);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const hasNameChanged = name !== user.name;

    async function handleNameSubmit(event: React.FormEvent) {
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
    ) {
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

    async function handleRemoveAvatar() {
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
        <div className="space-y-6">
            <BlurFade delay={0.05}>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Profile
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your personal information.
                    </p>
                </div>
            </BlurFade>

            <BlurFade delay={0.1}>
                <Card>
                    <CardHeader>
                        <CardTitle>Avatar</CardTitle>
                        <CardDescription>
                            Click on your avatar to upload a new photo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                    className="group relative"
                                >
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            src={avatarUrl ?? undefined}
                                            alt={name || "User"}
                                        />
                                        <AvatarFallback className="text-lg">
                                            {getInitials(name, user.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Camera className="h-5 w-5 text-white" />
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
                        {isUploading && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Uploading...
                            </p>
                        )}
                    </CardContent>
                </Card>
            </BlurFade>

            <BlurFade delay={0.15}>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your name and view your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="profile-email">Email</Label>
                                    <Badge
                                        variant="destructive"
                                        className="text-[10px]"
                                    >
                                        Cannot change
                                    </Badge>
                                </div>
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
        </div>
    );
}
