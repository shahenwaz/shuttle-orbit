import Link from "next/link";

import { cn } from "@/lib/utils";

type CategoryOpsNavProps = {
  tournamentId: string;
  categoryId: string;
  activeTab: "teams" | "groups" | "fixtures" | "results";
};

const navItems = [
  { key: "teams", label: "Teams" },
  { key: "groups", label: "Groups" },
  { key: "fixtures", label: "Fixtures" },
  { key: "results", label: "Results" },
] as const;

export function CategoryOpsNav({
  tournamentId,
  categoryId,
  activeTab,
}: CategoryOpsNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {navItems.map((item) => {
        const href = `/admin/tournaments/${tournamentId}/categories/${categoryId}/${item.key}`;
        const isActive = activeTab === item.key;

        return (
          <Link
            key={item.key}
            href={href}
            className={cn(
              "inline-flex h-9 items-center rounded-xl border px-3 text-xs font-medium uppercase tracking-[0.16em] transition",
              isActive
                ? "border-primary/30 bg-primary/12 text-primary"
                : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/8 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
