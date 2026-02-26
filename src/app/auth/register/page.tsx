"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { type AuthResult, registerAction } from "@/services/auth/actions/auth";
import { OAuthButtons } from "@/components/oauth-buttons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { generateAvatarFile } from "@/lib/utils";
import { uploadToCloudinary } from "@/services/cloudinary/actions";

export default function RegisterPage() {
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(
        async (_prev: AuthResult | null, formData: FormData) => {
            const userPicture = await generateAvatarFile(
                formData.get("name") as string,
            );
            const userPictureUrl = await uploadToCloudinary(userPicture);
            const result = await registerAction(formData, userPictureUrl);
            return result;
        },
        null,
    );

    useEffect(() => {
        if (state?.success) {
            toast.success("Account created successfully!");
            router.push("/dashboard");
        }
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>
                    Get started with Frain for free
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <OAuthButtons />
                <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <Separator className="flex-1" />
                </div>
                <form action={formAction} className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            required
                            autoComplete="name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Min. 8 characters"
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Repeat your password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Creating account..." : "Create Account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
