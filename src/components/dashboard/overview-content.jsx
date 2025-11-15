import { useEffect, useState } from "react"
import { useLearner } from "../../context/LearnerContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Award, BookOpen, MessageSquare, Target, Brain, Zap } from "lucide-react"

export function OverviewContent() {
  const { learnerProfile } = useLearner()
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    avgScore: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    avgInterviewScore: 0,
    improvement: 0,
  })

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  useEffect(() => {
    if (learnerProfile) {
      const quizzes = learnerProfile.quizAttempts || []
      const interviews = learnerProfile.interviewsPracticed || []
      
      const totalQuizzes = quizzes.length
      const avgScore = totalQuizzes > 0
        ? quizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) / totalQuizzes
        : 0
      
      const totalInterviews = interviews.length
      const completedInterviews = interviews.filter(i => i.status === "completed").length
      
      const interviewsWithScores = interviews.filter(i => i.overallScore)
      const avgInterviewScore = interviewsWithScores.length > 0
        ? interviewsWithScores.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviewsWithScores.length
        : 0

      // Calculate improvement trend (comparing first half vs second half of attempts)
      const midpoint = Math.floor(quizzes.length / 2)
      const firstHalf = quizzes.slice(0, midpoint)
      const secondHalf = quizzes.slice(midpoint)
      
      const firstHalfAvg = firstHalf.length > 0
        ? firstHalf.reduce((sum, q) => sum + (q.percentage || 0), 0) / firstHalf.length
        : 0
      const secondHalfAvg = secondHalf.length > 0
        ? secondHalf.reduce((sum, q) => sum + (q.percentage || 0), 0) / secondHalf.length
        : 0
      
      const improvement = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0

      setStats({
        totalQuizzes,
        avgScore: Math.round(avgScore * 10) / 10,
        totalInterviews,
        completedInterviews,
        avgInterviewScore: Math.round(avgInterviewScore * 10) / 10,
        improvement: Math.round(improvement),
      })
    }
  }, [learnerProfile])

  // Performance Trend Chart Data (combined quiz and interview scores over time)
  const performanceTrendData = (() => {
    const quizzes = learnerProfile?.quizAttempts || []
    const interviews = learnerProfile?.interviewsPracticed || []
    
    const allData = [
      ...quizzes.map((q, i) => ({
        index: i,
        date: new Date(q.createdAt || Date.now()),
        quizScore: q.percentage || 0,
        type: 'quiz'
      })),
      ...interviews.filter(i => i.overallScore).map((i, idx) => ({
        index: idx,
        date: new Date(i.completedAt || i.startedAt || Date.now()),
        interviewScore: i.overallScore || 0,
        type: 'interview'
      }))
    ].sort((a, b) => a.date - b.date)

    // Aggregate by week for cleaner visualization
    const weeklyData = {}
    allData.forEach(item => {
      const weekStart = new Date(item.date)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: weekKey, quizScores: [], interviewScores: [] }
      }
      
      if (item.type === 'quiz') {
        weeklyData[weekKey].quizScores.push(item.quizScore)
      } else {
        weeklyData[weekKey].interviewScores.push(item.interviewScore)
      }
    })

    return Object.values(weeklyData).map(week => ({
      name: new Date(week.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      quizAvg: week.quizScores.length > 0 
        ? Math.round(week.quizScores.reduce((a, b) => a + b, 0) / week.quizScores.length) 
        : null,
      interviewAvg: week.interviewScores.length > 0 
        ? Math.round(week.interviewScores.reduce((a, b) => a + b, 0) / week.interviewScores.length) 
        : null,
    })).slice(-8)
  })()

  // Interview Skills Radar Data
  const interviewSkillsData = (() => {
    const interviews = learnerProfile?.interviewsPracticed || []
    const completedWithScores = interviews.filter(i => 
      i.status === 'completed' && (i.technicalScore || i.communicationScore || i.problemSolvingScore)
    )

    if (completedWithScores.length === 0) return []

    const avgTechnical = completedWithScores.reduce((sum, i) => sum + (i.technicalScore || 0), 0) / completedWithScores.length
    const avgCommunication = completedWithScores.reduce((sum, i) => sum + (i.communicationScore || 0), 0) / completedWithScores.length
    const avgProblemSolving = completedWithScores.reduce((sum, i) => sum + (i.problemSolvingScore || 0), 0) / completedWithScores.length

    return [
      { skill: 'Technical', score: Math.round(avgTechnical) },
      { skill: 'Communication', score: Math.round(avgCommunication) },
      { skill: 'Problem Solving', score: Math.round(avgProblemSolving) },
    ]
  })()

  // Quiz Category Distribution
  const quizCategoryData = (() => {
    const quizzes = learnerProfile?.quizAttempts || []
    const categoryMap = {}
    
    quizzes.forEach(quiz => {
      const category = quiz.category || 'Other'
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, totalScore: 0 }
      }
      categoryMap[category].count++
      categoryMap[category].totalScore += quiz.percentage || 0
    })

    return Object.entries(categoryMap).map(([name, data]) => ({
      name,
      value: data.count,
      avgScore: Math.round(data.totalScore / data.count),
    }))
  })()

  // Interview Type Distribution
  const interviewTypeData = (() => {
    const interviews = learnerProfile?.interviewsPracticed || []
    const typeMap = {}
    
    interviews.forEach(interview => {
      const type = interview.interviewType || 'General'
      typeMap[type] = (typeMap[type] || 0) + 1
    })

    return Object.entries(typeMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  })()

  // Score Distribution Data
  const scoreDistributionData = (() => {
    const quizzes = learnerProfile?.quizAttempts || []
    const ranges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    }

    quizzes.forEach(quiz => {
      const score = quiz.percentage || 0
      if (score <= 20) ranges['0-20']++
      else if (score <= 40) ranges['21-40']++
      else if (score <= 60) ranges['41-60']++
      else if (score <= 80) ranges['61-80']++
      else ranges['81-100']++
    })

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }))
  })()

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
            <CardTitle className="text-sm font-medium">Total Quiz Attempts</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {stats.avgScore > 0 ? `${stats.avgScore}%` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {stats.avgInterviewScore > 0 ? `${stats.avgInterviewScore}%` : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
 
 
      {/* Charts */}
      {(stats.totalQuizzes > 0 || stats.totalInterviews > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Trend Over Time */}
          {performanceTrendData.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trend Analysis
                </CardTitle>
                <CardDescription>Weekly average scores across quizzes and interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceTrendData}>
                    <defs>
                      <linearGradient id="colorQuiz" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInterview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
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
                    <Area
                      type="monotone"
                      dataKey="quizAvg"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorQuiz)"
                      name="Quiz Avg %"
                    />
                    <Area
                      type="monotone"
                      dataKey="interviewAvg"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorInterview)"
                      name="Interview Avg %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Interview Skills Radar Chart */}
          {interviewSkillsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Interview Skills Breakdown
                </CardTitle>
                <CardDescription>Average performance across key competencies</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={interviewSkillsData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="skill" className="text-xs" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Quiz Score Distribution */}
          {scoreDistributionData.some(d => d.count > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Quiz Score Distribution
                </CardTitle>
                <CardDescription>How your scores are distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="range" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Quiz Category Performance */}
          {quizCategoryData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance by Category
                </CardTitle>
                <CardDescription>Your quiz attempts and scores by topic</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quizCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Attempts" />
                    <Bar yAxisId="right" dataKey="avgScore" fill="#10b981" radius={[8, 8, 0, 0]} name="Avg Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Interview Type Distribution */}
          {interviewTypeData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interview Type Distribution
                </CardTitle>
                <CardDescription>Breakdown of interview sessions by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={interviewTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {interviewTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
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
              Take a quiz or practice an interview to see your personalized analytics and performance insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
