import { UseLearner } from "../context/LearnerContext"
import { content } from "../data/mockData"
import { Link, useParams } from "react-router-dom"
import Button from "../components/common/Button"

export default function LearningPage() {
  const { topic } = useParams()
  const { learnerProfile, completeModule } = UseLearner()

  if (topic) {
    const topicContent = content[topic]
    if (!topicContent) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Topic not found</h1>
            <Link to="/learning">
              <Button>Back to Learning</Button>
            </Link>
          </div>
        </div>
      )
    }

    const handleCompleteModule = (moduleId) => {
      completeModule(topic, moduleId)
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/learning" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Learning
          </Link>

          <div className="bg-card border border-border rounded-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{topicContent.lms.title}</h1>
            <p className="text-muted-foreground">{topicContent.lms.description}</p>
          </div>

          <div className="space-y-4">
            {topicContent.lms.modules.map((module) => {
              const isCompleted = learnerProfile?.completedModules?.some(
                (cm) => cm.topic === topic && cm.moduleId === module.id,
              )

              return (
                <div
                  key={module.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-2xl ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                          {isCompleted ? "✓" : "○"}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                      </div>
                      <p className="text-muted-foreground ml-11">{module.duration}</p>
                    </div>
                    {!isCompleted && (
                      <Button size="sm" onClick={() => handleCompleteModule(module.id)}>
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const weakTopics = learnerProfile?.weakTopics || []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Hub</h1>
          <p className="text-muted-foreground">Master your weak topics with structured courses</p>
        </div>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weakTopics.map((topic) => {
              const topicContent = content[topic]
              if (!topicContent) return null

              const completedModules = learnerProfile?.completedModules?.filter((cm) => cm.topic === topic).length || 0
              const totalModules = topicContent.lms.modules.length
              const progress = (completedModules / totalModules) * 100

              return (
                <Link
                  key={topic}
                  to={`/learning/${topic}`}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{topicContent.lms.title}</h3>
                      <p className="text-sm text-muted-foreground">{topicContent.lms.description}</p>
                    </div>
                    <span className="text-2xl">📚</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {completedModules}/{totalModules} modules
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No learning topics available</p>
          </div>
        )}
      </div>
    </div>
  )
}
