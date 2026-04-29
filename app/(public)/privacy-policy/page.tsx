import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="How this platform handles basic tournament, player, and usage information."
      />

      <div className="rounded-md border border-white/10 bg-white/4 p-4 text-sm leading-7 text-muted-foreground sm:p-5 sm:text-base">
        This community platform may store tournament information, player names,
        nicknames, match results, standings, and leaderboard records to operate
        badminton events and publish public results. Administrative access is
        restricted to authorized organizers. If you want player information
        corrected or removed, please contact the site organizer.
      </div>
    </PageContainer>
  );
}
