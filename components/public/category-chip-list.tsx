import { cn } from "@/lib/utils";

type CategoryChip = {
  id: string;
  label: string;
};

type CategoryChipListProps = {
  categories: CategoryChip[];
  className?: string;
};

export function CategoryChipList({
  categories,
  className,
}: CategoryChipListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((category) => (
        <span
          key={category.id}
          className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-foreground"
        >
          {category.label}
        </span>
      ))}
    </div>
  );
}
