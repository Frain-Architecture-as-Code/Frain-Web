"use client";

import { Book, ChevronRight, LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

enum DocSection {
    GetStarted = "get-started",
    Sdks = "sdks",
}

type DocNavItem = {
    title: string;
    href: string;
    section: DocSection;
};

const navigation: {
    title: string;
    section: DocSection;
    items: DocNavItem[];
}[] = [
    {
        title: "Get Started",
        section: DocSection.GetStarted,
        items: [
            {
                title: "Welcome to Frain",
                href: "/docs/get-started/welcome",
                section: DocSection.GetStarted,
            },
            {
                title: "Quick Usage",
                href: "/docs/get-started/quick-usage",
                section: DocSection.GetStarted,
            },
        ],
    },
    {
        title: "SDKs",
        section: DocSection.Sdks,
        items: [
            {
                title: "TypeScript SDK",
                href: "/docs/sdks/typescript",
                section: DocSection.Sdks,
            },
        ],
    },
];

function getAllNavItems(): DocNavItem[] {
    return navigation.flatMap((section) => section.items);
}

function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <ScrollArea className="h-full py-6 pr-4">
            <nav className="space-y-6">
                {navigation.map((section) => (
                    <div key={section.section}>
                        <h4 className="mb-2 text-sm font-semibold tracking-tight">
                            {section.title}
                        </h4>
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    className={cn(
                                        "block rounded-md px-3 py-2 text-sm transition-colors",
                                        pathname === item.href
                                            ? "bg-primary/10 font-medium text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </ScrollArea>
    );
}

function DocsPagination() {
    const pathname = usePathname();
    const allItems = getAllNavItems();
    const currentIndex = allItems.findIndex((item) => item.href === pathname);

    const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    const next =
        currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

    return (
        <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-6">
            {prev ? (
                <Link
                    href={prev.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                    {prev.title}
                </Link>
            ) : (
                <div />
            )}
            {next ? (
                <Link
                    href={next.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    {next.title}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            ) : (
                <div />
            )}
        </div>
    );
}

function DocsHeader() {
    const pathname = usePathname();
    const allItems = getAllNavItems();
    const current = allItems.find((item) => item.href === pathname);
    const section = navigation.find((s) =>
        s.items.some((item) => item.href === pathname),
    );

    return (
        <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            {section && (
                <>
                    <span>{section.title}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                </>
            )}
            {current && (
                <span className="text-foreground">{current.title}</span>
            )}
        </div>
    );
}

export default function DocsLayout({ children }: { children: ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Docs top bar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-lg font-semibold tracking-tight"
                        >
                            Frain
                        </Link>
                        <Separator orientation="vertical" className="h-5" />
                        <Link
                            href="/docs"
                            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Book className="h-4 w-4" />
                            Docs
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/organizations">
                                <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                                Go to Dashboard
                            </Link>
                        </Button>
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-7xl flex-1 px-6">
                {/* Sidebar - desktop */}
                <aside className="hidden w-56 shrink-0 border-r border-border/40 md:block">
                    <DocsSidebar />
                </aside>

                {/* Sidebar - mobile */}
                {mobileOpen && (
                    <div className="fixed inset-0 top-14 z-40 bg-background md:hidden">
                        <div className="p-6">
                            <DocsSidebar
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main className="min-w-0 flex-1 px-8 py-8 md:px-12">
                    <DocsHeader />
                    <article className="max-w-none">{children}</article>
                    <DocsPagination />
                </main>

                {/* Table of contents - desktop */}
                <aside className="hidden w-48 shrink-0 xl:block">
                    <div className="sticky top-20 py-8">
                        <TableOfContents />
                    </div>
                </aside>
            </div>
        </div>
    );
}
