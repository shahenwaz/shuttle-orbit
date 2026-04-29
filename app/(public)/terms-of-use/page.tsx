import { PageContainer } from "@/components/layout/page-container";
import { PublicPageHeader } from "@/components/public/public-page-header";

export default function TermsOfUsePage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8">
      <PublicPageHeader
        eyebrow="Legal"
        title="Terms of Use"
        description="Basic terms for using this badminton tournament platform."
      />

      <div className="rounded-md border border-white/10 bg-white/4 p-4 text-sm leading-7 text-muted-foreground sm:p-5 sm:text-base">
        This website is provided for community badminton tournament management,
        public standings, player records, and event information. Organizers may
        update fixtures, rankings, and results when needed. By using the site,
        users agree not to misuse, disrupt, or attempt unauthorized access to
        any admin tools or stored data.
      </div>
    </PageContainer>
  );
}
