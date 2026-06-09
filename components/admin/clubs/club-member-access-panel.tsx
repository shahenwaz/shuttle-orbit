"use client";

import { useState, useTransition } from "react";
import { Copy, Eye, RefreshCw, ShieldOff } from "lucide-react";

import {
  disableClubMemberAccessAction,
  enableClubMemberAccessAction,
  refreshClubMemberShareKeyAction,
  type ClubMemberAccessActionState,
} from "@/app/admin/clubs/[clubId]/member-access/actions";
import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

type ClubMemberAccessPanelProps = {
  clubId: string;
  slug: string;
  memberAccessEnabled: boolean;
  memberShareKey: string | null;
};

const initialState: ClubMemberAccessActionState = {
  success: false,
  message: "",
};

export function ClubMemberAccessPanel({
  clubId,
  slug,
  memberAccessEnabled,
  memberShareKey,
}: ClubMemberAccessPanelProps) {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const memberPath = memberShareKey
    ? `/clubs/${slug}/member-zone/${memberShareKey}`
    : "";

  function runAction(
    action: (formData: FormData) => Promise<ClubMemberAccessActionState>,
  ) {
    const formData = new FormData();

    formData.set("clubId", clubId);

    startTransition(async () => {
      const result = await action(formData);
      setState(result);
      setCopied(false);
    });
  }

  async function copyLink() {
    if (!memberPath) return;

    const origin = window.location.origin;
    await navigator.clipboard.writeText(`${origin}${memberPath}`);
    setCopied(true);
  }

  return (
    <div className="rounded-md border border-white/10 bg-white/4 px-3 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              Private member view
            </p>

            <span className="rounded-full border border-white/10 bg-background/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {memberAccessEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            Read-only session link for Bengal Dragons BC members.
          </p>

          {memberAccessEnabled && memberPath ? (
            <p className="break-all text-xs font-medium text-primary">
              {memberPath}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {!memberAccessEnabled ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => runAction(enableClubMemberAccessAction)}
              className={actionPillButtonClassName({
                variant: "create",
                className: "justify-center",
              })}
            >
              <Eye className="mr-1 h-3.5 w-3.5" />
              Enable
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!memberPath}
                onClick={copyLink}
                className={actionPillButtonClassName({
                  variant: "link",
                  className: "justify-center",
                })}
              >
                <Copy className="mr-1 h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy"}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => runAction(refreshClubMemberShareKeyAction)}
                className={actionPillButtonClassName({
                  variant: "link",
                  className: "justify-center",
                })}
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Refresh
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => runAction(disableClubMemberAccessAction)}
                className="h-8 rounded-full border-red-400/20 bg-red-500/10 px-3 text-[11px] font-medium text-red-100 hover:bg-red-500/15"
              >
                <ShieldOff className="mr-1 h-3.5 w-3.5" />
                Disable
              </Button>
            </>
          )}
        </div>
      </div>

      {state.message ? (
        <p
          className={
            state.success
              ? "mt-2 text-xs text-primary"
              : "mt-2 text-xs text-red-300"
          }
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
