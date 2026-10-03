import { AlertCircle } from "lucide-react";
import Spinner from "./Spinner";
import Button from "./Button";

export function PageLoading({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Spinner size="lg" className="text-mark-red" />
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted" role="status">
        {label}
      </p>
    </div>
  );
}

export function PageError({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-3 border-l border-mark-red py-6 pl-5">
      <AlertCircle className="h-5 w-5 text-mark-red" aria-hidden="true" />
      <p className="text-ink">{message || "Something went wrong."}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* An empty state that says what to do next, not just that there is nothing. */
export function EmptyState({ title, description, action }) {
  return (
    <div className="px-6 py-14 text-center">
      <h3 className="mb-2 text-xl text-ink">{title}</h3>
      {description && <p className="mx-auto mb-6 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action}
    </div>
  );
}
