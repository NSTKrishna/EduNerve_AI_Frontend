import { formatScore, hasScore, scoreLabel, scoreTone } from "../../lib/format";

/*
 * The register's headline. Hierarchy here is scale contrast alone, so the
 * figure has to outrank everything else on the view by a long way — at a 1.6x
 * step it merely competed with the greeting.
 */
export default function LeadFigure({ label, value, caption }) {
  const scored = hasScore(value);

  return (
    <div className="relative pl-6">
      <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-mark-red/40" />

      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</p>

      <p className="mt-2 flex items-baseline gap-3">
        <span
          className={`tabular font-display text-[clamp(4.5rem,12vw,7rem)] font-semibold leading-[0.85] tracking-[-0.045em] ${
            scored ? "text-ink" : "text-ink-faint"
          }`}
        >
          {scored ? formatScore(value).split("/")[0] : "--"}
        </span>
        <span className="font-mono text-sm text-ink-faint">/10</span>
      </p>

      {scored && (
        <p className={`mark-in mt-1 font-mono text-[11px] uppercase tracking-[0.12em] ${scoreTone(value)}`}>
          {scoreLabel(value)}
        </p>
      )}

      {caption && <p className="mt-3 text-sm text-ink-muted">{caption}</p>}
    </div>
  );
}
