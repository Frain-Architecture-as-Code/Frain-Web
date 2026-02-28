import ProjectListItemSkeleton from "@/components/project/project-list-item-skeleton";

const NRO_ITEMS = 6;

export default function ProjectsLoadingScreen() {
    const loadingItems = Array.from({ length: NRO_ITEMS });

    return (
        <div className="flex flex-col gap-3">
            {loadingItems.map((_, index) => (
                <ProjectListItemSkeleton key={index} />
            ))}
        </div>
    );
}
