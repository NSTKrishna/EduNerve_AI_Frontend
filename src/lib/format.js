// Backend scores are 0-10 (or null when there was no AI evaluation).
export const SCORE_MAX = 10;

export const hasScore = (value) => typeof value === "number" && Number.isFinite(value);

export function formatScore(value) {
  if (!hasScore(value)) return "N/A";
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}/${SCORE_MAX}`;
}

/** 0-100 for progress bars. */
export const scoreToPercent = (value) => (hasScore(value) ? Math.max(0, Math.min(100, (value / SCORE_MAX) * 100)) : 0);

/**
 * "success" | "warning" | "danger" | "neutral" — the semantic band a score falls in.
 *
 * Banded on the value as DISPLAYED, not the raw one. formatScore rounds to one
 * decimal, so 7.45 prints as "7.5/10"; banding the raw value put "7.5 Developing"
 * next to "7.5 Strong" on the same screen.
 */
export function scoreBand(value) {
  if (!hasScore(value)) return "neutral";
  const shown = Math.round(value * 10) / 10;
  if (shown >= 7.5) return "success";
  if (shown >= 5) return "warning";
  return "danger";
}

const TONE_CLASS = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-muted-foreground",
};

export const scoreTone = (value) => TONE_CLASS[scoreBand(value)];

/*
 * A word for the band, so the score's quality is not carried by colour alone.
 */
const BAND_LABEL = {
  success: "Strong",
  warning: "Developing",
  danger: "Needs work",
  neutral: "Not scored",
};

export const scoreLabel = (value) => BAND_LABEL[scoreBand(value)];

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function formatDate(value, options = { dateStyle: "medium" }) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(undefined, options).format(date);
}

export const formatDateTime = (value) => formatDate(value, { dateStyle: "medium", timeStyle: "short" });

export const STATUS_LABELS = {
  completed: "Completed",
  in_progress: "In progress",
  abandoned: "Not finished",
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

/*
 * A short, stable, citable reference for an interview, derived from its id.
 * History reads as a body of work you can point at — "EN-7K42" — rather than a
 * list of undifferentiated rows. Derived, never invented: the same id always
 * yields the same code.
 */
const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // no I, L, O, U

export function interviewRef(id) {
  const source = String(id ?? "");
  if (!source) return "EN-0000";
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  let code = "";
  for (let i = 0; i < 4; i += 1) {
    code += REF_ALPHABET[hash % REF_ALPHABET.length];
    hash = Math.floor(hash / REF_ALPHABET.length);
  }
  return `EN-${code}`;
}
