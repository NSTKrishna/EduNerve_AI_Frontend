import { useId } from "react";
import { cn } from "../../lib/utils";

export default function Input({ label, error, hint, className = "", id, ...props }) {
  const generated = useId();
  const inputId = id || generated;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          "h-11 w-full rounded-md border bg-sheet px-3.5 text-ink transition-colors",
          "placeholder:text-ink-faint disabled:cursor-not-allowed disabled:bg-sunk disabled:opacity-70",
          error ? "border-mark-red" : "border-rule-strong hover:border-ink-faint",
          className,
        )}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mark-in mt-1.5 text-sm text-mark-red">
          {error}
        </p>
      )}
    </div>
  );
}
