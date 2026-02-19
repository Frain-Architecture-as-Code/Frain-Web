import { CodeBlock } from "@/components/docs/code-block";
import { Separator } from "@/components/ui/separator";

export const metadata = {
    title: "Quick Usage",
};

export default function QuickUsagePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Quick Usage
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Get up and running with Frain in minutes. This guide walks
                    you through the essentials.
                </p>
            </div>

            <Separator />

            <section className="space-y-4">
                <h2
                    id="create-an-organization"
                    className="text-xl font-semibold tracking-tight"
                >
                    1. Create an Organization
                </h2>
                <p className="text-sm text-muted-foreground">
                    After signing up, create an organization to group your
                    projects. Organizations can be public (visible to everyone)
                    or private (visible only to members).
                </p>
                <p className="text-sm text-muted-foreground">
                    Navigate to the dashboard and click{" "}
                    <strong className="text-foreground">
                        New Organization
                    </strong>
                    . Give it a name and choose a visibility setting.
                </p>
            </section>

            <section className="space-y-4">
                <h2
                    id="create-a-project"
                    className="text-xl font-semibold tracking-tight"
                >
                    2. Create a Project
                </h2>
                <p className="text-sm text-muted-foreground">
                    Inside your organization, create a project. Each project
                    holds a single C4 model that describes your software
                    architecture.
                </p>
            </section>

            <section className="space-y-4">
                <h2
                    id="define-your-architecture"
                    className="text-xl font-semibold tracking-tight"
                >
                    3. Define Your Architecture
                </h2>
                <p className="text-sm text-muted-foreground">
                    Use the Frain DSL or the TypeScript SDK to define your
                    system. Here&apos;s a simple example:
                </p>
                <CodeBlock language="typescript" filename="model.ts">
                    {`import { Frain } from "@anthropic/frain-sdk";

const workspace = Frain.workspace("My System");

// Define people and systems
const user = workspace.person("User", "A user of the system");
const webApp = workspace.softwareSystem("Web Application", "Serves the UI");
const api = workspace.softwareSystem("API", "Backend services");
const database = workspace.softwareSystem("Database", "Stores data");

// Define relationships
user.uses(webApp, "Browses");
webApp.uses(api, "Makes API calls to");
api.uses(database, "Reads from and writes to");`}
                </CodeBlock>
            </section>

            <section className="space-y-4">
                <h2
                    id="view-diagrams"
                    className="text-xl font-semibold tracking-tight"
                >
                    4. View Diagrams
                </h2>
                <p className="text-sm text-muted-foreground">
                    Once your model is defined, Frain automatically generates
                    interactive diagrams. You can view System Context,
                    Container, Component, and Deployment diagrams directly in
                    the browser.
                </p>
                <p className="text-sm text-muted-foreground">
                    Diagrams are rendered using an interactive canvas that
                    supports zoom, pan, and element selection. Click on any
                    element to see its details and relationships.
                </p>
            </section>

            <section className="space-y-4">
                <h2
                    id="next-steps"
                    className="text-xl font-semibold tracking-tight"
                >
                    Next Steps
                </h2>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    <li>
                        Explore the{" "}
                        <a
                            href="/docs/sdks/typescript"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            TypeScript SDK
                        </a>{" "}
                        for programmatic access
                    </li>
                    <li>
                        Invite team members to your organization for
                        collaboration
                    </li>
                    <li>
                        Use the visual editor or code-based approach to model
                        complex systems
                    </li>
                </ul>
            </section>
        </div>
    );
}
