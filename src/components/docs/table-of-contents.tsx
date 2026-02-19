"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = {
    id: string;
    text: string;
    level: number;
};

export function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const article = document.querySelector("article");
        if (!article) return;

        const elements = article.querySelectorAll("h2[id], h3[id]");
        const items: Heading[] = Array.from(elements).map((el) => ({
            id: el.id,
            text: el.textContent ?? "",
            level: Number(el.tagName.charAt(1)),
        }));

        setHeadings(items);
    }, []);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: "0px 0px -80% 0px", threshold: 0.1 },
        );

        for (const { id } of headings) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="space-y-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On This Page
            </p>
            {headings.map((heading) => (
                <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={cn(
                        "block text-xs leading-6 transition-colors hover:text-foreground",
                        heading.level === 3 && "pl-3",
                        activeId === heading.id
                            ? "font-medium text-primary"
                            : "text-muted-foreground",
                    )}
                >
                    {heading.text}
                </a>
            ))}
        </nav>
    );
}
