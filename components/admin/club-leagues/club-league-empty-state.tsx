import { Swords } from "lucide-react";

export function ClubLeagueEmptyState() {
  return (
    <div className="rounded-md border border-dashed border-white/15 bg-white/4 p-6">
      <div className="flex max-w-xl gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
          <Swords className="size-5" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">
            No club leagues yet
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Create the first internal league night for BDBC. Start with Team
            Pair Matrix for your ABC vs DEF style format.
          </p>
        </div>
      </div>
    </div>
  );
}
