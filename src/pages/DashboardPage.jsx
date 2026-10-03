import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import { useAsync } from "../hooks/useAsync";
import { dashboardAPI, interviewAPI } from "../lib/api";
import { formatScore } from "../lib/format";
import { PageError } from "../components/common/PageState";
import ButtonLink from "../components/common/ButtonLink";
import ScoreBar from "../components/common/ScoreBar";
import LeadFigure from "../components/dashboard/LeadFigure";
import ScoreTrendChart from "../components/dashboard/ScoreTrendChart";
import InterviewRow from "../components/dashboard/InterviewRow";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";

/* A heading set as a small ruled label, so nothing competes with the lead figure. */
function SectionHead({ children, aside }) {
  return (
    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{children}</h2>
      {aside}
    </div>
  );
}

/*
 * The register line. This replaced a row of three identically weighted tiles
 * sitting above the trend chart — the exact arrangement the direction refuses,
 * restated in the world's own materials. Facts of different kinds now sit on
 * one ruled line at label rank, well below the lead figure.
 */
function RegisterLine({ facts }) {
  return (
    <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-rule pt-4">
      {facts.map(({ term, detail }) => (
        <div key={term} className="flex items-baseline gap-2">
          <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">{term}</dt>
          <dd className="tabular font-mono text-sm text-ink">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function DashboardPage() {
  const { user, setTokens } = useLearner();

  const { data, error, loading, reload } = useAsync(async () => {
    const [stats, history] = await Promise.all([
      dashboardAPI.getStats(),
      interviewAPI.list({ limit: 5 }),
    ]);
    return { stats: stats.data, recent: history.interviews };
  }, []);

  // Keep the header token count in step with what the server says.
  const serverTokens = data?.stats.tokens;
  useEffect(() => {
    if (typeof serverTokens === "number") setTokens(serverTokens);
  }, [serverTokens, setTokens]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <PageError message={error.message} onRetry={reload} />;

  const { stats, recent } = data;
  const scored = stats.completedInterviews > 0;

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <header className="mb-10 flex flex-wrap items-baseline justify-between gap-5">
        <div>
          {/* Demoted to label rank: the figure below is the headline. */}
          <h1 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {user?.role || (
              <>
                <Link to="/settings" className="text-ink underline">
                  Add your target role
                </Link>{" "}
                so your interviews match the job
              </>
            )}
          </p>
        </div>

        {/* The boxed answer. Kept at md so it does not outweigh the lead figure,
            which FIRST VIEWPORT wants taking first fixation. */}
        <ButtonLink to="/interviews">Start interview</ButtonLink>
      </header>

      <section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
        <LeadFigure
          label="Average score"
          value={scored ? stats.avgScore : null}
          caption={
            scored
              ? `Across ${stats.completedInterviews} scored ${
                  stats.completedInterviews === 1 ? "session" : "sessions"
                }`
              : "Nothing scored yet — your first interview sets the baseline."
          }
        />

        {scored && (
          <div className="space-y-5">
            <ScoreBar label="Technical" value={stats.avgScores.technical} />
            <ScoreBar label="Communication" value={stats.avgScores.communication} />
            <ScoreBar label="Problem solving" value={stats.avgScores.problemSolving} />
          </div>
        )}
      </section>

      <section className="mt-10">
        <RegisterLine
          facts={[
            {
              term: "Interviews",
              detail: `${stats.interviewSessions} · ${stats.completedInterviews} marked`,
            },
            { term: "Skills tracked", detail: stats.skillsTracked },
            ...(user?.experience ? [{ term: "Experience", detail: user.experience }] : []),
          ]}
        />
      </section>

      {scored && (
        <section className="mt-12">
          <ScoreTrendChart trend={stats.scoreTrend} />
        </section>
      )}

      <section className="mt-12">
        <SectionHead
          aside={
            recent.length > 0 && (
              <Link to="/history" className="text-xs text-ink-muted underline hover:text-ink">
                View all
              </Link>
            )
          }
        >
          Recent interviews
        </SectionHead>

        {recent.length > 0 ? (
          <div>
            {recent.map((interview) => (
              <InterviewRow key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <div className="border-t border-rule py-12">
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
              Ready for your first interview?
            </h3>
            <p className="mb-6 mt-2 max-w-[48ch] text-sm text-ink-muted">
              Talk through a real question out loud and get it back marked up — scored on technical
              depth, communication and problem solving.
            </p>
            <ButtonLink to="/interviews">Start practising</ButtonLink>
          </div>
        )}
      </section>

      {user?.skills?.length > 0 && (
        <section className="mt-12">
          <SectionHead>Your stack</SectionHead>
          <div className="flex flex-wrap gap-2 border-t border-rule pt-4">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-rule-strong px-3 py-1 text-xs text-ink-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Keeps the 0-10 scale legible to assistive tech without repeating it visually. */}
      <p className="sr-only">Average score {formatScore(stats.avgScore)}.</p>
    </div>
  );
}
