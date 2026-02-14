"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ProfileResult = {
    error?: string;
    success?: boolean;
};

export async function updateProfileAction(
    formData: FormData,
): Promise<ProfileResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to update your profile." };
    }

    const name = formData.get("name") as string;

    if (!name?.trim()) {
        return { error: "Name is required." };
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name.trim() },
    });

    return { success: true };
}

export async function updateAvatarAction(
    imageUrl: string,
): Promise<ProfileResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "You must be logged in to update your avatar." };
    }

    if (!imageUrl) {
        return { error: "Image URL is required." };
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { image: imageUrl },
    });

    return { success: true };
}
