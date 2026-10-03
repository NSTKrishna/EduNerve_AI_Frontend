/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Info, X } from "lucide-react";

const ToastContext = createContext(null);

/* Each notice carries its mark: a tick, a correction, a note. */
const STYLES = {
  success: { icon: Check, classes: "border-green-rule bg-green-wash text-green-ink" },
  error: { icon: AlertCircle, classes: "border-red-rule bg-red-wash text-red-ink" },
  info: { icon: Info, classes: "border-blue-rule bg-blue-wash text-blue-ink" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts((all) => all.filter((toast) => toast.id !== id)), []);

  const show = useCallback(
    (message, type = "info", duration = 5000) => {
      const id = nextId.current++;
      setToasts((all) => [...all, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      show,
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error", 7000),
      info: (message) => show(message, "info"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map(({ id, message, type }) => {
          const { icon: Icon, classes } = STYLES[type] || STYLES.info;
          return (
            <div
              key={id}
              role={type === "error" ? "alert" : "status"}
              className={`mark-in pointer-events-auto flex items-start gap-3 rounded-md border p-3 text-sm ${classes}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1">{message}</p>
              <button onClick={() => dismiss(id)} aria-label="Dismiss" className="opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
