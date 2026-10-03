import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../brand/Logo";
import ThemeToggle from "../common/ThemeToggle";

/*
 * The shell Login and Sign-up share. The sheet sits on paper with its own
 * margin rule; the form is written to the right of it.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col px-4 sm:px-8">
        <header className="flex h-[72px] shrink-0 items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-md py-1 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back
          </Link>
          <ThemeToggle />
        </header>

        <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[420px]">
            <Logo size="lg" withWordmark={false} className="mb-8" />

            <h1 className="font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
              {title}
            </h1>
            <p className="mb-9 mt-3 text-ink-muted">{subtitle}</p>

            <div className="relative pl-6">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-mark-red/40" />
              {children}
            </div>

            {footer && <div className="mt-8 pl-6 text-sm text-ink-muted">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
