"use client";

import { useState } from "react";
import { PlusSquare } from "lucide-react";

import { ClubMemberForm } from "@/components/admin/clubs/club-member-form";
import { CreateSheet } from "@/components/admin/create-sheet";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";

type AddClubMemberSheetProps = {
  clubId: string;
  players: Array<{
    id: string;
    fullName: string;
    nickname: string | null;
  }>;
};

export function AddClubMemberSheet({
  clubId,
  players,
}: AddClubMemberSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CreateSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      triggerLabel="Add player"
      title="Add player to club"
      description="Assign an existing Shuttle Orbit player to this club."
      triggerClassName={actionPillButtonClassName({
        variant: "create",
        className: "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-[11px]",
      })}
      triggerIcon={<PlusSquare className="h-3.5 w-3.5" />}
    >
      {isOpen ? (
        <ClubMemberForm
          clubId={clubId}
          players={players}
          onSuccess={() => setIsOpen(false)}
        />
      ) : null}
    </CreateSheet>
  );
}
