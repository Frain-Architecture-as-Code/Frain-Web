import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <Link
                href="/"
                className="mb-8 text-xl font-semibold tracking-tight"
            >
                Frain
            </Link>
            {children}
        </div>
    );
}
