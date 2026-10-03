import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { History, LayoutDashboard, LogOut, Mic, Settings } from "lucide-react";
import { useLearner } from "../../context/LearnerContext";
import Logo from "../brand/Logo";
import { cn } from "../../lib/utils";

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

export default function LearningSidebar({ open = false, onClose }) {
  const location = useLocation();
  const { logout } = useLearner();
  const panelRef = useRef(null);

  // The drawer is modal on mobile: Escape closes it and focus moves in.
  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector("a, button")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-ink/45 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        ref={panelRef}
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-rule bg-sheet",
          "transition-transform duration-300 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[72px] shrink-0 items-center border-b border-rule px-6">
          <Logo size="sm" />
        </div>

        {/* The margin rule: nav items are written to the right of it, as on the sheet. */}
        <nav className="relative flex-1 overflow-y-auto py-5 pl-6 pr-4">
          <span aria-hidden="true" className="absolute inset-y-4 left-6 w-px bg-mark-red/35" />
          <div className="space-y-0.5 pl-4">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = isNavActive(to, location.pathname);
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-sunk font-medium text-ink" : "text-ink-muted hover:bg-sunk/60 hover:text-ink",
                  )}
                >
                  <Icon
                    className={cn("h-[18px] w-[18px] shrink-0", active ? "text-mark-red" : "text-ink-faint")}
                    aria-hidden="true"
                  />
                  {label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-rule p-4">
          <button
            onClick={() => {
              logout();
              onClose?.();
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-red-wash hover:text-red-ink"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
