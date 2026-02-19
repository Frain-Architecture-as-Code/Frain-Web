import { type BundledLanguage, codeToHtml } from "shiki";

type CodeBlockProps = {
    children: string;
    language?: BundledLanguage;
    filename?: string;
};

export async function CodeBlock({
    children,
    language = "typescript",
    filename,
}: CodeBlockProps): Promise<React.ReactElement> {
    const html = await codeToHtml(children.trim(), {
        lang: language,
        theme: "github-dark",
    });

    return (
        <div className="not-prose overflow-hidden rounded-lg border border-border/60">
            {filename && (
                <div className="border-b border-border/40 bg-zinc-900 px-4 py-2 dark:bg-zinc-800">
                    <span className="text-xs text-zinc-400">{filename}</span>
                </div>
            )}
            <div
                className="overflow-x-auto [&_pre]:!rounded-none [&_pre]:!p-4 [&_code]:text-sm"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML from code strings
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
