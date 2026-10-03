import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Select({ label, className = "", id, children, ...props }) {
  const generated = useId();
  const selectId = id || generated;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-11 w-full appearance-none rounded-md border border-rule-strong bg-sheet",
            "pl-3.5 pr-10 text-ink transition-colors hover:border-ink-faint",
            "disabled:cursor-not-allowed disabled:opacity-70",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
