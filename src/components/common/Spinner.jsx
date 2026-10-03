import { cn } from "../../lib/utils";

const SIZES = { sm: "h-px w-4", md: "h-0.5 w-6", lg: "h-0.5 w-10" };

/*
 * The app's only waiting indicator: a stroke drawn and lifted, in the world's
 * own motion grammar. A rotating spinner is a stock utility that belongs to no
 * design system, and this world says ink settles rather than spins.
 * Colour comes from `currentColor`, so callers tint it with a text class.
 */
export default function Spinner({ size = "md", className = "", label }) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={cn("ink-draw inline-block rounded-full bg-current", SIZES[size] ?? SIZES.md, className)}
    />
  );
}
