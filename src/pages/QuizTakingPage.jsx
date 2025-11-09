import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI } from "../lib/api";
import { UseLearner } from "../context/LearnerContext";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Progress from "../components/common/Progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowLeft,
  ArrowRight,
  Flag,
  Eye,
  EyeOff,
} from "lucide-react";

const QuizTakingPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { authUser } = UseLearner();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState("");

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStartTime]);

  // Fetch Quiz
  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quizAPI.getQuizById(quizId);
      if (response.success) {
        setQuiz(response.quiz);
      }
    } catch (err) {
      setError(err.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!confirm("Are you sure you want to submit the quiz?")) return;

    setLoading(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      const answerDetails = quiz.questions.map((q, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correctAnswers++;

        return {
          questionIndex: index,
          question: q.question,
          userAnswer: userAnswer || "Not answered",
          correctAnswer: q.correctAnswer,
          isCorrect,
        };
      });

      // Save quiz result
      const response = await quizAPI.saveQuizResult(
        quizId,
        authUser._id,
        correctAnswers,
        answerDetails
      );

      if (response.success) {
        setShowResults(true);
      }
    } catch (err) {
      setError(err.message || "Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScore = () => {
    let correct = 0;
    quiz?.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const getPercentage = () => {
    const score = getScore();
    return Math.round((score / quiz.questions.length) * 100);
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return { label: "Excellent", color: "text-green-600" };
    if (percentage >= 70) return { label: "Good", color: "text-blue-600" };
    if (percentage >= 50) return { label: "Average", color: "text-yellow-600" };
    return { label: "Needs Improvement", color: "text-red-600" };
  };

  if (loading && !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Quiz not found"}
          </h2>
          <Button
            onClick={() => navigate("/quiz-management")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = getScore();
    const percentage = getPercentage();
    const performance = getPerformanceLevel(percentage);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Results Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Completed!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {quiz.topic} - {quiz.difficulty}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {score}/{quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Correct Answers
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Score Percentage
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                <div className={`text-2xl font-bold ${performance.color} mb-2`}>
                  {performance.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Performance
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
              <Clock className="w-5 h-5" />
              <span>Time Taken: {formatTime(timeElapsed)}</span>
            </div>

            <Progress value={percentage} className="mb-4" />
          </div>

          {/* Question Review */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Answer Review
            </h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      isCorrect
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {index + 1}. {question.question}
                        </h3>

                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg ${
                                option === question.correctAnswer
                                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                                  : option === userAnswer && !isCorrect
                                  ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"
                                  : "bg-white dark:bg-gray-700"
                              }`}
                            >
                              <span className="text-gray-900 dark:text-white">
                                {option}
                              </span>
                              {option === question.correctAnswer && (
                                <span className="ml-2 text-green-600 dark:text-green-400 text-sm font-medium">
                                  ✓ Correct
                                </span>
                              )}
                              {option === userAnswer && !isCorrect && (
                                <span className="ml-2 text-red-600 dark:text-red-400 text-sm font-medium">
                                  ✗ Your answer
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>Explanation:</strong>{" "}
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/quiz-management")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Quizzes
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.topic}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {quiz.difficulty} Level
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">
                  {formatTime(timeElapsed)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span>
                {answeredCount} / {quiz.questions.length} answered
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === option
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === option
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {answers[currentQuestion] === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : answers[index]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-5 h-5" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(quiz.questions.length - 1, prev + 1)
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakingPage;
