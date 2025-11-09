import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI } from "../lib/api";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { BookOpen, Play, ArrowLeft, Edit, Trash2 } from "lucide-react";

const QuizViewPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

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

  const handleDeleteQuiz = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    setLoading(true);
    try {
      const response = await quizAPI.deleteQuiz(quizId);
      if (response.success) {
        navigate("/quiz-management");
      }
    } catch (err) {
      setError(err.message || "Failed to delete quiz");
      setLoading(false);
    }
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.topic}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    quiz.difficulty === "easy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : quiz.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {quiz.difficulty}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {quiz.questions.length} questions
                </span>
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Created {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Quiz
            </Button>
            <Button
              onClick={() => navigate("/quiz-management")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleDeleteQuiz}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            Questions Preview
          </h2>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div
                key={index}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {index + 1}. {question.question}
                </h3>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg ${
                        option === question.correctAnswer
                          ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <span className="text-gray-900 dark:text-white">
                        {option}
                      </span>
                      {option === question.correctAnswer && (
                        <span className="ml-2 text-green-600 dark:text-green-400 text-sm font-medium">
                          ✓ Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizViewPage;
