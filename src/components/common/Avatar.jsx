import { initials } from "../../lib/format";
import { cn } from "../../lib/utils";

const SIZES = { sm: "h-8 w-8 text-[11px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };

export default function Avatar({ name, size = "md", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-rule-strong bg-sunk font-mono font-medium tracking-wide text-ink",
        SIZES[size] ?? SIZES.md,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
