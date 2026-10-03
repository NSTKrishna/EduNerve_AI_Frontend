import { cn } from "../../lib/utils";

const TONES = {
  success: "bg-mark-green",
  warning: "bg-mark-ochre",
  danger: "bg-mark-red",
  neutral: "bg-ink-faint",
};

/*
 * The mark: a stroke drawn along a ruled track to where the score reached.
 * The track is the ruled line; the stroke is the annotation over it.
 */
export default function Progress({ value = 0, tone = "neutral", className = "", label }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative h-[6px] w-full overflow-hidden rounded-full bg-sunk", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", TONES[tone] ?? TONES.neutral)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
