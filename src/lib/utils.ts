import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 50%)`;
}

export async function generateAvatarFile(
    name: string,
    size = 256,
): Promise<File> {
    const letter = name.trim().charAt(0).toUpperCase();
    const color = stringToColor(name);

    // Crear canvas
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Canvas context not supported");
    }

    // Fondo
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // Letra
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size / 2}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, size / 2, size / 2);

    // Convertir a blob
    const blob = await canvas.convertToBlob({ type: "image/png" });

    return new File([blob], `avatar-${name}.png`, {
        type: "image/png",
    });
}
