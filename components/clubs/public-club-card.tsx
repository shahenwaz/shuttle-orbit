import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, UsersRound } from "lucide-react";

export type PublicClubCardData = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  homeVenue: string | null;
  logoUrl: string | null;
  _count: {
    players: number;
  };
};

type PublicClubCardProps = {
  club: PublicClubCardData;
};

export function PublicClubCard({ club }: PublicClubCardProps) {
  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="group relative overflow-hidden rounded-md border border-white/10 bg-[#0f1720]/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-sky-200/22 hover:bg-[#111c26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/35"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(96,165,250,0.08)_0%,rgba(255,255,255,0.025)_34%,transparent_58%),linear-gradient(315deg,rgba(52,211,153,0.055)_0%,transparent_42%)] opacity-80 transition group-hover:opacity-95" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-100/18 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-sky-300/80 via-primary/70 to-emerald-400/70 opacity-65 transition group-hover:opacity-90" />

      <div className="relative flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
          {club.logoUrl ? (
            <Image
              src={club.logoUrl}
              alt={`${club.name} logo`}
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src="/clubs/club-logo-fallback.webp"
              alt="Club logo fallback"
              width={40}
              height={40}
              className="h-11 w-11 object-contain opacity-90"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-base font-semibold tracking-tight text-foreground transition group-hover:text-sky-50">
                {club.name}
              </h2>

              {club.shortName ? (
                <span className="hidden shrink-0 rounded-full border border-sky-200/16 bg-sky-300/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-100/85 sm:inline-flex">
                  {club.shortName}
                </span>
              ) : null}
            </div>

            <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-100/75" />
              <span className="truncate">
                {club.homeVenue ?? "Venue not set"}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <UsersRound className="h-3.5 w-3.5 text-primary/80" />
                {club._count.players}{" "}
                {club._count.players === 1 ? "member" : "members"}
              </span>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-sky-100/75 transition group-hover:translate-x-0.5 group-hover:text-sky-50" />
          </div>
        </div>
      </div>
    </Link>
  );
}
