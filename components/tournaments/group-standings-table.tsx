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
          {rows.map((row, index) => (
            <TableRow key={row.teamId} className="border-white/10">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{row.teamName}</TableCell>
              <TableCell className="text-center">{row.played}</TableCell>
              <TableCell className="text-center">{row.won}</TableCell>
              <TableCell className="text-center">{row.lost}</TableCell>
              <TableCell className="text-center">{row.pointsFor}</TableCell>
              <TableCell className="text-center">{row.pointsAgainst}</TableCell>
              <TableCell className="text-center">
                {row.pointDifference}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
