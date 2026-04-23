import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function LeaderboardPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Leaderboard"
        title="Community players universal ranking"
        description="Track how players progress across tournaments. Ranking updates and category standings will appear here as the system grows."
      />

      <Card className="rounded-[1.75rem] border-white/10 bg-white/4">
        <CardContent className="py-10 text-sm leading-7 text-muted-foreground sm:text-base">
          Leaderboard data will be added soon. As more tournament results are
          recorded, this page will show player rankings and long-term standings.
        </CardContent>
      </Card>
    </PageContainer>
  );
}
