import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "./Button";

/*
 * A modal that behaves like one: Escape closes it, focus moves in and is kept
 * inside while it is open, and focus returns to whatever opened it. Used for
 * destructive confirmations, which previously expanded inline under the form
 * that triggered them.
 */
export default function Dialog({ open, onClose, title, description, children, footer }) {
  const panelRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    openerRef.current = document.activeElement;
    const panel = panelRef.current;
    // `a?.focus?.() ?? b.focus()` would run both, since focus() returns undefined.
    const preferred = panel?.querySelector("[data-autofocus]");
    if (preferred) preferred.focus();
    else panel?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
        tabIndex={-1}
        className="mark-in relative w-full max-w-md rounded-lg border border-rule-strong bg-sheet p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h2 id="dialog-title" className="font-display text-lg font-semibold tracking-[-0.015em] text-ink">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="text-sm text-ink-muted">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
