import Image from "next/image";
import { MapPin } from "lucide-react";

import { ConnectedTabs } from "@/components/shared/connected-tabs";
import { HeaderSurface } from "@/components/shared/header-surface";

export type PublicClubProfileTab = "overview" | "members" | "sessions";

type PublicClubProfileHeaderProps = {
  club: {
    name: string;
    shortName: string | null;
    homeVenue: string | null;
    logoUrl: string | null;
  };
  activeTab: PublicClubProfileTab;
  baseHref: string;
  hasSessionAccess: boolean;
};

export function PublicClubProfileHeader({
  club,
  activeTab,
  baseHref,
  hasSessionAccess,
}: PublicClubProfileHeaderProps) {
  const tabs = [
    {
      value: "overview",
      label: "Overview",
      href: baseHref,
    },
    {
      value: "members",
      label: "Members",
      href: `${baseHref}?tab=members`,
    },
    ...(hasSessionAccess
      ? [
          {
            value: "sessions",
            label: "Sessions",
            href: `${baseHref}?tab=sessions`,
          },
        ]
      : []),
  ];

  return (
    <HeaderSurface
      title={club.name}
      titleLeading={
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden sm:h-14 sm:w-14">
          {club.logoUrl ? (
            <Image
              src={club.logoUrl}
              alt={`${club.name} logo`}
              width={56}
              height={56}
              className="h-full w-full object-contain"
              priority
            />
          ) : (
            <Image
              src="/clubs/club-logo-fallback.webp"
              alt="Club logo fallback"
              width={48}
              height={48}
              className="h-11 w-11 object-contain opacity-90 sm:h-12 sm:w-12"
              priority
            />
          )}
        </div>
      }
      variant="club"
      className="border-b-0 bg-[linear-gradient(135deg,#0b1118_0%,#101826_48%,#0b1118_100%)]"
      meta={
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-100/80" />
          <span className="min-w-0 truncate">
            {club.homeVenue ?? "Venue not set"}
          </span>
        </span>
      }
    >
      <ConnectedTabs
        activeValue={activeTab}
        activeClassName="!bg-[#05090d] !text-white shadow-none"
        inactiveClassName="bg-white/6 text-muted-foreground hover:bg-white/10 hover:text-foreground"
        items={tabs}
      />
    </HeaderSurface>
  );
}
