import { ArrowLeft, Home, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import FallbackLayout from "@/components/fallback-layout";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Page() {
    const session = await auth();
    const isAuthenticated = !!session?.user;

    return (
        <FallbackLayout>
            <div className="flex flex-col items-center justify-center px-4 flex-1">
                <div className="flex max-w-sm flex-col items-center text-center">
                    <p className="mb-2 text-4xl font-medium">401</p>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Unauthorized
                    </h1>

                    <p className="mt-3 text-sm">
                        {isAuthenticated
                            ? "You don\u0027t have permission to access this resource."
                            : "You need to sign in to access this page."}
                    </p>

                    <div className="mt-8 flex gap-3">
                        {isAuthenticated ? (
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard">
                                        <ArrowLeft className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                        Home
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/auth/register">
                                        <UserPlus className="h-4 w-4" />
                                        Sign Up
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/auth/login">
                                        <LogIn className="h-4 w-4" />
                                        Sign In
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </FallbackLayout>
    );
}
