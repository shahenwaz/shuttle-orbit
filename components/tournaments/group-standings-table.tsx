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
      <div className="border-t border-white/10 px-3 py-3 sm:px-4 sm:py-4">
        <p className="text-xs text-muted-foreground sm:text-sm">
          No standings available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full border-t border-white/10">
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <Table className="min-w-110 border-collapse">
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="w-8 whitespace-nowrap px-3 py-2 text-[11px] sm:w-10 sm:text-xs">
                #
              </TableHead>
              <TableHead className="whitespace-nowrap px-3 py-2 text-[11px] sm:text-xs">
                Team
              </TableHead>
              <TableHead className="w-10 whitespace-nowrap px-1.5 py-2 text-center text-[11px] sm:w-11 sm:text-xs">
                P
              </TableHead>
              <TableHead className="w-10 whitespace-nowrap px-1.5 py-2 text-center text-[11px] sm:w-11 sm:text-xs">
                W
              </TableHead>
              <TableHead className="w-10 whitespace-nowrap px-1.5 py-2 text-center text-[11px] sm:w-11 sm:text-xs">
                L
              </TableHead>
              <TableHead className="w-12 whitespace-nowrap px-1.5 py-2 text-center text-[11px] sm:w-14 sm:text-xs">
                PF
              </TableHead>
              <TableHead className="w-12 whitespace-nowrap px-1.5 py-2 text-center text-[11px] sm:w-14 sm:text-xs">
                PA
              </TableHead>
              <TableHead className="w-12 whitespace-nowrap px-1.5 py-2 text-center text-[11px] sm:w-14 sm:text-xs">
                PD
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.teamId} className="border-white/10">
                <TableCell className="whitespace-nowrap px-3 py-2 text-xs font-medium sm:text-sm">
                  {index + 1}
                </TableCell>

                <TableCell className="px-3 py-2">
                  <span className="block max-w-35 truncate text-xs font-medium text-foreground sm:max-w-55 sm:text-sm">
                    {row.teamName}
                  </span>
                </TableCell>

                <TableCell className="whitespace-nowrap px-1.5 py-2 text-center text-xs sm:text-sm">
                  {row.played}
                </TableCell>
                <TableCell className="whitespace-nowrap px-1.5 py-2 text-center text-xs sm:text-sm">
                  {row.won}
                </TableCell>
                <TableCell className="whitespace-nowrap px-1.5 py-2 text-center text-xs sm:text-sm">
                  {row.lost}
                </TableCell>
                <TableCell className="whitespace-nowrap px-1.5 py-2 text-center text-xs sm:text-sm">
                  {row.pointsFor}
                </TableCell>
                <TableCell className="whitespace-nowrap px-1.5 py-2 text-center text-xs sm:text-sm">
                  {row.pointsAgainst}
                </TableCell>
                <TableCell className="whitespace-nowrap px-1.5 py-2 text-center text-xs font-medium sm:text-sm">
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
