"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PlayerCard } from "@/components/tournaments/player-card";
import { Input } from "@/components/ui/input";

type PlayersDirectoryProps = {
  players: Array<{
    id: string;
    fullName: string;
    nickname: string;
  }>;
};

export function PlayersDirectory({ players }: PlayersDirectoryProps) {
  const [query, setQuery] = useState("");

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return players;
    }

    return players.filter((player) => {
      return (
        player.fullName.toLowerCase().includes(normalizedQuery) ||
        player.nickname.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [players, query]);

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by player name or nickname"
          className="h-10 rounded-md border-white/10 bg-white/4 pl-10 text-sm placeholder:text-muted-foreground/50"
        />
      </div>

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
