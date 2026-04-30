import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how player information, tournament records, results, standings, and rankings are handled on this badminton tournament platform.",
});

export default function PrivacyPolicyPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="How this platform handles player information, tournament records, and public competition data."
      />

      <div className="rounded-md border border-white/10 bg-white/4 p-4 text-sm leading-7 text-muted-foreground sm:p-5 sm:text-base">
        This platform may store and display tournament information, category
        details, player names, nicknames, team entries, match results,
        standings, and leaderboard records in order to operate badminton events
        and publish community competition updates. Access to admin tools is
        limited to authorized organizers. If you believe player information,
        tournament records, or published results should be corrected or removed,
        you may contact the organizer or site administrator for review.
      </div>
    </PageContainer>
  );
}
