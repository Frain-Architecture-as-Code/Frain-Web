import { Button } from "../ui/button";
import Link from "next/link";

export enum IconPosition {
    Left = "left",
    Right = "right",
}

export default function AnchorButton({
    href,
    text,
    children,
    iconPosition = IconPosition.Left,
}: {
    href: string;
    text?: string;
    children?: React.ReactNode;
    iconPosition: IconPosition;
}) {
    return (
        <Button asChild>
            <Link href={href}>
                {iconPosition === IconPosition.Left && children}
                {text}
                {iconPosition === IconPosition.Right && children}
            </Link>
        </Button>
    );
}
