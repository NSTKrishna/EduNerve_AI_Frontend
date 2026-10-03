import { AlertCircle } from "lucide-react";

export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mark-in flex items-start gap-2.5 rounded-md border border-red-rule bg-red-wash px-3 py-2.5 text-sm text-red-ink"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
