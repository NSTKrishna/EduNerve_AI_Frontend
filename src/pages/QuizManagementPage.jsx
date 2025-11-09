import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { quizAPI } from "../lib/api";
import { UseLearner } from "../context/LearnerContext";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Play,
  Clock,
  Award,
  Brain,
  TrendingUp,
  Eye,
} from "lucide-react";

const QuizManagementPage = () => {
  const navigate = useNavigate();
  const { authUser } = UseLearner();
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Debug: Log quizzes state whenever it changes
  useEffect(() => {
    console.log("🎯 Current quizzes state:", quizzes);
    console.log("🎯 Number of quizzes:", quizzes.length);
  }, [quizzes]);

  // Create Quiz Form State
  const [quizForm, setQuizForm] = useState({
    topic: "",
    difficulty: "medium",
    numberOfQuestions: 10,
  });

  // Fetch all quizzes and results on mount
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quizAPI.getAllQuizSets();
      console.log("📚 Fetched quiz sets from backend:", response);

      // Handle different response formats
      let backendQuizzes = [];

      if (response.quizSets) {
        backendQuizzes = response.quizSets;
      } else if (response.success && response.data) {
        backendQuizzes = response.data;
      } else if (Array.isArray(response)) {
        backendQuizzes = response;
      }

      console.log("📚 Backend quiz sets:", backendQuizzes.length);
      setQuizzes(backendQuizzes);
    } catch (err) {
      console.error("❌ Failed to fetch quizzes:", err);

      // Check if it's a 404 error (endpoint not found)
      if (err.message.includes("404") || err.message.includes("not found")) {
        setError(
          "⚠️ Backend quiz endpoints not implemented yet. " +
            "Please check BACKEND_ROUTES_IMPLEMENTATION.md for setup instructions."
        );
      } else if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Cannot connect")
      ) {
        setError(
          "❌ Cannot connect to backend server. " +
            "Please ensure the backend is running on http://localhost:3000"
        );
      } else {
        setError(err.message || "Failed to fetch quizzes from database");
      }

      setQuizzes([]); // Clear quizzes on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quizAPI.getQuizResults(authUser?._id);
      if (response.success) {
        setResults(response.results || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }, [authUser?._id]);

  useEffect(() => {
    if (activeTab === "saved") {
      fetchQuizzes();
    } else if (activeTab === "results") {
      fetchResults();
    }
  }, [activeTab, fetchQuizzes, fetchResults]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🎯 STEP 1: Generating quiz questions...", {
        topic: quizForm.topic,
        difficulty: quizForm.difficulty,
        numberOfQuestions: quizForm.numberOfQuestions,
      });

      // STEP 1: Generate quiz questions (doesn't save to DB yet)
      const generateResponse = await quizAPI.generateQuiz(
        quizForm.topic,
        quizForm.difficulty,
        quizForm.numberOfQuestions
      );

      console.log("📋 Generated questions response:", generateResponse);
      console.log(
        "📋 Full response:",
        JSON.stringify(generateResponse, null, 2)
      );

      // Check if generation was successful
      if (!generateResponse || !generateResponse.success) {
        const errorMsg =
          generateResponse?.message ||
          "Quiz generation failed. Please try again.";
        setError(errorMsg);
        console.error("❌ Generation failed:", errorMsg);
        return; // STOP HERE
      }

      // Extract questions from response
      const generatedQuestions =
        generateResponse.questions ||
        generateResponse.data?.questions ||
        generateResponse.quiz?.questions ||
        generateResponse.quiz ||
        [];

      console.log("� Extracted questions:", generatedQuestions);
      console.log(
        "� Number of questions:",
        Array.isArray(generatedQuestions)
          ? generatedQuestions.length
          : "Not an array"
      );

      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length === 0
      ) {
        setError("No questions were generated. Please try again.");
        console.error("❌ No valid questions found");
        return;
      }

      // SUCCESS! Create ONE quiz with all questions
      const quizData = {
        id: `quiz_${Date.now()}`,
        title: quizForm.topic || "AI Generated Quiz",
        topic: quizForm.topic,
        difficulty: quizForm.difficulty,
        questions: generatedQuestions,
        numberOfQuestions: generatedQuestions.length,
        createdAt: new Date().toISOString(),
      };

      console.log(
        `✅ Created ONE quiz with ${generatedQuestions.length} questions`
      );

      // Save to backend database
      try {
        const saveResponse = await quizAPI.saveQuizSet(quizData);
        console.log("💾 Saved to backend:", saveResponse);

        // Get the quiz ID from backend response
        let savedQuizId = quizData.id;
        if (saveResponse.quizSet) {
          savedQuizId = saveResponse.quizSet.id;
          quizData.id = savedQuizId;
        } else if (saveResponse.data) {
          savedQuizId = saveResponse.data.id;
          quizData.id = savedQuizId;
        }

        setSuccess(
          `Quiz saved to database! ${generatedQuestions.length} questions ready.`
        );

        // Refresh the quiz list from backend
        await fetchQuizzes();

        // Switch to saved quizzes tab to show the new quiz
        setActiveTab("saved");

        // Reset form
        setQuizForm({
          topic: "",
          difficulty: "medium",
          numberOfQuestions: 10,
        });
      } catch (saveError) {
        console.error("❌ Failed to save quiz to backend:", saveError);

        // Show specific error message
        if (
          saveError.message.includes("404") ||
          saveError.message.includes("not found")
        ) {
          setError(
            "⚠️ Backend save endpoint not implemented. " +
              "Quiz generated but not saved. Please check BACKEND_ROUTES_IMPLEMENTATION.md"
          );
        } else {
          setError(
            `Quiz generated but failed to save to database: ${saveError.message}. ` +
              "Please check backend connection."
          );
        }
      }
    } catch (err) {
      // Enhanced error messages for common issues
      let errorMessage = err.message || "Failed to generate quiz";

      if (
        errorMessage.includes("non-JSON response") ||
        errorMessage.includes("Empty response") ||
        errorMessage.includes("Invalid JSON")
      ) {
        errorMessage =
          `❌ Backend Error: ${errorMessage}\n\n` +
          `📚 This usually means:\n` +
          `1. The /api/quiz/generate endpoint is not properly implemented\n` +
          `2. The endpoint is not returning valid JSON\n` +
          `3. The backend crashed while processing the request\n\n` +
          `Please check:\n` +
          `- Backend server logs for errors\n` +
          `- BACKEND_ROUTES_IMPLEMENTATION.md for correct implementation\n` +
          `- Make sure the endpoint returns: { success: true, questions: [...] }`;
      } else if (errorMessage.includes("Cannot connect to server")) {
        errorMessage =
          `🔌 Backend Not Running!\n\n` +
          `The backend server at http://localhost:3000 is not responding.\n\n` +
          `Please:\n` +
          `1. Start your backend server\n` +
          `2. Make sure it's running on port 3000\n` +
          `3. Check for any startup errors`;
      }

      setError(errorMessage);
      console.error("❌ Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    setLoading(true);
    setError("");
    try {
      // Delete from backend
      const response = await quizAPI.deleteQuizSet(quizId);
      console.log("🗑️ Deleted from backend:", response);

      // Refresh quiz list from backend
      await fetchQuizzes();

      setSuccess("Quiz deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete quiz");
      console.error("❌ Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    // Find the quiz from state
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      console.error("Quiz not found:", quizId);
      return;
    }

    // Navigate to quiz test with quiz data
    navigate("/quiz-test", {
      state: {
        quiz,
        questions: quiz.questions,
      },
    });
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/view`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and track your quiz performance
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("create")}
              className={`${
                activeTab === "create"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              Create Quiz
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`${
                activeTab === "saved"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <BookOpen className="w-4 h-4" />
              Saved Quizzes
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`${
                activeTab === "results"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <TrendingUp className="w-4 h-4" />
              My Results
            </button>
          </nav>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium">{error}</p>
                {(error.includes("not implemented") ||
                  error.includes("404") ||
                  error.includes("not found")) && (
                  <p className="mt-2 text-sm">
                    📚 <strong>Next Steps:</strong> Check{" "}
                    <code className="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded text-xs">
                      BACKEND_ROUTES_IMPLEMENTATION.md
                    </code>{" "}
                    for backend setup instructions.
                  </p>
                )}
                {error.includes("Cannot connect") && (
                  <p className="mt-2 text-sm">
                    💡 <strong>Tip:</strong> Start the backend server with{" "}
                    <code className="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded text-xs">
                      npm run dev
                    </code>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="flex-1">{success}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "create" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Generate AI-Powered Quiz
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create a personalized quiz on any topic
              </p>
            </div>

            <form onSubmit={handleGenerateQuiz} className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Topic *
                </label>
                <input
                  type="text"
                  value={quizForm.topic}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, topic: e.target.value })
                  }
                  placeholder="e.g., JavaScript Fundamentals, React Hooks, Python Data Structures"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Difficulty Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={quizForm.difficulty}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, difficulty: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Questions: {quizForm.numberOfQuestions}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={quizForm.numberOfQuestions}
                  onChange={(e) =>
                    setQuizForm({
                      ...quizForm,
                      numberOfQuestions: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5</span>
                  <span>20</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            {/* Refresh Button */}
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Saved Quizzes
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    console.log("🔍 MANUAL TEST: Calling API directly...");
                    try {
                      const response = await quizAPI.getAllQuizzes();
                      console.log(
                        "🔍 RAW API RESPONSE:",
                        JSON.stringify(response, null, 2)
                      );
                      alert("Check console for raw API response!");
                    } catch (err) {
                      console.error("🔍 API ERROR:", err);
                      alert("Error! Check console: " + err.message);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  🔍 Test API
                </Button>
                <Button
                  onClick={fetchQuizzes}
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No quizzes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first quiz to get started
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Create Quiz
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => {
                  const quizId = quiz._id || quiz.id || index;
                  const quizTopic =
                    quiz.topic || quiz.prompt || quiz.title || "Untitled Quiz";
                  const quizDifficulty = quiz.difficulty || "medium";
                  const questionCount =
                    quiz.questions?.length || quiz.questionCount || 0;
                  const createdDate =
                    quiz.createdAt || quiz.created_at || new Date();

                  return (
                    <div
                      key={quizId}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
                    >
                      {/* Header with gradient background */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                              quizDifficulty === "easy"
                                ? "bg-green-500 text-white"
                                : quizDifficulty === "medium"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {quizDifficulty}
                          </span>
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Brain className="w-4 h-4 text-white" />
                            <span className="text-xs font-medium text-white">
                              {questionCount} Q's
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white truncate">
                          {quizTopic}
                        </h3>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Meta information */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{questionCount} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{questionCount} questions</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Created{" "}
                          {new Date(createdDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleStartQuiz(quizId)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                          >
                            <Play className="w-4 h-4" />
                            Start Quiz
                          </Button>
                          <Button
                            onClick={() => handleViewQuiz(quizId)}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-lg transition-all"
                            title="Preview Questions"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuiz(quizId)}
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2.5 rounded-lg transition-all"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Bottom accent */}
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No results yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete a quiz to see your results here
                </p>
                <Button
                  onClick={() => setActiveTab("saved")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Browse Quizzes
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Quiz Result
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>Score: {result.score}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(
                                result.completedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(
                          (result.score / result.answers?.length) * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagementPage;
