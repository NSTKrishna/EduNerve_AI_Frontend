import { History, LayoutDashboard, Mic, Settings } from "lucide-react";

export const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "AI Interview", to: "/interviews", icon: Mic },
  { label: "History", to: "/history", icon: History },
  { label: "Settings", to: "/settings", icon: Settings },
];

// `/interviews/:id` is a report, which belongs to History; `/interviews` itself is the start page.
export const isNavActive = (to, pathname) =>
  to === "/history"
    ? pathname === "/history" || pathname.startsWith("/interviews/")
    : pathname === to;
