import {
  BarChart3,
  Building2,
  LayoutDashboard,
  ListOrdered,
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
    title: "Clubs",
    href: "/admin/clubs",
    icon: Building2,
    match: (pathname: string) => pathname.startsWith("/admin/clubs"),
  },
  {
    title: "Tournaments",
    href: "/admin/tournaments",
    icon: Trophy,
    match: (pathname: string) => pathname.startsWith("/admin/tournaments"),
  },
  {
    title: "Leagues",
    href: "/admin/leagues",
    icon: ListOrdered,
    match: (pathname: string) => pathname.startsWith("/admin/leagues"),
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
