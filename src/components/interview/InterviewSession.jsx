import { useEffect, useRef } from "react";
import { Check, PhoneOff, RotateCw } from "lucide-react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { formatDuration } from "../../lib/format";

const PHASE_LABELS = {
  connecting: "Connecting to your interviewer",
  live: "Interview in progress",
  finishing: "Saving your interview and marking it",
  failed: "We could not save your interview",
};

/*
 * The transcript is the page. It fills the column and gains lines as you speak,
 * the way a worked answer fills the sheet — not a chat window beside a card.
 */
export default function InterviewSession({
  session,
  phase,
  transcript,
  isSpeaking,
  seconds,
  error,
  onStop,
  onRetry,
}) {
  const endRef = useRef(null);
  const total = session.interviewConfig.durationSeconds;
  const live = phase === "live";
  const busy = phase === "finishing" || phase === "done";
  const elapsed = Math.min(100, total ? (seconds / total) * 100 : 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [transcript]);

  // Closing the tab mid-call would lose the interview.
  useEffect(() => {
    if (!live) return undefined;
    const warn = (event) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [live]);

  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-col">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
            {session.role}
          </h1>
          <p className="mt-1 text-sm capitalize text-ink-muted">
            {session.interviewType} · {session.technologies.slice(0, 3).join(", ")}
            {session.technologies.length > 3 && ` +${session.technologies.length - 3}`}
          </p>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] ${
              live ? "text-mark-green" : "text-mark-ochre"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                live ? "bg-mark-green" : "ink-breathe bg-mark-ochre"
              }`}
            />
            {live ? "Live" : "Connecting"}
          </span>
          <span className="tabular font-mono text-sm text-ink">
            {formatDuration(seconds)}
            <span className="text-ink-faint"> / {formatDuration(total)}</span>
          </span>
        </div>
      </header>

      {/* The sheet filling up: one rule, drawn to where the session has reached. */}
      <div
        className="mt-5 h-px w-full bg-rule"
        role="progressbar"
        aria-valuenow={Math.round(elapsed)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Interview progress"
      >
        <div
          className="h-px bg-mark-red transition-[width] duration-1000 ease-linear"
          style={{ width: `${elapsed}%` }}
        />
      </div>

      {PHASE_LABELS[phase] && phase !== "live" && (
        <div
          role="status"
          className={`mt-5 flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${
            phase === "failed"
              ? "border-red-rule bg-red-wash text-red-ink"
              : "border-blue-rule bg-blue-wash text-blue-ink"
          }`}
        >
          {phase !== "failed" && <Spinner size="sm" className="text-current" />}
          <span className="flex-1">
            {PHASE_LABELS[phase]}
            {phase === "failed" && error ? `: ${error}` : ""}
          </span>
          {phase === "failed" && (
            <button onClick={onRetry} className="inline-flex items-center gap-1.5 font-medium underline">
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
            </button>
          )}
        </div>
      )}

      {error && phase !== "failed" && (
        <p role="alert" className="mt-5 rounded-md border border-red-rule bg-red-wash px-4 py-3 text-sm text-red-ink">
          {error}
        </p>
      )}

      <div className="relative mt-8 min-h-[320px] flex-1 pl-6" aria-live="polite">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-mark-red/40" />

        {transcript.length === 0 && (
          <p className="text-sm text-ink-faint">
            {live
              ? "Say hello when you are ready — your words appear here."
              : "Captions appear here once the interviewer connects."}
          </p>
        )}

        <div className="space-y-5">
          {transcript.map((turn, index) => {
            const you = turn.speaker === "You";
            return (
              <div key={index} className="mark-in relative">
                {/*
                 * The transcript gains its marks as you speak. The mark records
                 * that the turn was captured — it is not a judgement, because
                 * nothing has been scored yet while the call is still running.
                 */}
                {you && (
                  <Check
                    aria-hidden="true"
                    className="absolute -left-[22px] top-0.5 h-3 w-3 text-mark-green"
                  />
                )}
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                    you ? "text-mark-blue" : "text-ink-faint"
                  }`}
                >
                  {turn.speaker}
                  {you && <span className="sr-only"> — captured</span>}
                </p>
                <p className={`mt-1.5 max-w-[60ch] leading-relaxed ${you ? "text-ink" : "text-ink-muted"}`}>
                  {turn.text}
                </p>
              </div>
            );
          })}
        </div>

        {live && isSpeaking && (
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            Interviewer speaking
          </p>
        )}

        <div ref={endRef} />
      </div>

      <div className="mt-10 border-t border-rule pt-5">
        <Button variant="dangerOutline" onClick={onStop} disabled={busy || phase === "failed"}>
          <PhoneOff className="h-4 w-4" aria-hidden="true" /> End interview
        </Button>
      </div>
    </div>
  );
}
