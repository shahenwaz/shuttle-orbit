import type { MetadataRoute } from "next";

import { getPlayersDirectory } from "@/lib/player/queries";
import { getAllTournaments } from "@/lib/tournament/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tournaments, players] = await Promise.all([
    getAllTournaments(),
    getPlayersDirectory(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tournaments`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/players`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/leaderboard`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const tournamentRoutes: MetadataRoute.Sitemap = tournaments.map(
    (tournament) => ({
      url: `${siteUrl}/tournaments/${tournament.slug}`,
      lastModified: tournament.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const playerRoutes: MetadataRoute.Sitemap = players.map((player) => ({
    url: `${siteUrl}/players/${player.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...tournamentRoutes, ...playerRoutes];
}
