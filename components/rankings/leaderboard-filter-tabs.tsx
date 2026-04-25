import Link from "next/link";

import { cn } from "@/lib/utils";

type LeaderboardFilterTabsProps = {
  activeValue: string;
  categoryCodes: string[];
};

const BASE_ITEMS = [{ label: "Universal", value: "universal" }] as const;

export function LeaderboardFilterTabs({
  activeValue,
  categoryCodes,
}: LeaderboardFilterTabsProps) {
  const items = [
    ...BASE_ITEMS,
    ...categoryCodes.map((code) => ({
      label: code,
      value: code.toLowerCase(),
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = activeValue === item.value;

        const href =
          item.value === "universal"
            ? "/leaderboard"
            : `/leaderboard?category=${item.value}`;

        return (
          <Link
            key={item.value}
            href={href}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm",
              isActive
                ? "border-primary/30 bg-primary/12 text-foreground"
                : "border-white/10 bg-white/4 text-muted-foreground hover:bg-white/8 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
