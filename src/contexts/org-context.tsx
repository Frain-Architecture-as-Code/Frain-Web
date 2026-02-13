"use client";

import { createContext, type ReactNode, use } from "react";
import type { OrganizationResponse } from "@/services/organizations/types";

interface OrgContextValue {
    organization: OrganizationResponse;
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function useOrg(): OrgContextValue {
    const context = use(OrgContext);
    if (!context) {
        throw new Error("useOrg must be used within an OrgProvider");
    }
    return context;
}

export function OrgProvider({
    organization,
    children,
}: {
    organization: OrganizationResponse;
    children: ReactNode;
}) {
    return <OrgContext value={{ organization }}>{children}</OrgContext>;
}
