import { Panel, useReactFlow } from "@xyflow/react";
import { Button } from "../ui/button";
import { Focus, Layout } from "lucide-react";
import { FIT_VIEW_OPTIONS } from "./canva-utils";

export function FlowActions({
    onRelayout,
}: {
    onRelayout: () => Promise<void>;
}) {
    const { fitView } = useReactFlow();

    const onLayoutClick = async () => {
        await onRelayout();
        requestAnimationFrame(() => {
            fitView(FIT_VIEW_OPTIONS);
        });
    };

    return (
        <Panel position="top-right" className="flex gap-2">
            <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => fitView(FIT_VIEW_OPTIONS)}
                title="Center view"
            >
                <Focus />
            </Button>
            <Button
                variant={"secondary"}
                size={"icon"}
                onClick={onLayoutClick}
                title="Layout nodes"
            >
                <Layout />
            </Button>
        </Panel>
    );
}
