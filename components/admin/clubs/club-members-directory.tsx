"use client";

import { useState, useTransition } from "react";
import {
  Link2,
  MoreVertical,
  Pencil,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  deleteClubMemberAction,
  type DeleteClubMemberActionState,
} from "@/app/admin/clubs/[clubId]/members/actions";
import { CreateDialog } from "@/components/admin/create-dialog";
import { EditClubMemberForm } from "@/components/admin/clubs/edit-club-member-form";
import { EmptyState } from "@/components/shared/empty-state";
import { surfaceCardClassName } from "@/components/shared/surface-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ClubMemberPlayer = {
  id: string;
  fullName: string;
  nickname: string | null;
};

type ClubMemberRow = {
  id: string;
  clubId: string;
  playerId: string | null;
  name: string;
  nickname: string | null;
  role: string;
  isPublic: boolean;
  player: ClubMemberPlayer | null;
};

type ClubMembersDirectoryProps = {
  members: ClubMemberRow[];
  players: ClubMemberPlayer[];
};

const initialDeleteState: DeleteClubMemberActionState = {
  success: false,
  message: "",
};

function formatEnum(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type ClubMemberCardProps = {
  member: ClubMemberRow;
  players: ClubMemberPlayer[];
};

function ClubMemberCard({ member, players }: ClubMemberCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteState, setDeleteState] =
    useState<DeleteClubMemberActionState>(initialDeleteState);
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <div
      className={surfaceCardClassName({
        variant: "panel",
        interactive: true,
        className: "px-3 py-2.5 sm:px-3.5",
      })}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4 text-xs font-semibold text-primary">
            {getInitials(member.name) || <UserRound className="h-4 w-4" />}
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                {member.name}
              </h3>

              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                {formatEnum(member.role)}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>
                {member.nickname ? `@${member.nickname}` : "No nickname"}
              </span>

              {member.player ? (
                <span className="inline-flex items-center gap-1 text-sky-200">
                  <Link2 className="h-3 w-3" />
                  Tour player
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Club-only
                </span>
              )}

              {!member.isPublic ? <span>Hidden</span> : null}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 cursor-pointer rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ring-offset-0 focus:ring-offset-0 focus-visible:ring-offset-0"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open member actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 rounded-2xl border border-white/10 bg-[#0b1018]/95 p-1.5 text-foreground shadow-2xl backdrop-blur-xl"
          >
            <DropdownMenuItem
              onSelect={() => setIsEditOpen(true)}
              className="cursor-pointer rounded-xl text-sm text-foreground focus:bg-white/8"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit member
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                setDeleteState(initialDeleteState);
                setIsDeleteOpen(true);
              }}
              className="cursor-pointer rounded-xl text-sm text-red-200 focus:bg-red-500/10 focus:text-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        triggerLabel=""
        hideTrigger
        title="Edit club member"
        description="Update the member link, role, and public visibility."
      >
        <EditClubMemberForm
          member={member}
          players={players}
          onSuccess={() => setIsEditOpen(false)}
        />
      </CreateDialog>

      <CreateDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        triggerLabel=""
        hideTrigger
        title="Remove club member"
        description="Remove this player from the club while preserving their global player record."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            startDeleteTransition(async () => {
              const result = await deleteClubMemberAction(formData);
              setDeleteState(result);

              if (result.success) {
                setIsDeleteOpen(false);
              }
            });
          }}
        >
          <input type="hidden" name="clubId" value={member.clubId} />
          <input type="hidden" name="memberId" value={member.id} />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{member.name}</span>?
          </p>

          {deleteState.message ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                deleteState.success
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {deleteState.message}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Removing..." : "Remove member"}
            </Button>
          </div>
        </form>
      </CreateDialog>
    </div>
  );
}

export function ClubMembersDirectory({
  members,
  players,
}: ClubMembersDirectoryProps) {
  if (members.length === 0) {
    return (
      <EmptyState message="No club members added yet. Add members as linked players or club-only members." />
    );
  }

  return (
    <div className="grid gap-1.5 sm:gap-2 md:grid-cols-2">
      {members.map((member) => (
        <ClubMemberCard key={member.id} member={member} players={players} />
      ))}
    </div>
  );
}
