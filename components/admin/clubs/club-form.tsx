"use client";

import { useActionState } from "react";

import {
  createClubAction,
  updateClubAction,
  type ClubActionState,
} from "@/app/admin/clubs/actions";
import { Button } from "@/components/ui/button";

type ClubFormClub = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  description: string | null;
  homeVenue: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isPublic: boolean;
};

type ClubFormProps = {
  mode: "create" | "edit";
  club?: ClubFormClub;
};

const initialState: ClubActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs text-red-300">{errors[0]}</p>;
}

const inputClassName =
  "h-11 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

const textareaClassName =
  "min-h-28 w-full rounded-md border border-white/10 bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/15";

export function ClubForm({ mode, club }: ClubFormProps) {
  const action = mode === "create" ? createClubAction : updateClubAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {mode === "edit" && club ? (
        <input type="hidden" name="clubId" value={club.id} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Club name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={club?.name ?? ""}
            placeholder="Bengal Dragons BC"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.name} />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-foreground">
            Public slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={club?.slug ?? ""}
            placeholder="bengal-dragons-bc"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.slug} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="shortName"
            className="text-sm font-medium text-foreground"
          >
            Short name
          </label>
          <input
            id="shortName"
            name="shortName"
            defaultValue={club?.shortName ?? ""}
            placeholder="BDBC"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.shortName} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="homeVenue"
            className="text-sm font-medium text-foreground"
          >
            Home venue
          </label>
          <input
            id="homeVenue"
            name="homeVenue"
            defaultValue={club?.homeVenue ?? ""}
            placeholder="Terenure Badminton Centre"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.homeVenue} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={club?.description ?? ""}
            placeholder="A community badminton club for players, friendly matchdays, and future tournaments."
            className={textareaClassName}
          />
          <FieldError errors={state.fieldErrors?.description} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="logoUrl"
            className="text-sm font-medium text-foreground"
          >
            Logo URL
          </label>
          <input
            id="logoUrl"
            name="logoUrl"
            defaultValue={club?.logoUrl ?? ""}
            placeholder="/brand/bengal-dragons-logo.webp"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.logoUrl} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="bannerUrl"
            className="text-sm font-medium text-foreground"
          >
            Banner URL
          </label>
          <input
            id="bannerUrl"
            name="bannerUrl"
            defaultValue={club?.bannerUrl ?? ""}
            placeholder="/brand/bengal-dragons-banner.webp"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.bannerUrl} />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/4 p-4">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={club?.isPublic ?? true}
          className="mt-1 h-4 w-4 rounded border-white/20 bg-background"
        />
        <span className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            Show this club publicly
          </span>
          <span className="block text-xs leading-5 text-muted-foreground">
            Public club profiles can show general club identity, venue, members
            marked as public, hosted tournaments, and achievements later.
          </span>
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
        {pending
          ? "Saving..."
          : mode === "create"
            ? "Create club"
            : "Save club"}
      </Button>
    </form>
  );
}
