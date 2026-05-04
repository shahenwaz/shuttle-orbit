import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    "Review the terms for using this badminton tournament platform, including public results, standings, player records, and organizer-managed content.",
});

export default function TermsOfUsePage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Legal"
        title="Terms of Use"
        description="Basic terms for using this badminton tournament platform and its public event information."
      />

      <div className="rounded-md border border-white/10 bg-white/4 p-4 text-sm leading-7 text-muted-foreground sm:p-5 sm:text-base">
        This website is provided for badminton tournament management, public
        event information, standings, results, player records, and leaderboard
        tracking. Organizers may update or correct tournament content, player
        data, fixtures, rankings, and results when required. By using this
        platform, users agree not to misuse the website, interfere with its
        operation, or attempt unauthorized access to admin-only features or
        stored data.
      </div>
    </PageContainer>
  );
}
