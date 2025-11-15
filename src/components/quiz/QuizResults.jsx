// filepath: /Users/krishnagehlot/Desktop/EduNerve_AI_Frontend/src/components/quiz/QuizResults.jsx
import {
  ArrowLeft,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Target,
} from "lucide-react";
import Button from "../common/Button";

export default function QuizResults({ quiz, answers, onBack }) {
  const { answers: userAnswers, timeElapsed, totalQuestions } = answers;

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return { text: "Excellent!", color: "text-green-600" };
    if (percentage >= 70) return { text: "Great Job!", color: "text-blue-600" };
    if (percentage >= 50)
      return { text: "Good Effort!", color: "text-yellow-600" };
    return { text: "Keep Practicing!", color: "text-red-600" };
  };

  const performance = getPerformanceLevel(scorePercentage);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </button>

          {/* Results Summary */}
          <div className="rounded-xl border border-border bg-card p-8 mb-8 text-center">
            <div className="mb-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Quiz Completed!
              </h1>
              <p className="text-muted-foreground">{quiz.title}</p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="text-6xl font-bold text-primary">
                {scorePercentage}%
              </div>
            </div>

            <p className={`text-xl font-semibold mb-8 ${performance.color}`}>
              {performance.text}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">Correct</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {correctCount}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-muted-foreground">
                    Incorrect
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {incorrectCount}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Time</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(timeElapsed)}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="rounded-xl border border-border bg-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Breakdown
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-semibold text-foreground">
                    {scorePercentage}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      scorePercentage >= 70
                        ? "bg-green-500"
                        : scorePercentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Questions Answered
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {totalQuestions} / {totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Success Rate
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {correctCount} / {totalQuestions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Review */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Answer Review
            </h2>

            <div className="space-y-4">
              {userAnswers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`rounded-lg border-2 p-4 ${
                    answer.isCorrect
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2">
                        Question {index + 1}
                      </p>
                      <p
                        className={`text-sm ${
                          answer.isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button variant="outline" onClick={onBack}>
              Back to Quizzes
            </Button>
            <Button variant="primary" onClick={onBack}>
              Try Another Quiz
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
