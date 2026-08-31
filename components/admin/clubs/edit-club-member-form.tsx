"use client";

import { useActionState } from "react";

import {
  updateClubMemberAction,
  type ClubMemberActionState,
} from "@/app/admin/clubs/[clubId]/members/actions";
import { Button } from "@/components/ui/button";

type EditClubMemberFormMember = {
  id: string;
  clubId: string;
  role: string;
  isPublic: boolean;
};

type EditClubMemberFormProps = {
  member: EditClubMemberFormMember;
  onSuccess?: () => void;
};

const initialState: ClubMemberActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "h-10 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

export function EditClubMemberForm({
  member,
  onSuccess,
}: EditClubMemberFormProps) {
  const [state, formAction, pending] = useActionState(
    async (prevState: ClubMemberActionState, formData: FormData) => {
      const result = await updateClubMemberAction(prevState, formData);

      if (result.success) {
        onSuccess?.();
      }

      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clubId" value={member.clubId} />
      <input type="hidden" name="memberId" value={member.id} />

      <div className="space-y-2">
        <label
          htmlFor={`role-${member.id}`}
          className="text-sm font-medium text-foreground"
        >
          Club role
        </label>
        <select
          id={`role-${member.id}`}
          name="role"
          defaultValue={member.role}
          className={inputClassName}
        >
          <option value="OWNER">Owner</option>
          <option value="ORGANIZER">Organizer</option>
          <option value="MEMBER">Member</option>
        </select>
      </div>

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/4 p-3">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={member.isPublic}
          className="mt-1 h-4 w-4 rounded border-white/20 bg-background"
        />
        <span className="block text-sm font-medium text-foreground">
          Show on public club profile
        </span>
      </label>

      {state.message ? (
        <p
          className={
            state.success ? "text-sm text-primary" : "text-sm text-red-300"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="rounded-md">
        {pending ? "Saving..." : "Save member"}
      </Button>
    </form>
  );
}
