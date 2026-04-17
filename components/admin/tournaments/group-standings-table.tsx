import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StandingRow } from "@/lib/tournament/standings";
import { cn } from "@/lib/utils";

type GroupStandingsTableProps = {
  rows: StandingRow[];
  qualifiersCount?: number;
};

export function GroupStandingsTable({
  rows,
  qualifiersCount = 0,
}: GroupStandingsTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No standings available yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/40">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="w-14">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">PF</TableHead>
            <TableHead className="text-center">PA</TableHead>
            <TableHead className="text-center">PD</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => {
            const qualifies = qualifiersCount > 0 && index < qualifiersCount;

            return (
              <TableRow
                key={row.teamId}
                className={cn("border-white/10", qualifies && "bg-primary/8")}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{index + 1}</span>
                    {qualifies ? (
                      <span className="rounded-md border border-primary/25 bg-primary/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Q
                      </span>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell className="font-medium">{row.teamName}</TableCell>
                <TableCell className="text-center">{row.played}</TableCell>
                <TableCell className="text-center">{row.won}</TableCell>
                <TableCell className="text-center">{row.lost}</TableCell>
                <TableCell className="text-center">{row.pointsFor}</TableCell>
                <TableCell className="text-center">
                  {row.pointsAgainst}
                </TableCell>
                <TableCell className="text-center">
                  {row.pointDifference}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
