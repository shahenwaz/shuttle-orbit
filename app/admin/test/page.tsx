import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { actionPillButtonClassName } from "@/components/shared/action-pill-button";
import { Button } from "@/components/ui/button";

<Button
  asChild
  variant="outline"
  size="sm"
  className={actionPillButtonClassName({ variant: "link" })}
>
  <Link href="/admin/tournaments/123/categories/456/teams">
    <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
    Open teams
  </Link>
</Button>;
