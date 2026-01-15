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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Award, BookOpen, MessageSquare } from "lucide-react";

export function OverviewContent() {
  const { learnerProfile } = useLearner();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    avgScore: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    recentInterviews: [],
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
          const { totalQuizAttempts, interviewSessions, recentInterviews } =
            response.data;

          setStats((prev) => ({
            ...prev,
            totalQuizzes: totalQuizAttempts,
            totalInterviews: interviewSessions,
            completedInterviews: recentInterviews.length, // Display count of recentCompleted
            recentInterviews: recentInterviews,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (learnerProfile) {
      const quizzes = learnerProfile.quizAttempts || [];
      const totalQuizzes = quizzes.length;
      const avgScore =
        totalQuizzes > 0
          ? quizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) /
          totalQuizzes
          : 0;

      setStats((prev) => ({
        ...prev,
        avgScore: Math.round(avgScore * 10) / 10,
      }));
    }
  }, [learnerProfile]);

  const quizChartData = (learnerProfile?.quizAttempts || [])
    .slice(-6)
    .map((quiz, index) => ({
      name: `Quiz ${index + 1}`,
      score: quiz.percentage || 0,
      total: 100,
    }));

  // Prepare skills chart data
  const skillsChartData = (learnerProfile?.skills || [])
    .slice(0, 5)
    .map((skill) => ({
      skill,
      progress: 75, // Default progress since we don't track individual skill progress yet
    }));

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Quiz Attempts
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalQuizzes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep practicing to improve!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.avgScore > 0 ? `${stats.avgScore}%` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalQuizzes > 0
                ? "Great progress!"
                : "Take a quiz to get started"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Skills Tracked
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {learnerProfile?.skills?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {learnerProfile?.experience || "Set your experience level"}
            </p>
          </CardContent>
        </Card>

        <Card>
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
      {(stats.totalQuizzes > 0 ||
        (learnerProfile?.skills?.length || 0) > 0) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quiz Performance Chart */}
            {stats.totalQuizzes > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quiz Performance</CardTitle>
                  <CardDescription>
                    Your last {quizChartData.length} quiz attempts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={quizChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Score %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Skills Progress Chart */}
            {(learnerProfile?.skills?.length || 0) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Tech Stack</CardTitle>
                  <CardDescription>Skills you're tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsChartData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        className="text-xs"
                      />
                      <YAxis
                        dataKey="skill"
                        type="category"
                        width={100}
                        className="text-xs"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="progress"
                        fill="hsl(var(--primary))"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

      {/* Recent Interview Feedback */}
      {stats.recentInterviews && stats.recentInterviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Interview Feedback</CardTitle>
            <CardDescription>
              Summary of your latest interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInterviews.map((interview, index) => (
                <div
                  key={interview.id || index}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">
                        {interview.role || "N/A"} - {interview.interviewType || "Interview"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          interview.createdAt || interview.startedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    {interview.overallScore && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {interview.overallScore}%
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {interview.feedback ? (
                      <>
                        <p
                          className={`text-sm text-muted-foreground ${expandedFeedback[interview.id]
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
      {stats.totalQuizzes === 0 && stats.totalInterviews === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ready to start your learning journey?
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Take a quiz or practice an interview to get personalized feedback
              and track your progress.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OverviewContent;
