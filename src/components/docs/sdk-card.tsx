import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SdkCardProps = {
    name: string;
    icon: ReactNode;
    href?: string;
    comingSoon?: boolean;
};

export default function SdkCard({
    name,
    icon,
    href,
    comingSoon = false,
}: SdkCardProps) {
    const content = (
        <div
            className={cn(
                "relative flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-card p-6 text-center transition-colors",
                comingSoon
                    ? "cursor-default opacity-60"
                    : "hover:border-primary/40 hover:bg-accent/50",
            )}
        >
            {comingSoon && (
                <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 text-[10px]"
                >
                    Coming Soon
                </Badge>
            )}
            <div className="flex h-12 w-12 items-center justify-center">
                {icon}
            </div>
            <span className="text-sm font-medium">{name}</span>
        </div>
    );

    if (comingSoon || !href) {
        return content;
    }

    return (
        <Link href={href} className="no-underline">
            {content}
        </Link>
    );
}
