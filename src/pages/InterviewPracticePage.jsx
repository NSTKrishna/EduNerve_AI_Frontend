import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { UseLearner } from "../context/LearnerContext"
import { content } from "../data/mockData"
import Button from "../components/common/Button"

export default function InterviewPracticePage() {
  const { topic } = useParams()
  const navigate = useNavigate()
  const { practiceInterview } = UseLearner()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState({})
  const [showComplete, setShowComplete] = useState(false)

  const topicContent = content[topic]

  if (!topicContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Interview prep not found</h1>
          <Link to="/interviews">
            <Button>Back to Interviews</Button>
          </Link>
        </div>
      </div>
    )
  }

  const interview = topicContent.interview
  const questions = interview.questions

  const handleResponse = (questionIndex, response) => {
    setResponses({ ...responses, [questionIndex]: response })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    practiceInterview(topic, responses)
    setShowComplete(true)
  }

  if (showComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Practice Complete!</h1>
            <p className="text-muted-foreground mb-8">Great job practicing {questions.length} interview questions!</p>

            <div className="bg-muted rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">Tips for your next interview:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Practice explaining your thought process clearly</li>
                <li>• Use specific examples from your experience</li>
                <li>• Ask clarifying questions when needed</li>
                <li>• Stay calm and take your time to think</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/interviews")}>Back to Interviews</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Practice Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/interviews" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Interviews
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎤</span>
              <h2 className="text-2xl font-semibold text-foreground">{question}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Take your time to think through your answer. Practice explaining your thought process clearly.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">Your Response</label>
            <textarea
              value={responses[currentQuestion] || ""}
              onChange={(e) => handleResponse(currentQuestion, e.target.value)}
              placeholder="Type your answer here..."
              rows={8}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!responses[currentQuestion]?.trim()}>
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
