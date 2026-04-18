import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StandingRow } from "@/lib/tournament/standings";

type GroupStandingsTableProps = {
  rows: StandingRow[];
};

export function GroupStandingsTable({ rows }: GroupStandingsTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No standings available yet.
      </p>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-background/40">
      <div className="max-w-full overflow-x-auto overscroll-x-contain">
        <Table className="min-w-100">
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="w-6 text-xs">#</TableHead>
              <TableHead className="text-xs">Team</TableHead>
              <TableHead className="text-center text-xs">P</TableHead>
              <TableHead className="text-center text-xs">W</TableHead>
              <TableHead className="text-center text-xs">L</TableHead>
              <TableHead className="text-center text-xs">PF</TableHead>
              <TableHead className="text-center text-xs">PA</TableHead>
              <TableHead className="text-center text-xs">PD</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.teamId} className="border-white/10">
                <TableCell className="text-sm font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  <span className="block truncate">{row.teamName}</span>
                </TableCell>
                <TableCell className="text-center text-sm">
                  {row.played}
                </TableCell>
                <TableCell className="text-center text-sm">{row.won}</TableCell>
                <TableCell className="text-center text-sm">
                  {row.lost}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {row.pointsFor}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {row.pointsAgainst}
                </TableCell>
                <TableCell className="text-center text-sm font-medium">
                  {row.pointDifference > 0
                    ? `+${row.pointDifference}`
                    : row.pointDifference}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
