import Link from "next/link";
import { ArrowLeft, PlusSquare } from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { AdminShellHeader } from "@/components/admin/layout/admin-shell-header";
import { PageContainer } from "@/components/layout/page-container";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

export default function NewClubPage() {
  return (
    <PageContainer className="space-y-4 sm:space-y-6">
      <AdminShellHeader
        title="Create club"
        description="Add a lightweight club profile for an organised badminton community. Members, sessions, and private matchday tools will connect to this club later."
      />

      <section className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={actionPillButtonClassName({
            variant: "link",
            className:
              "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
          })}
        >
          <Link href="/admin/clubs">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to clubs
          </Link>
        </Button>

        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          <PlusSquare className="mr-1.5 h-3.5 w-3.5" />
          New profile
        </span>
      </section>

      <section className="surface-card p-4 sm:p-5">
        <ClubForm mode="create" />
      </section>
    </PageContainer>
  );
}
