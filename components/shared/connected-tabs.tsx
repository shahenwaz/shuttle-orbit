import Link from "next/link";

import { cn } from "@/lib/utils";

export type ConnectedTabItem<TValue extends string = string> = {
  value: TValue;
  label: string;
  href: string;
};

type ConnectedTabsProps<TValue extends string = string> = {
  items: ConnectedTabItem<TValue>[];
  activeValue: TValue;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export function ConnectedTabs<TValue extends string = string>({
  items,
  activeValue,
  className,
  activeClassName,
  inactiveClassName,
}: ConnectedTabsProps<TValue>) {
  return (
    <div
      className={cn(
        "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <nav className="flex min-w-max items-end gap-1">
        {items.map((item) => {
          const isActive = item.value === activeValue;

          return (
            <Link
              key={item.value}
              href={item.href}
              className={cn(
                "relative -mb-px rounded-t-md px-2.5 py-1.5 text-[11px] font-semibold transition sm:px-4 sm:py-2 sm:text-sm",
                isActive
                  ? cn("bg-[#0b1118] text-foreground", activeClassName)
                  : cn(
                      "bg-white/8 text-muted-foreground hover:bg-white/12 hover:text-foreground",
                      inactiveClassName,
                    ),
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
