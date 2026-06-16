"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import { AdminPlayerCard } from "@/components/admin/players/admin-player-card";
import { EmptyState } from "@/components/shared/empty-state";
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

type ClubOption = {
  id: string;
  name: string;
  shortName: string | null;
};

type AdminPlayersDirectoryProps = {
  clubs: ClubOption[];
  players: Array<{
    id: string;
    fullName: string;
    nickname: string | null;
    createdAt: Date;
    clubId: string | null;
    club: ClubOption | null;
    categoryCodes: string[];
  }>;
};

type SortKey = "recent" | "name-asc" | "name-desc";
type CategoryFilter = "all" | "A" | "B" | "C";
type ClubFilter = "all" | "none" | string;

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
  clubFilter: ClubFilter,
) {
  return (
    sortKey === "recent" && categoryFilter === "all" && clubFilter === "all"
  );
}

export function AdminPlayersDirectory({
  players,
  clubs,
}: AdminPlayersDirectoryProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [clubFilter, setClubFilter] = useState<ClubFilter>("all");

  const hasActiveFilters = !isDefaultFilterState(
    sortKey,
    categoryFilter,
    clubFilter,
  );

  const selectedClubLabel =
    clubFilter === "all"
      ? ""
      : clubFilter === "none"
        ? "No club"
        : (clubs.find((club) => club.id === clubFilter)?.shortName ??
          clubs.find((club) => club.id === clubFilter)?.name ??
          "Club");

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const searched = !normalizedQuery
      ? players
      : players.filter((player) => {
          const clubName = player.club?.name ?? "";
          const clubShortName = player.club?.shortName ?? "";

          return (
            player.fullName.toLowerCase().includes(normalizedQuery) ||
            player.nickname.toLowerCase().includes(normalizedQuery) ||
            clubName.toLowerCase().includes(normalizedQuery) ||
            clubShortName.toLowerCase().includes(normalizedQuery) ||
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

    const clubFiltered =
      clubFilter === "all"
        ? categoryFiltered
        : clubFilter === "none"
          ? categoryFiltered.filter((player) => !player.clubId)
          : categoryFiltered.filter((player) => player.clubId === clubFilter);

    const sorted = [...clubFiltered];

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
  }, [players, query, sortKey, categoryFilter, clubFilter]);

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, nickname, club, or category"
            className="h-10 rounded-xl border-white/10 bg-white/4 pl-10 text-sm placeholder:text-muted-foreground/50"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={`relative h-10 w-10 shrink-0 rounded-xl transition focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0 ${
                hasActiveFilters
                  ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                  : "border-white/10 bg-white/4 text-muted-foreground hover:bg-white/6 hover:text-foreground"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Open player filters</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 rounded-2xl border border-white/10 bg-[#0b1018]/95 p-1.5 text-foreground shadow-2xl backdrop-blur-xl"
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
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Recently added
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="name-asc"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Name A → Z
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="name-desc"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
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
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                All players
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="A"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Category A
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="B"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Category B
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="C"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                Category C
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator className="my-1 bg-white/10" />

            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
              Filter club
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup
              value={clubFilter}
              onValueChange={(value) => setClubFilter(value)}
            >
              <DropdownMenuRadioItem
                value="all"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                All clubs
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem
                value="none"
                className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
              >
                No club
              </DropdownMenuRadioItem>

              {clubs.map((club) => (
                <DropdownMenuRadioItem
                  key={club.id}
                  value={club.id}
                  className="cursor-pointer rounded-xl text-sm text-foreground outline-none transition focus:bg-white/8 data-[state=checked]:bg-white/8 data-[state=checked]:text-primary"
                >
                  {club.shortName ?? club.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasActiveFilters ? (
        <p className="text-xs text-muted-foreground">
          {getSortLabel(sortKey)}
          {categoryFilter !== "all" ? ` · Category ${categoryFilter}` : ""}
          {clubFilter !== "all" ? ` · ${selectedClubLabel}` : ""}
        </p>
      ) : null}

      {filteredPlayers.length === 0 ? (
        <EmptyState message="No matching players found." />
      ) : (
        <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <AdminPlayerCard key={player.id} player={player} clubs={clubs} />
          ))}
        </div>
      )}
    </section>
  );
}
