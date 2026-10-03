import { cn } from "../../lib/utils";

/*
 * The primary action is the boxed answer: ink fill, paper text, square-ish
 * corners. Everything else is quieter than it — a worksheet has one answer per
 * question, and the page should read that way.
 */
export const BUTTON_VARIANTS = {
  primary: "bg-primary text-primary-ink hover:bg-primary-hover",
  outline: "border border-rule-strong bg-sheet text-ink hover:bg-sunk",
  ghost: "text-ink-muted hover:bg-sunk hover:text-ink",
  wash: "bg-sunk text-ink hover:bg-rule",
  danger: "bg-mark-red text-sheet hover:opacity-90",
  dangerOutline: "border border-red-rule bg-red-wash text-red-ink hover:border-mark-red",
};

export const BUTTON_SIZES = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
  icon: "h-10 w-10",
};

export const buttonClasses = ({ variant = "primary", size = "md", className = "" } = {}) =>
  cn(
    "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap",
    "transition-[background-color,border-color,opacity] duration-150",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.primary,
    BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
    className,
  );
