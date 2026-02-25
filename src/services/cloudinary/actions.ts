"use server";

export async function uploadToCloudinary(file: File): Promise<string> {
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
