import { UseLearner } from "../../context/LearnerContext"

export default function StatsOverview() {
  const { learnerProfile } = UseLearner()

  const stats = [
    {
      label: "Quizzes Taken",
      value: learnerProfile?.quizAttempts?.length || 0,
      icon: "📝",
    },
    {
      label: "Interviews Practiced",
      value: learnerProfile?.interviewsPracticed?.length || 0,
      icon: "🎤",
    },
    {
      label: "Modules Completed",
      value: learnerProfile?.completedModules?.length || 0,
      icon: "✅",
    },
    {
      label: "Average Quiz Score",
      value: learnerProfile?.quizAttempts?.length
        ? Math.round(
            learnerProfile.quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / learnerProfile.quizAttempts.length,
          ) + "%"
        : "N/A",
      icon: "📊",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
