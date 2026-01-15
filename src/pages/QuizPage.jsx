import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { content } from "../data/content";
import { useLearner } from "../context/LearnerContext";
import Button from "../components/common/Button";
import { Badge } from "../components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Award,
  Trophy,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const performanceLevels = [
  {
    min: 80,
    label: "Expert",
    tone: "text-emerald-600",
    accent: "bg-emerald-100",
  },
  {
    min: 60,
    label: "Intermediate",
    tone: "text-blue-600",
    accent: "bg-blue-100",
  },
  {
    min: 40,
    label: "Beginner",
    tone: "text-amber-600",
    accent: "bg-amber-100",
  },
  {
    min: 0,
    label: "Needs Improvement",
    tone: "text-rose-600",
    accent: "bg-rose-100",
  },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const { topic } = useParams();
  const { completeQuiz, learnerProfile } = useLearner();

  const topicContent = content[topic];
  const questions = topicContent?.quiz?.questions ?? [];

  const [phase, setPhase] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() =>
    Array(questions.length).fill(null)
  );
  const [result, setResult] = useState(null);

  const attemptsForTopic = useMemo(() => {
    const attempts = learnerProfile?.quizAttempts || [];
    return attempts.filter((attempt) => attempt.category === topic);
  }, [learnerProfile?.quizAttempts, topic]);

  useEffect(() => {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setResult(null);
  }, [topic, questions.length]);

  if (!topicContent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Quiz not found
          </h1>
          <p className="text-muted-foreground mb-8">
            We could not find quiz content for "{topic}". Please choose a
            different topic.
          </p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    if (questions.length === 0) return;
    setPhase("quiz");
  };

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getPerformance = (percentage) => {
    return (
      performanceLevels.find((level) => percentage >= level.min) ||
      performanceLevels[performanceLevels.length - 1]
    );
  };

  const handleSubmit = async () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct ? 1 : 0);
    }, 0);

    const percentage =
      questions.length > 0
        ? Math.round((correctAnswers / questions.length) * 100)
        : 0;
    const performance = getPerformance(percentage);

    const quizResult = {
      correctAnswers,
      totalQuestions: questions.length,
      percentage,
      level: performance.label,
    };

    setResult(quizResult);
    setPhase("result");

    try {
      await completeQuiz({
        topic,
        subtopics: [],
        correctAnswers,
        totalQuestions: questions.length,
        percentage,
        level: performance.label,
      });
    } catch (error) {
      console.error("Failed to record quiz attempt", error);
    }
  };

  const unanswered = answers.some((answer) => answer === null);

  const handleRetake = () => {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setResult(null);
  };

  // Phase: intro
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Quiz Hub
          </Link>

          <div className="bg-white border border-border rounded-2xl p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {topicContent.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {topicContent.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Questions
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {questions.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Previous Attempts
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {attemptsForTopic}
                </span>
              </div>
            </div>

            <Button
              onClick={handleStart}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              {attemptsForTopic > 0 ? "Retake Quiz" : "Start Quiz"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Phase: active
  if (phase === "active") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Quiz Hub
          </Link>

          <div className="bg-white border border-border rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-3">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
                {questions[currentIndex]?.question}
              </h2>

              <div className="space-y-3">
                {questions[currentIndex]?.options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-blue-600 bg-blue-600"
                              : "border-muted-foreground"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-foreground font-medium">
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-6"
              >
                Previous
              </Button>
              {currentIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={unanswered}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {unanswered
                    ? `${answers.filter((a) => a === null).length} Unanswered`
                    : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase: results
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div
              className={`mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full ${
                getPerformance(result.percentage).accent
              }`}
            >
              <Trophy
                className={`w-12 h-12 ${
                  getPerformance(result.percentage).tone
                }`}
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quiz Complete!
            </h1>
            <p
              className={`text-xl font-semibold ${
                getPerformance(result.percentage).tone
              }`}
            >
              {getPerformance(result.percentage).label}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-border">
              <p className="text-2xl font-bold text-foreground">
                {result.score}
              </p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-border">
              <p className="text-2xl font-bold text-foreground">
                {result.percentage}%
              </p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-border">
              <p className="text-2xl font-bold text-foreground">
                {result.total}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground">
              Review Answers
            </h3>
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2 leading-relaxed">
                        {q.question}
                      </p>
                      <div className="space-y-2 text-sm">
                        <p
                          className={
                            userAnswer === q.correctAnswer
                              ? "text-green-700 font-medium"
                              : "text-red-700 font-medium"
                          }
                        >
                          Your answer: {q.options[userAnswer]}
                        </p>
                        {userAnswer !== q.correctAnswer && (
                          <p className="text-green-700 font-medium">
                            Correct answer: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleRetake}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-xl"
            >
              Retake Quiz
            </Button>
            <Button
              onClick={() => navigate("/quizzes")}
              variant="outline"
              className="flex-1 h-11 rounded-xl font-semibold"
            >
              Back to Hub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
