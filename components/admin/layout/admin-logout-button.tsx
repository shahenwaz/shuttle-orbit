"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { actionPillButtonClassName } from "@/components/shared/action-pill-button";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={actionPillButtonClassName({
        variant: "danger",
        className: "gap-1.5 text-xs sm:text-sm",
      })}
    >
      <LogOut className="h-3.5 w-3.5" />
      Logout
    </button>
  );
}
