import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate, formatScore, hasScore, interviewRef, scoreLabel, scoreTone } from "../../lib/format";

/* A line in the register: reference, subject, date, and the mark it earned. */
export default function InterviewRow({ interview }) {
  const scored = hasScore(interview.overallScore);

  return (
    <Link
      to={`/interviews/${interview.id}`}
      className="group flex items-start gap-4 border-t border-rule py-4 transition-colors hover:bg-sunk/50"
    >
      <span className="tabular mt-0.5 hidden w-[72px] shrink-0 font-mono text-[11px] tracking-[0.04em] text-ink-faint sm:block">
        {interviewRef(interview.id)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h4 className="truncate font-medium text-ink">{interview.role}</h4>
          <span className="text-xs capitalize text-ink-muted">{interview.interviewType}</span>
          <StatusBadge status={interview.status} />
        </div>
        <p className="mt-1 truncate text-sm text-ink-muted">
          {formatDate(interview.completedAt || interview.startedAt)}
          {interview.technologies.length > 0 && ` · ${interview.technologies.slice(0, 3).join(", ")}`}
        </p>
        {interview.feedback && interview.status === "completed" && (
          <p className="mt-1.5 line-clamp-1 text-sm text-ink-faint">{interview.feedback}</p>
        )}
      </div>

      {scored && (
        <div className="shrink-0 text-right">
          <p className={`tabular font-mono text-lg ${scoreTone(interview.overallScore)}`}>
            {formatScore(interview.overallScore)}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
            {scoreLabel(interview.overallScore)}
          </p>
        </div>
      )}
    </Link>
  );
}
