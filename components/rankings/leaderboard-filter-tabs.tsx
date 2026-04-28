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
              "inline-flex h-8 items-center rounded-md border px-3 text-[11px] font-medium transition sm:h-9 sm:px-4 sm:text-sm",
              isActive
                ? "border-primary/30 bg-primary/12 text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
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
