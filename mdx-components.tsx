import type { MDXComponents } from "mdx/types";
import { type ComponentPropsWithoutRef } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function useMDXComponents(): MDXComponents {
    return {
        h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => (
            <h1 className="text-3xl font-bold tracking-tight" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
            <h2
                className="mt-8 text-xl font-semibold tracking-tight"
                {...props}
            >
                {children}
            </h2>
        ),
        h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
            <h3 className="mt-4 text-sm font-semibold" {...props}>
                {children}
            </h3>
        ),
        p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => {
            return (
                <p className="mt-3 text-sm text-muted-foreground" {...props}>
                    {children}
                </p>
            );
        },
        a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
            <a
                href={href}
                className="font-medium text-primary underline-offset-4 hover:underline"
                {...props}
            >
                {children}
            </a>
        ),
        ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
            <ul
                className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground"
                {...props}
            >
                {children}
            </ul>
        ),
        ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
            <ol
                className="mt-3 list-inside list-decimal space-y-2 text-sm text-muted-foreground"
                {...props}
            >
                {children}
            </ol>
        ),
        li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
            <li className="text-sm text-muted-foreground" {...props}>
                {children}
            </li>
        ),
        strong: ({
            children,
            ...props
        }: ComponentPropsWithoutRef<"strong">) => (
            <strong className="font-semibold text-foreground" {...props}>
                {children}
            </strong>
        ),
        hr: () => <Separator className="my-6" />,
        pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
            <pre
                className={cn(
                    "mt-4 overflow-x-auto rounded-lg border border-border/60 bg-zinc-950 p-4 text-sm",
                    "[&>code]:bg-transparent [&>code]:p-0 [&>code]:text-sm",
                )}
                {...props}
            >
                {children}
            </pre>
        ),
        code: ({
            children,
            className,
            ...props
        }: ComponentPropsWithoutRef<"code">) => {
            const isInline = !className;
            if (isInline) {
                return (
                    <code
                        className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
                        {...props}
                    >
                        {children}
                    </code>
                );
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        blockquote: ({
            children,
            ...props
        }: ComponentPropsWithoutRef<"blockquote">) => (
            <blockquote
                className="mt-4 border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground"
                {...props}
            >
                {children}
            </blockquote>
        ),
        table: ({ children, ...props }) => (
            <div className="mt-4 overflow-x-auto">
                <Table {...props}>{children}</Table>
            </div>
        ),
        thead: ({ children, ...props }) => (
            <TableHeader {...props}>{children}</TableHeader>
        ),
        tbody: ({ children, ...props }) => (
            <TableBody {...props}>{children}</TableBody>
        ),
        tr: ({ children, ...props }) => (
            <TableRow {...props}>{children}</TableRow>
        ),
        th: ({ children, ...props }) => (
            <TableHead {...props}>{children}</TableHead>
        ),
        td: ({ children, ...props }) => (
            <TableCell {...props}>{children}</TableCell>
        ),
    };
}
