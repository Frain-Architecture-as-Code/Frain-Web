import { ReactFlowProvider } from "@xyflow/react";
import type { ReactNode } from "react";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    return (
        <ReactFlowProvider>
            <div className="h-screen w-screen overflow-hidden">{children}</div>
        </ReactFlowProvider>
    );
}
