"use client";

import Link from "next/link";
import { CalendarDays, Globe, MapPin, Settings2 } from "lucide-react";

import { TournamentCardActions } from "@/components/admin/tournaments/tournament-card-actions";
import { EmptyState } from "@/components/shared/empty-state";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { CompactStatPill } from "@/components/shared/stats/compact-stat-pill";
import { CompactStatRow } from "@/components/shared/stats/compact-stat-row";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";

type TournamentRow = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  eventDate: Date;
  status: string;
  description: string | null;
  _count: {
    categories: number;
    teamEntries: number;
    matches: number;
  };
};

type TournamentsTableProps = {
  tournaments: TournamentRow[];
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
  }
}

export function TournamentsTable({ tournaments }: TournamentsTableProps) {
  if (tournaments.length === 0) {
    return (
      <EmptyState message="No tournaments found yet. Add your first tournament to get started." />
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {tournaments.map((tournament) => (
        <div key={tournament.id} className="surface-card p-4 sm:p-5">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {tournament.name}
                  </h4>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs ${getStatusBadgeClass(
                      tournament.status,
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                  <div className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(tournament.eventDate)}
                  </div>

                  <div className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {tournament.location ?? "No location set"}
                  </div>
                </div>

                {tournament.description ? (
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {tournament.description}
                  </p>
                ) : null}
              </div>

              <TournamentCardActions
                tournament={{
                  id: tournament.id,
                  name: tournament.name,
                  location: tournament.location,
                  eventDate: tournament.eventDate,
                  status: tournament.status as "upcoming" | "completed",
                  description: tournament.description,
                  categoryCount: tournament._count.categories,
                }}
              />
            </div>

            <CompactStatRow className="justify-start">
              <CompactStatPill
                label="Categories"
                value={tournament._count.categories}
              />
              <CompactStatPill
                label="Teams"
                value={tournament._count.teamEntries}
              />
              <CompactStatPill
                label="Matches"
                value={tournament._count.matches}
              />
            </CompactStatRow>

            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className={actionPillButtonClassName({
                  variant: "link",
                  className: "w-full justify-center sm:w-auto",
                })}
              >
                <Link href={`/tournaments/${tournament.slug}`}>
                  <Globe className="mr-1 h-3.5 w-3.5" />
                  Public
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                className={actionPillButtonClassName({
                  variant: "create",
                  className: "w-full justify-center sm:w-auto",
                })}
              >
                <Link href={`/admin/tournaments/${tournament.id}`}>
                  <Settings2 className="mr-1 h-3.5 w-3.5" />
                  Manage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
