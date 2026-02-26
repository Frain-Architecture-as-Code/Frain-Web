"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuthResult = {
    error?: string;
    success?: boolean;
};

export async function loginAction(formData: FormData): Promise<AuthResult> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return { error: "Invalid email or password." };
            }
        }
        throw error;
    }
}

export async function registerAction(
    formData: FormData,
    userPictureUrl: string,
): Promise<AuthResult> {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password) {
        return { error: "All fields are required." };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match." };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            image: userPictureUrl,
        },
    });

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error: "Account created but login failed. Please sign in.",
            };
        }
        throw error;
    }
}

export async function signOutAction() {
    await signOut({ redirect: false });
}

export async function oauthAction(provider: "github" | "google") {
    await signIn(provider, { redirectTo: "/dashboard" });
}
