"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PlayerCard } from "@/components/players/player-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PlayersDirectoryProps = {
  players: Array<{
    id: string;
    fullName: string;
    nickname: string;
    createdAt: Date;
    categoryCodes: string[];
  }>;
};

type SortKey = "recent" | "name-asc" | "name-desc";
type CategoryFilter = "all" | "A" | "B" | "C";

function getSortLabel(sortKey: SortKey) {
  switch (sortKey) {
    case "name-asc":
      return "Name A → Z";
    case "name-desc":
      return "Name Z → A";
    case "recent":
    default:
      return "Recently added";
  }
}

function isDefaultFilterState(
  sortKey: SortKey,
  categoryFilter: CategoryFilter,
) {
  return sortKey === "recent" && categoryFilter === "all";
}

export function PlayersDirectory({ players }: PlayersDirectoryProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const searched = !normalizedQuery
      ? players
      : players.filter((player) => {
          return (
            player.fullName.toLowerCase().includes(normalizedQuery) ||
            player.nickname.toLowerCase().includes(normalizedQuery) ||
            player.categoryCodes.some((code) =>
              code.toLowerCase().includes(normalizedQuery),
            )
          );
        });

    const categoryFiltered =
      categoryFilter === "all"
        ? searched
        : searched.filter((player) =>
            player.categoryCodes.includes(categoryFilter),
          );

    const sorted = [...categoryFiltered];

    sorted.sort((a, b) => {
      switch (sortKey) {
        case "name-asc":
          return a.fullName.localeCompare(b.fullName);

        case "name-desc":
          return b.fullName.localeCompare(a.fullName);

        case "recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return sorted;
  }, [players, query, sortKey, categoryFilter]);

  const hasActiveFilters = !isDefaultFilterState(sortKey, categoryFilter);

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, nickname, or category"
            className="h-10 rounded-md border-white/10 bg-white/4 pl-10 text-sm placeholder:text-muted-foreground/50"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "relative h-10 w-10 shrink-0 rounded-md transition focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0",
                hasActiveFilters
                  ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                  : "border-white/10 bg-white/4 text-muted-foreground hover:bg-white/6 hover:text-foreground",
              )}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Open player filters</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-md border border-white/10 bg-[#0b1018]/95 p-1.5 text-foreground shadow-2xl backdrop-blur-xl"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
              Sort players
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup
              value={sortKey}
              onValueChange={(value) => setSortKey(value as SortKey)}
            >
              <DropdownMenuRadioItem
                value="recent"
                className="cursor-pointer rounded-md text-sm text-foreground focus:bg-white/8"
              >
                Recently added
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="name-asc"
                className="cursor-pointer rounded-md text-sm text-foreground focus:bg-white/8"
              >
                Name A → Z
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="name-desc"
                className="cursor-pointer rounded-md text-sm text-foreground focus:bg-white/8"
              >
                Name Z → A
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator className="my-1 bg-white/10" />

            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
              Filter category
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as CategoryFilter)
              }
            >
              <DropdownMenuRadioItem
                value="all"
                className="cursor-pointer rounded-md text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                All players
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="A"
                className="cursor-pointer rounded-md text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Category A
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="B"
                className="cursor-pointer rounded-md text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Category B
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="C"
                className="cursor-pointer rounded-md text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Category C
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-xs text-muted-foreground">
        {filteredPlayers.length} player{filteredPlayers.length === 1 ? "" : "s"}
        {hasActiveFilters ? ` · ${getSortLabel(sortKey)}` : ""}
        {categoryFilter !== "all" ? ` · Category ${categoryFilter}` : ""}
      </p>

      {filteredPlayers.length === 0 ? (
        <EmptyState message="No matching players found." />
      ) : (
        <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="block rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <PlayerCard player={player} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
