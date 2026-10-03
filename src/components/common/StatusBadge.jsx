import { STATUS_LABELS } from "../../lib/format";

/*
 * One state vocabulary, rendered identically everywhere. Each state keeps its
 * own mark so the same status never appears two different ways.
 */
const TONES = {
  completed: "border-green-rule bg-green-wash text-green-ink",
  in_progress: "border-ochre-rule bg-ochre-wash text-ochre-ink",
  abandoned: "border-rule-strong bg-sunk text-ink-muted",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] ${
        TONES[status] || TONES.abandoned
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
