import Progress from "./Progress";
import { formatScore, scoreBand, scoreLabel, scoreToPercent, scoreTone } from "../../lib/format";

/*
 * One line of the marked-up sheet: what was assessed, the word for how it went,
 * and the figure — with the mark drawn beneath it.
 */
export default function ScoreBar({ label, value, showBand = true }) {
  const band = scoreBand(value);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink">{label}</span>
        <span className="flex items-baseline gap-2.5">
          {showBand && band !== "neutral" && (
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              {scoreLabel(value)}
            </span>
          )}
          <span className={`tabular font-mono text-sm font-medium ${scoreTone(value)}`}>
            {formatScore(value)}
          </span>
        </span>
      </div>
      <Progress value={scoreToPercent(value)} tone={band} label={label} />
    </div>
  );
}
