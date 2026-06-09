import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ClubForm } from "@/components/admin/clubs/club-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

type EditClubPageProps = {
  params: Promise<{
    clubId: string;
  }>;
};

export default async function EditClubPage({ params }: EditClubPageProps) {
  const { clubId } = await params;

  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
    },
  });

  if (!club) {
    notFound();
  }

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
            Edit club
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {club.name}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Update the public identity for this club. Private member tools will
            be added in the next steps.
          </p>
        </div>
      </div>

      <Card className="rounded-md border-white/10 bg-white/4">
        <CardContent className="p-4 sm:p-5">
          <ClubForm mode="edit" club={club} />
        </CardContent>
      </Card>
    </div>
  );
}
