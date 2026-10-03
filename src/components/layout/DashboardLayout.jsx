import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import LearningSidebar from "./LearningSidebar";
import { NAV_LINKS, isNavActive } from "./navigation";
import Button from "../common/Button";
import ThemeToggle from "../common/ThemeToggle";
import Avatar from "../common/Avatar";
import { useLearner } from "../../context/LearnerContext";

const TITLES = { "/interviews": "AI Interview" };

function currentTitle(pathname) {
  if (pathname.startsWith("/interviews/")) return "Report";
  const match = NAV_LINKS.find((link) => isNavActive(link.to, pathname));
  return TITLES[pathname] || match?.label || "";
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, tokens } = useLearner();
  const { pathname } = useLocation();
  const userName = user?.name || "User";

  return (
    <div className="min-h-screen bg-paper">
      <LearningSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:ml-[248px]">
        <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-3 border-b border-rule bg-paper/92 px-4 backdrop-blur lg:px-10">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Without this the only cue to where you are is the page h1, which scrolls away. */}
          <p className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted lg:hidden">
            {currentTitle(pathname)}
          </p>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {tokens !== null && (
              <Link
                to="/settings"
                className="group inline-flex items-baseline gap-1.5 rounded-md px-2.5 py-1.5 transition-colors hover:bg-sunk"
              >
                <span className="tabular font-mono text-sm font-medium text-ink">{tokens}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  tokens
                </span>
              </Link>
            )}
            <ThemeToggle />
            <span className="hidden text-sm text-ink sm:block">{userName}</span>
            <Avatar name={userName} />
          </div>
        </header>

        <main id="main" tabIndex={-1} className="flex-1 px-4 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
