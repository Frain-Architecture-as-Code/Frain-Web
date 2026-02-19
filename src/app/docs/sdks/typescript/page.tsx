import { CodeBlock } from "@/components/docs/code-block";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: "TypeScript SDK",
};

export default function TypeScriptSdkPage() {
    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        TypeScript SDK
                    </h1>
                    <Badge variant="secondary">Beta</Badge>
                </div>
                <p className="mt-3 text-lg text-muted-foreground">
                    Define and manage your C4 architecture models
                    programmatically using TypeScript.
                </p>
            </div>

            <Separator />

            <section className="space-y-4">
                <h2
                    id="installation"
                    className="text-xl font-semibold tracking-tight"
                >
                    Installation
                </h2>
                <CodeBlock language="bash" filename="terminal">
                    {`npm install @anthropic/frain-sdk
# or
bun add @anthropic/frain-sdk`}
                </CodeBlock>
            </section>

            <section className="space-y-4">
                <h2
                    id="authentication"
                    className="text-xl font-semibold tracking-tight"
                >
                    Authentication
                </h2>
                <p className="text-sm text-muted-foreground">
                    Configure the SDK with your API token. You can generate a
                    token from your account settings in the Frain dashboard.
                </p>
                <CodeBlock language="typescript" filename="config.ts">
                    {`import { FrainClient } from "@anthropic/frain-sdk";

const client = new FrainClient({
    apiKey: process.env.FRAIN_API_KEY,
    baseUrl: "https://api.frain.dev", // optional, defaults to production
});`}
                </CodeBlock>
            </section>

            <section className="space-y-4">
                <h2
                    id="quick-example"
                    className="text-xl font-semibold tracking-tight"
                >
                    Quick Example
                </h2>
                <p className="text-sm text-muted-foreground">
                    Here&apos;s a complete example of defining a workspace,
                    creating a model, and pushing it to Frain:
                </p>
                <CodeBlock language="typescript" filename="example.ts">
                    {`import { FrainClient, Workspace } from "@anthropic/frain-sdk";

const client = new FrainClient({
    apiKey: process.env.FRAIN_API_KEY,
});

// Create a workspace
const workspace = new Workspace("E-Commerce Platform");

// Define software systems
const storefront = workspace.addSoftwareSystem(
    "Storefront",
    "Customer-facing web application"
);

const api = workspace.addSoftwareSystem(
    "API Gateway",
    "Routes requests to microservices"
);

const payments = workspace.addSoftwareSystem(
    "Payment Service",
    "Handles payment processing"
);

const database = workspace.addSoftwareSystem(
    "Database",
    "PostgreSQL data store"
);

// Define relationships
storefront.uses(api, "REST/JSON");
api.uses(payments, "gRPC");
api.uses(database, "SQL");

// Push to Frain
await client.projects.push("org-id", "project-id", workspace);
console.log("Model pushed successfully!");`}
                </CodeBlock>
            </section>

            <section className="space-y-4">
                <h2
                    id="api-reference"
                    className="text-xl font-semibold tracking-tight"
                >
                    API Reference
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Card>
                        <CardContent className="space-y-1 pt-6">
                            <h3
                                id="frainclient"
                                className="text-sm font-semibold"
                            >
                                FrainClient
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Main client for interacting with the Frain API.
                                Handles authentication and request management.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="space-y-1 pt-6">
                            <h3
                                id="workspace"
                                className="text-sm font-semibold"
                            >
                                Workspace
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Root container for your C4 model. Holds all
                                software systems, people, and relationships.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="space-y-1 pt-6">
                            <h3
                                id="softwaresystem"
                                className="text-sm font-semibold"
                            >
                                SoftwareSystem
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Represents a software system in your
                                architecture. Can contain containers and
                                components.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="space-y-1 pt-6">
                            <h3
                                id="container"
                                className="text-sm font-semibold"
                            >
                                Container
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                A deployable unit within a software system
                                (e.g., web app, API, database).
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="space-y-4">
                <h2
                    id="cicd-integration"
                    className="text-xl font-semibold tracking-tight"
                >
                    CI/CD Integration
                </h2>
                <p className="text-sm text-muted-foreground">
                    Use the SDK in your CI/CD pipeline to keep diagrams in sync
                    with your codebase. Here&apos;s a GitHub Actions example:
                </p>
                <CodeBlock
                    language="yaml"
                    filename=".github/workflows/frain.yml"
                >
                    {`name: Update Architecture Diagrams
on:
  push:
    branches: [main]
    paths: ["architecture/**"]

jobs:
  update-diagrams:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run architecture/push.ts
        env:
          FRAIN_API_KEY: \${{ secrets.FRAIN_API_KEY }}`}
                </CodeBlock>
            </section>
        </div>
    );
}
