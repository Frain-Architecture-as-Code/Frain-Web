import { ArrowRight, Boxes, GitBranch, Layers } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

function Navbar() {
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

function Hero() {
    return (
        <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center md:pt-32 md:pb-24">
            <div className="mb-4 inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                Open-source Structurizr alternative
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
                Infrastructure as
                <br />
                <span className="text-muted-foreground">diagrams.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
                Visualize, document, and share your software architecture. Model
                your systems with code, see them as diagrams.
            </p>
            <div className="mt-8 flex gap-3">
                <Button size="lg" asChild>
                    <Link href="/auth/register">
                        Start Building
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/login">Sign In</Link>
                </Button>
            </div>
        </section>
    );
}

const features = [
    {
        icon: Layers,
        title: "Model as Code",
        description:
            "Define your architecture using a simple DSL. Version control your models alongside your code.",
    },
    {
        icon: GitBranch,
        title: "Multiple Views",
        description:
            "Generate system context, container, component, and deployment diagrams from a single model.",
    },
    {
        icon: Boxes,
        title: "Collaborate",
        description:
            "Share interactive diagrams with your team. Keep everyone aligned on system design.",
    },
] as const;

function Features() {
    return (
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-3">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-lg border border-border/40 bg-card p-6"
                    >
                        <feature.icon className="mb-3 h-5 w-5 text-muted-foreground" />
                        <h3 className="mb-2 text-sm font-semibold">
                            {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-border/40 py-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                <p className="text-xs text-muted-foreground">
                    Frain &mdash; Infrastructure as diagrams.
                </p>
                <p className="text-xs text-muted-foreground">Open source</p>
            </div>
        </footer>
    );
}

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <Features />
            </main>
            <Footer />
        </div>
    );
}
