import { useEffect, useState } from "react";
import { useLearner } from "../../context/LearnerContext";
import { dashboardAPI } from "../../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Button from "../common/Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BookOpen, MessageSquare, Coins } from "lucide-react";

const normalizeScoreToPercent = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  // backend stores Float; could be 0..1 or 0..100 depending on implementation
  const v = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, v));
};

const formatScore = (value) => {
  const pct = normalizeScoreToPercent(value);
  if (pct === null) return "N/A";
  return `${Math.round(pct)}%`;
};

const chartBlue = "#2563eb"; // tailwind blue-600
const chartBlueLight = "#60a5fa"; // tailwind blue-400

export function OverviewContent() {
  const { learnerProfile, tokens, fetchTokens } = useLearner();
  const [stats, setStats] = useState({
    avgScore: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    skillsTracked: 0,
  });
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const toggleFeedback = (interviewId) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [interviewId]: !prev[interviewId],
    }));
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        if (response.success) {
          setStats((prev) => ({
            ...prev,
            totalInterviews: Number(response?.data?.interviewSessions || 0),
            skillsTracked: Number(response?.data?.skillsTracked || 0),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
    fetchTokens(); // Ensure tokens are perfectly synced on dashboard load
  }, []);

  useEffect(() => {
    if (learnerProfile) {
      const interviews = learnerProfile.interviewsPracticed || [];
      const scoredInterviews = interviews.filter(
        (i) => normalizeScoreToPercent(i?.overallScore) !== null,
      );
      const avgOverall =
        scoredInterviews.length > 0
          ? scoredInterviews.reduce(
              (sum, i) => sum + normalizeScoreToPercent(i.overallScore),
              0,
            ) / scoredInterviews.length
          : 0;

      setStats((prev) => ({
        ...prev,
        avgScore: avgOverall > 0 ? Math.round(avgOverall * 10) / 10 : 0,
        completedInterviews: interviews.length,
      }));
    }
  }, [learnerProfile]);

  // Prepare skills chart data
  const skillsChartData = (learnerProfile?.skills || [])
    .slice(0, 8)
    .map((skill) => ({ skill }));

  const recentInterview = (learnerProfile?.interviewsPracticed || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.completedAt || b?.createdAt || b?.startedAt || 0) -
        new Date(a?.completedAt || a?.createdAt || a?.startedAt || 0),
    )[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {learnerProfile?.name || "Learner"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {learnerProfile?.role || "Complete your profile to get started"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Tokens
            </CardTitle>
            <Coins className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokens !== null ? tokens : "..."} 🪙
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-blue-600 font-medium">
              Ready for {tokens !== null ? Math.floor(tokens / 10) : 0}{" "}
              interviews
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.avgScore > 0 ? `${Math.round(stats.avgScore)}%` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your recent activity
            </p>

            {recentInterview && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                  <span className="text-muted-foreground">Tech</span>
                  <div className="font-semibold text-foreground">
                    {formatScore(recentInterview.technicalScore)}
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                  <span className="text-muted-foreground">Comm</span>
                  <div className="font-semibold text-foreground">
                    {formatScore(recentInterview.communicationScore)}
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                  <span className="text-muted-foreground">Problem</span>
                  <div className="font-semibold text-foreground">
                    {formatScore(recentInterview.problemSolvingScore)}
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                  <span className="text-muted-foreground">Overall</span>
                  <div className="font-semibold text-foreground">
                    {formatScore(recentInterview.overallScore)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Skills Tracked
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.skillsTracked || learnerProfile?.skills?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {learnerProfile?.experience || "Set your experience level"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interview Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalInterviews}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-accent font-medium">
                {/* Just showing total for now as "completed" count logic might differ */}
                {stats.completedInterviews}
              </span>{" "}
              feedback received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {(learnerProfile?.skills?.length || 0) > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Skills Progress Chart */}
          {(learnerProfile?.skills?.length || 0) > 0 && (
            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Your Tech Stack</CardTitle>
                <CardDescription>Skills you're tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsChartData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      opacity={0.8}
                    />
                    <XAxis type="number" domain={[0, 1]} hide />
                    <YAxis
                      dataKey="skill"
                      type="category"
                      width={140}
                      tick={{
                        fill: "#334155",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      wrapperStyle={{ zIndex: 50 }}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        color: "#0f172a",
                        boxShadow:
                          "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)",
                      }}
                      formatter={() => null}
                      labelFormatter={(label) => `Skill: ${label}`}
                    />
                    <Bar
                      dataKey={() => 1}
                      fill={chartBlue}
                      activeBar={{ fill: chartBlueLight }}
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>

                <p className="mt-3 text-xs text-muted-foreground">
                  This list is based on the skills in your profile.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Interview Feedback */}
      {(learnerProfile?.interviewsPracticed || []).length > 0 && (
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Interview Feedback</CardTitle>
            <CardDescription>
              Summary of your latest interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(learnerProfile?.interviewsPracticed || [])
                .slice(0, 5)
                .map((interview, index) => (
                  <div
                    key={interview.id || index}
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">
                          {interview.role || "N/A"} -{" "}
                          {interview.interviewType || "Interview"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            interview.createdAt || interview.startedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {interview.overallScore && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {formatScore(interview.overallScore)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {interview.feedback ? (
                        <>
                          <p
                            className={`text-sm text-muted-foreground ${
                              expandedFeedback[interview.id]
                                ? ""
                                : "line-clamp-2"
                            }`}
                          >
                            {interview.feedback}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeedback(interview.id)}
                            className="text-xs cursor-pointer"
                          >
                            {expandedFeedback[interview.id]
                              ? "Show Less"
                              : "Show Full Feedback"}
                          </Button>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          No feedback available for this interview
                        </div>
                      )}
                    </div>
                    {interview.strengths && interview.strengths.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {interview.strengths.slice(0, 3).map((strength, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-green-500/10 px-2 py-0.5 text-xs text-green-700 dark:text-green-400"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalInterviews === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ready to start your learning journey?
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Practice an interview to get personalized feedback and track your
              progress.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OverviewContent;
