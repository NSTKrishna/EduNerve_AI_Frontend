import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Lightbulb, Target } from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { interviewAPI } from "../lib/api";
import {
  formatDateTime,
  formatDuration,
  formatScore,
  hasScore,
  interviewRef,
  scoreLabel,
  scoreTone,
} from "../lib/format";
import { PageError, PageLoading } from "../components/common/PageState";
import ScoreBar from "../components/common/ScoreBar";
import StatusBadge from "../components/common/StatusBadge";

const MARKS = {
  green: { rule: "bg-mark-green", icon: "text-mark-green" },
  ochre: { rule: "bg-mark-ochre", icon: "text-mark-ochre" },
  blue: { rule: "bg-mark-blue", icon: "text-mark-blue" },
};

/* One mark in the margin: a rule, a word, and the lines it carries. */
function Annotation({ icon: Icon, mark, title, items }) {
  if (!items.length) return null;
  const tone = MARKS[mark];

  return (
    <section className="relative pl-4">
      <span aria-hidden="true" className={`absolute inset-y-0.5 left-0 w-px ${tone.rule}`} />
      <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
        <Icon className={`h-3.5 w-3.5 ${tone.icon}`} aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-2.5 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed text-ink">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Notice({ tone, children }) {
  const tones = {
    ochre: "border-ochre-rule bg-ochre-wash text-ochre-ink",
    blue: "border-blue-rule bg-blue-wash text-blue-ink",
    plain: "border-rule-strong bg-sunk text-ink-muted",
  };
  return (
    <div role="status" className={`rounded-md border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

export default function ReportPage() {
  const { interviewId } = useParams();
  const { data, error, loading, reload } = useAsync(
    () => interviewAPI.get(interviewId),
    [interviewId],
  );

  if (loading) return <PageLoading label="Loading report" />;
  if (error) {
    return (
      <PageError
        message={error.code === "NOT_FOUND" ? "We couldn't find that interview." : error.message}
        onRetry={error.code === "NOT_FOUND" ? undefined : reload}
      />
    );
  }

  const { interview } = data;
  const analysis = interview.aiAnalysis || {};
  const transcript = Array.isArray(interview.transcript) ? interview.transcript : [];
  const scored = hasScore(interview.overallScore);
  const feedbackUnavailable = interview.status === "completed" && !scored;

  const strengths = interview.strengths || [];
  const weakAreas = interview.weakAreas || [];
  const notes = Array.isArray(analysis.notes) ? analysis.notes : [];
  const hasMarks = strengths.length > 0 || weakAreas.length > 0 || notes.length > 0;

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All interviews
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
        <div className="min-w-0">
          <p className="tabular font-mono text-[11px] tracking-[0.1em] text-ink-faint">
            {interviewRef(interview.id)}
          </p>
          {/* Demoted so the figure is unambiguously the headline. */}
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em] text-ink">{interview.role}</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-ink-muted">
            <span className="capitalize">{interview.interviewType}</span>
            <span aria-hidden="true" className="text-ink-faint">·</span>
            <span>{formatDateTime(interview.completedAt || interview.startedAt)}</span>
            {interview.duration != null && (
              <>
                <span aria-hidden="true" className="text-ink-faint">·</span>
                {/* Labelled: beside a timestamp, a bare "10:12" reads as another clock time. */}
                <span className="tabular font-mono text-xs">
                  {formatDuration(interview.duration)} long
                </span>
              </>
            )}
            <StatusBadge status={interview.status} />
          </p>
          {interview.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {interview.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-rule-strong px-2.5 py-0.5 text-xs text-ink-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {scored && (
          <div className="shrink-0">
            <p
              className={`tabular font-display text-[clamp(4rem,10vw,5.5rem)] font-semibold leading-[0.85] tracking-[-0.045em] ${scoreTone(
                interview.overallScore,
              )}`}
            >
              {formatScore(interview.overallScore).split("/")[0]}
            </p>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              {scoreLabel(interview.overallScore)} · out of 10
            </p>
            <p className="sr-only">{formatScore(interview.overallScore)}</p>
          </div>
        )}
      </header>

      <div className="mt-8 space-y-10">
        {feedbackUnavailable && (
          <Notice tone="ochre">
            AI feedback wasn&apos;t available for this interview, so there are no scores. Your
            transcript was saved below.
          </Notice>
        )}
        {interview.status === "abandoned" && (
          <Notice tone="plain">
            This interview ended before any answers were recorded, so it wasn&apos;t scored and the
            tokens were refunded.
          </Notice>
        )}
        {interview.status === "in_progress" && (
          <Notice tone="blue">
            This interview was never submitted, so there&apos;s no feedback yet.
          </Notice>
        )}

        {scored && (
          <section>
            <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Scores
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <ScoreBar label="Technical" value={interview.technicalScore} />
              <ScoreBar label="Communication" value={interview.communicationScore} />
              <ScoreBar label="Problem solving" value={interview.problemSolvingScore} />
            </div>
          </section>
        )}

        {interview.feedback && (
          <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Feedback
            </h2>
            {analysis.summary && <p className="mb-3 max-w-[62ch] text-ink">{analysis.summary}</p>}
            <p className="max-w-[62ch] whitespace-pre-line leading-relaxed text-ink-muted">
              {interview.feedback}
            </p>
          </section>
        )}

        {/*
         * The marked-up sheet: the transcript is the work, and the marks sit in
         * the margin beside it rather than stacked above it as a verdict.
         *
         * The marks are session-level because that is all the backend returns —
         * strengths, weak areas and notes arrive as flat arrays with no link to
         * a turn. Pinning each one to a specific answer would be inventing an
         * attribution the data does not carry, so the margin heading says what
         * they cover.
         */}
        <section>
          <h2 className="mb-5 flex flex-wrap items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            Marked up
            <span className="tabular text-ink-faint">{transcript.length} turns</span>
          </h2>

          {transcript.length === 0 && !hasMarks ? (
            <p className="border-t border-rule py-5 text-sm text-ink-muted">
              No transcript was recorded.
            </p>
          ) : (
            <div className="grid gap-8 border-t border-rule pt-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
              {hasMarks && (
                <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
                  <p className="text-xs leading-relaxed text-ink-faint">
                    Marks for the session as a whole, read against the conversation beside them.
                  </p>
                  <Annotation icon={Check} mark="green" title="What worked" items={strengths} />
                  <Annotation icon={Target} mark="ochre" title="Work on this" items={weakAreas} />
                  <Annotation icon={Lightbulb} mark="blue" title="Next time" items={notes} />
                </aside>
              )}

              <div className="relative space-y-5 pl-6">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-mark-red/35" />
                {transcript.length === 0 && (
                  <p className="text-sm text-ink-muted">No transcript was recorded.</p>
                )}
                {transcript.map((turn, index) => {
                  const you = turn.speaker === "You";
                  return (
                    <div key={index}>
                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                          you ? "text-mark-blue" : "text-ink-faint"
                        }`}
                      >
                        {turn.speaker}
                      </p>
                      <p
                        className={`mt-1.5 max-w-[62ch] leading-relaxed ${
                          you ? "text-ink" : "text-ink-muted"
                        }`}
                      >
                        {turn.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
