import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function HomeNavbar() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight"
                    >
                        Frain
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/docs"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Docs
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href="https://github.com/Frain-Architecture-as-Code"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </Button>
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <Button size="sm" asChild>
                            <Link href="/dashboard">
                                Go to Dashboard
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/auth/login">Sign In</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/auth/register">
                                    Get Started
                                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
