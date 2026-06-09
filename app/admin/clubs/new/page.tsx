import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewClubPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button asChild variant="ghost" className="rounded-md px-0">
          <Link href="/admin/clubs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to clubs
          </Link>
        </Button>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            New club
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create club profile
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Add a lightweight club profile first. Members, sessions, attendance,
            and member-only sharing will come in the next steps.
          </p>
        </div>
      </div>

      <Card className="rounded-md border-white/10 bg-white/4">
        <CardContent className="p-4 sm:p-5">
          <ClubForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
