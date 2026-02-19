import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function HomeNavbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                    Frain
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/auth/register">
                            Get Started
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
