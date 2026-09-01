import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  PublicClubProfileHeader,
  type PublicClubProfileTab,
} from "@/components/clubs/public-club-profile-header";
import { ClubProfileShell } from "@/components/clubs/club-profile-shell";
import { PageContainer } from "@/components/layout/page-container";
import { mapClubProfileMember } from "@/lib/clubs/club-profile-mappers";
import { prisma } from "@/lib/db/prisma";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PublicClubPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    tab?: string;
  }>;
};

function getActiveTab(tab: string | undefined): PublicClubProfileTab {
  if (tab === "members") return "members";

  return "overview";
}

export async function generateMetadata({
  params,
}: PublicClubPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await prisma.club.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      description: true,
      isPublic: true,
    },
  });

  if (!club?.isPublic) {
    return buildPageMetadata({
      title: "Club Profile",
      description: "View a community badminton club profile and its members.",
    });
  }

  return buildPageMetadata({
    title: club.name,
    description:
      club.description ||
      `View ${club.name}'s community badminton club profile and public members.`,
  });
}

export default async function PublicClubPage({
  params,
  searchParams,
}: PublicClubPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const club = await prisma.club.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      shortName: true,
      description: true,
      homeVenue: true,
      logoUrl: true,
      isPublic: true,
      players: {
        where: {
          isActive: true,
          clubProfilePublic: true,
        },
        orderBy: {
          fullName: "asc",
        },
        select: {
          id: true,
          fullName: true,
          nickname: true,
          clubId: true,
        },
      },
    },
  });

  if (!club || !club.isPublic) {
    notFound();
  }

  type PlayerRow = (typeof club.players)[number];

  const members = club.players.map((player: PlayerRow) =>
    mapClubProfileMember(player),
  );

  const activeTab = getActiveTab(resolvedSearchParams?.tab);

  return (
    <>
      <PublicClubProfileHeader
        club={{
          name: club.name,
          shortName: club.shortName,
          homeVenue: club.homeVenue,
          logoUrl: club.logoUrl,
        }}
        activeTab={activeTab}
        baseHref={`/clubs/${slug}`}
      />

      <PageContainer className="py-5 sm:py-7">
        <ClubProfileShell
          club={{
            description: club.description,
            homeVenue: club.homeVenue,
          }}
          members={members}
          activeTab={activeTab}
        />
      </PageContainer>
    </>
  );
}
