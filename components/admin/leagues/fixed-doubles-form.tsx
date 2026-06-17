"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  createFixedDoublesLeagueAction,
  type FixedDoublesLeagueActionState,
} from "@/app/admin/leagues/actions";
import {
  FieldError,
  inputClassName,
  textareaClassName,
} from "@/components/admin/leagues/league-form-fields";
import type { PlayerOption } from "@/components/admin/leagues/league-form-types";
import { Button } from "@/components/ui/button";
import { formatLeagueDisplayName } from "@/lib/leagues/display";

type FixedDoublesFormProps = {
  clubId: string;
  players: PlayerOption[];
};

type CreatedFixedTeam = {
  id: string;
  name: string;
  player1Id: string;
  player2Id: string;
};

const initialState: FixedDoublesLeagueActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function getPlayerLabel(player: PlayerOption) {
  return player.nickname || player.fullName;
}

function getPlayerUpperLabel(player: PlayerOption | undefined) {
  if (!player) return "UNKNOWN";

  return getPlayerLabel(player).toUpperCase();
}

export function FixedDoublesForm({ clubId, players }: FixedDoublesFormProps) {
  const [state, formAction, pending] = useActionState(
    createFixedDoublesLeagueAction,
    initialState,
  );

  const [createdTeams, setCreatedTeams] = useState<CreatedFixedTeam[]>([]);
  const [draftName, setDraftName] = useState("Team 1");
  const [draftPlayer1Id, setDraftPlayer1Id] = useState("");
  const [draftPlayer2Id, setDraftPlayer2Id] = useState("");

  const playerMap = useMemo(() => {
    return new Map(players.map((player) => [player.id, player]));
  }, [players]);

  const usedPlayerIds = useMemo(() => {
    return new Set(
      createdTeams.flatMap((team) => [team.player1Id, team.player2Id]),
    );
  }, [createdTeams]);

  const generatedMatchCount =
    createdTeams.length > 1
      ? (createdTeams.length * (createdTeams.length - 1)) / 2
      : 0;

  function getSelectablePlayers(currentValue: string, otherDraftValue: string) {
    return players.filter((player) => {
      if (player.id === currentValue) return true;
      if (player.id === otherDraftValue) return false;

      return !usedPlayerIds.has(player.id);
    });
  }

  function resetDraft(nextTeamNumber: number) {
    setDraftName(`Team ${nextTeamNumber}`);
    setDraftPlayer1Id("");
    setDraftPlayer2Id("");
  }

  function addDraftTeam() {
    if (!draftPlayer1Id || !draftPlayer2Id) return;
    if (draftPlayer1Id === draftPlayer2Id) return;

    const nextTeam: CreatedFixedTeam = {
      id: `fixed-team-${Date.now()}`,
      name: draftName.trim() || `Team ${createdTeams.length + 1}`,
      player1Id: draftPlayer1Id,
      player2Id: draftPlayer2Id,
    };

    setCreatedTeams((current) => [...current, nextTeam]);
    resetDraft(createdTeams.length + 2);
  }

  function removeTeam(teamId: string) {
    setCreatedTeams((current) => current.filter((team) => team.id !== teamId));
  }

  const canAddTeam =
    Boolean(draftPlayer1Id) &&
    Boolean(draftPlayer2Id) &&
    draftPlayer1Id !== draftPlayer2Id;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clubId" value={clubId} />
      <input type="hidden" name="teamCount" value={createdTeams.length} />

      {createdTeams.map((team, index) => (
        <div key={`hidden-${team.id}`}>
          <input type="hidden" name={`teamName-${index}`} value={team.name} />
          <input
            type="hidden"
            name={`teamPlayerIds-${index}`}
            value={team.player1Id}
          />
          <input
            type="hidden"
            name={`teamPlayerIds-${index}`}
            value={team.player2Id}
          />
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="fixed-title"
            className="text-sm font-medium text-foreground"
          >
            League title
          </label>
          <input
            id="fixed-title"
            name="title"
            defaultValue={formatLeagueDisplayName("Fixed Doubles League")}
            placeholder={formatLeagueDisplayName("Fixed Doubles League")}
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.title} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fixed-playedAt"
            className="text-sm font-medium text-foreground"
          >
            League date
          </label>
          <input
            id="fixed-playedAt"
            name="playedAt"
            type="date"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.playedAt} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fixed-format"
            className="text-sm font-medium text-foreground"
          >
            Format
          </label>
          <input
            id="fixed-format"
            value={formatLeagueDisplayName("Fixed Doubles")}
            readOnly
            className={inputClassName}
          />
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Fixed doubles teams
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Create one pair at a time. Added players disappear from the next
              selection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-muted-foreground">
              {createdTeams.length} teams
            </span>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary">
              {generatedMatchCount} fixtures
            </span>
          </div>
        </div>

        <FieldError errors={state.fieldErrors?.teams} />

        <div className="rounded-md border border-white/10 bg-white/4 p-3">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <div className="space-y-2">
              <label
                htmlFor="draft-team-name"
                className="text-sm font-medium text-foreground"
              >
                Team name
              </label>
              <input
                id="draft-team-name"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                placeholder={`Team ${createdTeams.length + 1}`}
                className={inputClassName}
              />
            </div>

            <PlayerSelect
              id="draft-player-1"
              label="Player 1"
              value={draftPlayer1Id}
              players={getSelectablePlayers(draftPlayer1Id, draftPlayer2Id)}
              onChange={setDraftPlayer1Id}
            />

            <PlayerSelect
              id="draft-player-2"
              label="Player 2"
              value={draftPlayer2Id}
              players={getSelectablePlayers(draftPlayer2Id, draftPlayer1Id)}
              onChange={setDraftPlayer2Id}
            />

            <Button
              type="button"
              disabled={!canAddTeam}
              onClick={addDraftTeam}
              className="h-11 rounded-md border border-sky-400/25 bg-sky-400/10 px-4 text-sky-200 hover:bg-sky-400/15 hover:text-sky-100"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add team
            </Button>
          </div>

          <p className="mt-2 text-[10px] leading-4 text-muted-foreground/70">
            Add at least 2 fixed doubles teams to create fixtures.
          </p>
        </div>

        {createdTeams.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Created pairs
            </p>

            <div className="divide-y divide-white/8 rounded-md border border-white/10 bg-white/4">
              {[...createdTeams].reverse().map((team) => {
                const player1 = playerMap.get(team.player1Id);
                const player2 = playerMap.get(team.player2Id);

                return (
                  <div
                    key={team.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-2.5 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-muted-foreground">
                        {team.name}
                      </p>
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                        {getPlayerUpperLabel(player1)} +{" "}
                        {getPlayerUpperLabel(player2)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeam(team.id)}
                      className="h-7 w-7 rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove pair</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      <div className="space-y-2">
        <label
          htmlFor="fixed-rulesNote"
          className="text-sm font-medium text-foreground"
        >
          Rules note
        </label>
        <textarea
          id="fixed-rulesNote"
          name="rulesNote"
          defaultValue={formatLeagueDisplayName(
            "Fixed doubles teams play every other fixed doubles team once.",
          )}
          className={textareaClassName}
        />
      </div>

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
        {pending ? "Creating..." : "Create fixed doubles league"}
      </Button>
    </form>
  );
}

function PlayerSelect({
  id,
  label,
  value,
  players,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  players: PlayerOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-background/60 px-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      >
        <option value="">Select player</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {getPlayerLabel(player)}
          </option>
        ))}
      </select>
    </div>
  );
}
