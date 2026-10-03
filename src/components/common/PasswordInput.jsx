import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

export default function PasswordInput({ label, error, hint, className = "", id, ...props }) {
  const generated = useId();
  const inputId = id || generated;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [visible, setVisible] = useState(false);

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
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          className={cn(
            "h-11 w-full rounded-md border bg-sheet pl-3.5 pr-11 text-ink transition-colors",
            "placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-70",
            error ? "border-mark-red" : "border-rule-strong hover:border-ink-faint",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm text-ink-faint transition-colors hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
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
