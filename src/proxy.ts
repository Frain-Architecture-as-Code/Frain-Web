import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth.config";

export async function proxy(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    const publicPaths = ["/", "/auth/login", "/auth/register"];
    const isPublicRoute = publicPaths.includes(pathname);
    const isAuthRoute = pathname.startsWith("/auth");

    // Redirect authenticated users away from auth pages
    if (session?.user && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login for protected routes
    if (!session?.user && !isPublicRoute) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
            new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
