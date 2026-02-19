import { ArrowRight, Boxes, GitBranch, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: "Welcome to Frain",
};

const highlights = [
    {
        icon: Layers,
        title: "Model as Code",
        description:
            "Define your architecture using a TypeScript DSL. Version control your models alongside your codebase.",
    },
    {
        icon: GitBranch,
        title: "C4 Model Diagrams",
        description:
            "Automatically generate System Context, Container, Component, and Deployment diagrams from a single model.",
    },
    {
        icon: Boxes,
        title: "Collaborate",
        description:
            "Share interactive diagrams with your team. Organize work into organizations and projects.",
    },
] as const;

export default function WelcomePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome to Frain
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Frain is an open-source platform for visualizing software
                    architecture as C4 model diagrams. Define your
                    infrastructure as code and see it rendered as interactive
                    diagrams.
                </p>
            </div>

            <Separator />

            <section className="space-y-4">
                <h2
                    id="why-frain"
                    className="text-xl font-semibold tracking-tight"
                >
                    Why Frain?
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {highlights.map((item) => (
                        <Card key={item.title}>
                            <CardContent className="space-y-2 pt-6">
                                <item.icon className="h-5 w-5 text-primary" />
                                <h3 className="text-sm font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2
                    id="key-concepts"
                    className="text-xl font-semibold tracking-tight"
                >
                    Key Concepts
                </h2>
                <div className="space-y-3">
                    <div>
                        <h3
                            id="organizations"
                            className="text-sm font-semibold"
                        >
                            Organizations
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Group your projects under organizations. Control
                            access with public or private visibility settings.
                        </p>
                    </div>
                    <div>
                        <h3 id="projects" className="text-sm font-semibold">
                            Projects
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Each project contains a C4 model definition.
                            Projects can be public or private within an
                            organization.
                        </p>
                    </div>
                    <div>
                        <h3
                            id="c4-model-views"
                            className="text-sm font-semibold"
                        >
                            C4 Model Views
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Generate multiple diagram types from a single model:
                            System Context, Container, Component, and Deployment
                            views.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2
                    id="get-started"
                    className="text-xl font-semibold tracking-tight"
                >
                    Get Started
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/docs/get-started/quick-usage"
                        className="group inline-flex items-center gap-1 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Quick Usage Guide
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                        href="/docs/sdks/typescript"
                        className="group inline-flex items-center gap-1 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        TypeScript SDK
                        <Badge variant="secondary" className="ml-1 text-xs">
                            New
                        </Badge>
                    </Link>
                </div>
            </section>
        </div>
    );
}
