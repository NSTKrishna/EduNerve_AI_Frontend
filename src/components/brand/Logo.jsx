import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const MARK = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" };
const WORD = { sm: "text-base", md: "text-lg", lg: "text-xl" };

/*
 * A sheet with a margin rule and two lines of writing. Drawn as SVG rather
 * than stacked boxes so it stays legible at 28px, where percentage insets
 * collapsed into an unreadable blot.
 */
function Mark({ size }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("block shrink-0", MARK[size] ?? MARK.md)}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="22.5"
        rx="5"
        fill="var(--sheet)"
        stroke="var(--rule-strong)"
        strokeWidth="1.5"
      />
      <line x1="7" y1="4.5" x2="7" y2="19.5" stroke="var(--mark-red)" strokeWidth="1.5" />
      <line
        x1="10.5"
        y1="10"
        x2="18.5"
        y2="10"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="10.5"
        y1="14.5"
        x2="15.5"
        y2="14.5"
        stroke="var(--ink-faint)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ size = "md", to = "/", withWordmark = true, className = "" }) {
  const content = (
    <>
      <Mark size={size} />
      {withWordmark && (
        <span className={cn("font-display font-semibold tracking-[-0.02em] text-ink", WORD[size] ?? WORD.md)}>
          EduNerve
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  return to ? (
    <Link to={to} className={classes} aria-label="EduNerve AI, home">
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}
