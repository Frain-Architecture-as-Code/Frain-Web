import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function FeatureCard({
    icon: Icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <Card>
            <CardContent className="space-y-2">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
