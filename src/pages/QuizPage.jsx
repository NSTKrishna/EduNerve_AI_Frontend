import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import Navbar from "../components/layout/Navbar"
import Button from "../components/common/Button"
import { useLearner } from "../context/LearnerContext"
import { content } from "../data/mockData"

const performanceLevels = [
  { min: 80, label: "Expert", tone: "text-emerald-600", accent: "bg-emerald-100" },
  { min: 60, label: "Intermediate", tone: "text-blue-600", accent: "bg-blue-100" },
  { min: 40, label: "Beginner", tone: "text-amber-600", accent: "bg-amber-100" },
  { min: 0, label: "Needs Improvement", tone: "text-rose-600", accent: "bg-rose-100" },
]

export default function QuizPage() {
  const navigate = useNavigate()
  const { topic } = useParams()
  const { completeQuiz, learnerProfile } = useLearner()

  const topicContent = content[topic]
  const questions = topicContent?.quiz?.questions ?? []

  const [phase, setPhase] = useState("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [result, setResult] = useState(null)

  const attemptsForTopic = useMemo(() => {
    const attempts = learnerProfile?.quizAttempts || []
    return attempts.filter((attempt) => attempt.category === topic)
  }, [learnerProfile?.quizAttempts, topic])

  useEffect(() => {
    setPhase("intro")
    setCurrentIndex(0)
    setAnswers(Array(questions.length).fill(null))
    setResult(null)
  }, [topic, questions.length])

  if (!topicContent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Quiz not found</h1>
          <p className="text-muted-foreground mb-8">
            We could not find quiz content for "{topic}". Please choose a different topic.
          </p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const handleStart = () => {
    if (questions.length === 0) return
    setPhase("quiz")
  }

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const getPerformance = (percentage) => {
    return performanceLevels.find((level) => percentage >= level.min) || performanceLevels[performanceLevels.length - 1]
  }

  const handleSubmit = async () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct ? 1 : 0)
    }, 0)

    const percentage = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0
    const performance = getPerformance(percentage)

    const quizResult = {
      correctAnswers,
      totalQuestions: questions.length,
      percentage,
      level: performance.label,
    }

    setResult(quizResult)
    setPhase("result")

    try {
      await completeQuiz({
        topic,
        subtopics: [],
        correctAnswers,
        totalQuestions: questions.length,
        percentage,
        level: performance.label,
      })
    } catch (error) {
      console.error("Failed to record quiz attempt", error)
    }
  }

  const unanswered = answers.some((answer) => answer === null)

  const handleRetake = () => {
    setPhase("intro")
    setCurrentIndex(0)
    setAnswers(Array(questions.length).fill(null))
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/quizzes" className="text-sm text-primary hover:underline">
          ← Back to quizzes
        </Link>

        <header className="mt-6 mb-10">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Topic</p>
          <h1 className="text-4xl font-bold text-foreground mb-3">{topicContent.quiz.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Answer the following questions to test your understanding of {topic}.
          </p>

          {attemptsForTopic.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Attempts: {attemptsForTopic.length}</span>
              <span>
                Last score: {attemptsForTopic[attemptsForTopic.length - 1].percentage}%
              </span>
            </div>
          )}
        </header>

        {phase === "intro" && (
          <section className="rounded-2xl border border-border bg-card/60 p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Quiz Overview</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• {questions.length} multiple-choice questions</li>
                  <li>• Score report available immediately after submission</li>
                  <li>• Questions are currently hardcoded for rapid prototyping</li>
                </ul>
              </div>
              <div className="flex flex-col justify-between gap-6">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Estimated time</p>
                  <p className="text-2xl font-semibold text-foreground">~{questions.length * 2} minutes</p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleStart}
                  disabled={questions.length === 0}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          </section>
        )}

        {phase === "quiz" && (
          <section className="space-y-8">
            <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  Answered {answers.filter((answer) => answer !== null).length}/{questions.length}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <article className="rounded-2xl border border-border bg-card/80 p-8 shadow">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {questions[currentIndex].question}
              </h2>
              <div className="space-y-4">
                {questions[currentIndex].options.map((option, optionIndex) => {
                  const isSelected = answers[currentIndex] === optionIndex
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(optionIndex)}
                      className={`w-full text-left rounded-xl border px-5 py-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  )
                })}
              </div>
            </article>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
              <Button onClick={handleSubmit} disabled={unanswered} className="disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Quiz
              </Button>
            </div>
          </section>
        )}

        {phase === "result" && result && (
          <section className="rounded-2xl border border-border bg-card/70 p-8 shadow">
            <h2 className="text-3xl font-semibold text-foreground mb-6">Quiz Complete</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-6 text-center">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-4xl font-bold text-foreground">
                  {result.correctAnswers}/{result.totalQuestions}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6 text-center">
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className="text-4xl font-bold text-foreground">{result.percentage}%</p>
              </div>
              <div className={`rounded-xl border border-border ${getPerformance(result.percentage).accent} p-6 text-center`}>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className={`text-2xl font-semibold ${getPerformance(result.percentage).tone}`}>
                  {result.level}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="outline" onClick={() => navigate("/quizzes")}>Back to Quiz Hub</Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRetake}>
                  Retake
                </Button>
                <Button variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}