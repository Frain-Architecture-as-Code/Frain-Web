"use client";

import { Camera, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    CldUploadWidget,
    type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useState } from "react";
import { toast } from "sonner";
import { updateAvatarAction, updateProfileAction } from "@/actions/profile";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.image);
    const [isSaving, setIsSaving] = useState(false);

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

    async function handleAvatarUpload(result: CloudinaryUploadWidgetResults) {
        if (typeof result.info === "string" || !result.info?.secure_url) return;
        const url = result.info.secure_url;

        setAvatarUrl(url);
        const updateResult = await updateAvatarAction(url);

        if (updateResult.error) {
            toast.error(updateResult.error);
            setAvatarUrl(user.image);
        } else {
            toast.success("Avatar updated successfully.");
            router.refresh();
        }
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
                        <CldUploadWidget
                            uploadPreset="frain_avatars"
                            options={{
                                maxFiles: 1,
                                cropping: true,
                                croppingAspectRatio: 1,
                                sources: ["local", "url", "camera"],
                            }}
                            onSuccess={handleAvatarUpload}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
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
                            )}
                        </CldUploadWidget>
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
