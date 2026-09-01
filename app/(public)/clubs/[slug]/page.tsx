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
  const activeTab = getActiveTab(resolvedSearchParams?.tab);

  const profileData =
    activeTab === "members"
      ? await prisma.club.findUnique({
          where: {
            slug,
          },
          select: {
            name: true,
            shortName: true,
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
              },
            },
          },
        })
      : await prisma.club.findUnique({
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
            _count: {
              select: {
                players: {
                  where: {
                    isActive: true,
                    clubProfilePublic: true,
                  },
                },
              },
            },
          },
        });

  if (!profileData || !profileData.isPublic) {
    notFound();
  }

  const shellData =
    activeTab === "members" && "players" in profileData
      ? {
          activeTab,
          members: profileData.players.map((player) =>
            mapClubProfileMember(player),
          ),
        }
      : activeTab === "overview" && "_count" in profileData
        ? {
            activeTab,
            club: {
              description: profileData.description,
              homeVenue: profileData.homeVenue,
              memberCount: profileData._count.players,
            },
          }
        : null;

  if (!shellData) {
    notFound();
  }

  return (
    <>
      <PublicClubProfileHeader
        club={{
          name: profileData.name,
          shortName: profileData.shortName,
          homeVenue: profileData.homeVenue,
          logoUrl: profileData.logoUrl,
        }}
        activeTab={activeTab}
        baseHref={`/clubs/${slug}`}
      />

      <PageContainer className="py-5 sm:py-7">
        <ClubProfileShell data={shellData} />
      </PageContainer>
    </>
  );
}
