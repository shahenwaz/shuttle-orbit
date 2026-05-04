import {
  BarChart3,
  LayoutDashboard,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

export const adminNavItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === "/admin",
  },
  {
    title: "Players",
    href: "/admin/players",
    icon: Users,
    match: (pathname: string) => pathname.startsWith("/admin/players"),
  },
  {
    title: "Tournaments",
    href: "/admin/tournaments",
    icon: Trophy,
    match: (pathname: string) => pathname.startsWith("/admin/tournaments"),
  },
  {
    title: "Rankings",
    href: "/admin/rankings",
    icon: BarChart3,
    match: (pathname: string) => pathname.startsWith("/admin/rankings"),
  },
  {
    title: "Knockout",
    href: "/admin/knockout",
    icon: Swords,
    match: (pathname: string) => pathname.startsWith("/admin/knockout"),
  },
] as const;
