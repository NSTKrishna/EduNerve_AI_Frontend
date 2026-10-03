import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, LayoutDashboard, Target } from "lucide-react";
import { useLearner } from "../context/LearnerContext";
import Logo from "../components/brand/Logo";
import Avatar from "../components/common/Avatar";
import ButtonLink from "../components/common/ButtonLink";
import ThemeToggle from "../components/common/ThemeToggle";

/*
 * The sequence carries the argument, so the steps are numbered and ruled rather
 * than boxed into equal cards.
 */
const STEPS = [
  {
    title: "Name the job",
    body: "Pick the role you're interviewing for and the technologies you want to be asked about. That selection is what the interviewer is built from — not a generic question bank.",
  },
  {
    title: "Say it out loud",
    body: "A short spoken interview with follow-up questions, timed by the session itself. Your answers are transcribed as you go, so nothing depends on remembering what you said.",
  },
  {
    title: "Read it back marked up",
    body: "Scored on technical depth, communication and problem solving, with the marks written in the margin beside the conversation they came from.",
  },
];

function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const name = user?.name || "User";

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((shown) => !shown)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full p-0.5 transition-opacity hover:opacity-80"
      >
        <span className="hidden text-sm text-ink sm:block">{name}</span>
        <Avatar name={name} />
      </button>

      {open && (
        <div
          role="menu"
          className="mark-in absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-md border border-rule-strong bg-sheet py-1.5"
        >
          <div className="border-b border-rule px-4 py-3">
            <p className="truncate text-sm text-ink">{name}</p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-ink-faint">{user?.email}</p>
          </div>
          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-sunk"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink-muted transition-colors hover:bg-red-wash hover:text-red-ink"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/*
 * The proof: a specimen of what comes back, built the way the real report is.
 * Labelled a sample so nobody mistakes it for their own data, and carrying no
 * claim about anyone's results.
 */
function Specimen() {
  return (
    <figure className="w-full">
      <figcaption className="mb-4 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        <span>Sample report</span>
        <span aria-hidden="true">EN-4K71</span>
      </figcaption>

      <div className="rounded-lg border border-rule bg-sheet p-6">
        <div className="flex items-start justify-between gap-6 border-b border-rule pb-5">
          <div>
            <p className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
              Backend Developer
            </p>
            <p className="mt-1 text-sm text-ink-muted">Technical · Node.js, PostgreSQL</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-mark-green">
              8.1
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              Strong
            </p>
          </div>
        </div>

        <div className="relative mt-5 space-y-4 pl-5">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-mark-red/40" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark-blue">You</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              I&apos;d put an index on the lookup column first, then check the query plan before
              changing anything else.
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2.5 border-t border-rule pt-5">
          <li className="flex gap-2.5 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-mark-green" aria-hidden="true" />
            Reached for measurement before optimising
          </li>
          <li className="flex gap-2.5 text-sm text-ink">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-mark-ochre" aria-hidden="true" />
            Name the trade-off an index costs on writes
          </li>
        </ul>
      </div>
    </figure>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useLearner();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const primaryHref = isAuthenticated ? "/dashboard" : "/signup";

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <AccountMenu user={user} onLogout={handleLogout} />
            ) : (
              <>
                <ButtonLink to="/login" variant="ghost" className="hidden sm:inline-flex">
                  Log in
                </ButtonLink>
                <ButtonLink to="/signup">Get started</ButtonLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="mx-auto max-w-[1100px] px-4 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div className="relative pl-6">
              <span aria-hidden="true" className="absolute inset-y-2 left-0 w-px bg-mark-red/40" />

              <h1 className="font-display text-[clamp(2.75rem,6.5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">
                Practise the interview you&apos;re actually going to
              </h1>

              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-muted">
                Pick your role and your stack. Talk through a real question out loud. Get it back
                marked up, the way a good coach would hand it to you.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to={primaryHref} size="lg" className="group">
                  {isAuthenticated ? "Go to dashboard" : "Start practising free"}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </ButtonLink>
                {!isAuthenticated && (
                  <ButtonLink to="/login" size="lg" variant="outline">
                    I already have an account
                  </ButtonLink>
                )}
              </div>
            </div>

            <Specimen />
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 pb-14 sm:px-8 sm:pb-16">
          <h2 className="mb-10 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            How it works
          </h2>

          <ol className="max-w-[760px]">
            {STEPS.map(({ title, body }, index) => (
              <li key={title} className="flex gap-6 border-t border-rule py-7 sm:gap-8">
                <span className="tabular shrink-0 pt-1 font-mono text-[11px] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[58ch] leading-relaxed text-ink-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 pb-24 sm:px-8 sm:pb-28">
          <div className="relative max-w-[760px] border-t border-rule pt-12 pl-6">
            <span aria-hidden="true" className="absolute bottom-0 left-0 top-10 w-px bg-mark-red/40" />
            <h2 className="max-w-[20ch] font-display text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
              Your next interview shouldn&apos;t be the first time you say it out loud
            </h2>
            <div className="mt-8">
              <ButtonLink to={primaryHref} size="lg" className="group">
                {isAuthenticated ? "Go to dashboard" : "Start practising free"}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
          <Logo size="sm" />
          <p className="font-mono text-[11px] text-ink-faint">
            &copy; {new Date().getFullYear()} EduNerve AI
          </p>
        </div>
      </footer>
    </div>
  );
}
