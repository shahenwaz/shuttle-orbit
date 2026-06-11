import Link from "next/link";
import { Link2, Shield, UserRound } from "lucide-react";

import type { ClubProfileMember } from "@/lib/clubs/club-profile-mappers";
import { cn } from "@/lib/utils";

type ClubMemberCardProps = {
  member: ClubProfileMember;
};

export function ClubMemberCard({ member }: ClubMemberCardProps) {
  const isTourPlayer = member.playerType === "tour-player";
  const playerHref = member.playerId ? `/players/${member.playerId}` : null;

  const cardContent = (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4 text-purple-300/80 transition group-hover:border-purple-400/25 group-hover:text-purple-200">
        <UserRound className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-5 text-foreground">
          {member.name}
        </p>

        <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="truncate">
            {member.nickname ? `@${member.nickname}` : "No nickname"}
          </span>

          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 font-medium",
              isTourPlayer ? "text-blue-500" : "text-muted-foreground",
            )}
          >
            {isTourPlayer ? (
              <Link2 className="h-3 w-3" />
            ) : (
              <Shield className="h-3 w-3" />
            )}
            {isTourPlayer ? "Tour Player" : "Club Member"}
          </span>
        </div>
      </div>
    </div>
  );

  const className = cn(
    "group block rounded-md border border-white/10 bg-white/4 px-3 py-2 transition",
    isTourPlayer
      ? "cursor-pointer hover:border-blue-500/25 hover:bg-white/6"
      : "cursor-default hover:border-purple-400/20 hover:bg-white/6",
  );

  if (playerHref) {
    return (
      <Link
        href={playerHref}
        className={className}
        aria-label={`View ${member.name} player profile`}
      >
        {cardContent}
      </Link>
    );
  }

  return <article className={className}>{cardContent}</article>;
}
