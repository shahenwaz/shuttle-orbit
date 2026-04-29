import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the tournament organizers for event updates, corrections, or community badminton questions.",
};

export default function ContactPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Contact"
        title="Contact"
        description="Reach out to the tournament organizers for corrections, questions, or event updates."
      />

      <div className="rounded-md border border-white/10 bg-white/4 p-4 text-sm leading-7 text-muted-foreground sm:p-5 sm:text-base">
        Contact details for this platform can be added here before deployment.
        You may include an organizer email address, Instagram page, Facebook
        page, or community contact link.
      </div>
    </PageContainer>
  );
}
