import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Edge-safe Auth.js configuration (no Prisma, no Node.js-only modules).
 * Used by the middleware for route protection.
 */
export const authConfig = {
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/login",
    },
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize() {
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isAuthenticated = !!auth?.user;
            const publicPaths = ["/", "/auth/login", "/auth/register"];
            const isPublicRoute = publicPaths.includes(nextUrl.pathname);
            const isAuthRoute = nextUrl.pathname.startsWith("/auth");

            if (isAuthenticated && isAuthRoute) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            if (isPublicRoute) {
                return true;
            }

            return isAuthenticated;
        },
    },
} satisfies NextAuthConfig;

const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

export { auth, handlers, signIn, signOut };
