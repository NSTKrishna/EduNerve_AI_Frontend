import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UseLearner } from "../context/LearnerContext";
import { quizAPI } from "../lib/api";

function QuizTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { quiz: passedQuiz, questions: passedQuestions } = location.state || {};
  const { refreshProfile } = UseLearner();

  const [quiz, setQuiz] = useState(passedQuiz || null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  // Fetch quiz data from backend if not passed via state
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        // If quiz data was passed via navigation state, use it
        if (passedQuestions && Array.isArray(passedQuestions)) {
          console.log(
            "📝 Loaded",
            passedQuestions.length,
            "questions from navigation state"
          );
          setQuestions(passedQuestions);
          setTimeLeft(passedQuestions.length * 60); // 1 minute per question
          setLoading(false);
          return;
        }

        // If quiz ID is in params, fetch from backend
        const quizId = params.quizId || passedQuiz?.id;
        if (quizId) {
          console.log("🔍 Fetching quiz from backend:", quizId);

          const response = await quizAPI.getQuizSetById(quizId);
          console.log("📚 Fetched quiz data:", response);

          const fetchedQuiz = response.quizSet || response.data || response;
          const fetchedQuestions = fetchedQuiz.questions || [];

          if (fetchedQuestions.length > 0) {
            setQuiz(fetchedQuiz);
            setQuestions(fetchedQuestions);
            setTimeLeft(fetchedQuestions.length * 60);
            console.log(
              "✅ Loaded",
              fetchedQuestions.length,
              "questions from backend"
            );
          } else {
            throw new Error("No questions found in quiz");
          }
        } else {
          throw new Error("No quiz ID or data provided");
        }
      } catch (error) {
        console.error("❌ Failed to load quiz:", error);
        alert(
          "Failed to load quiz from database. Please check backend connection."
        );
        navigate("/quiz-management");
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [passedQuestions, passedQuiz, params.quizId, navigate]);

  const handleSubmit = useCallback(async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

    let correctCount = 0;
    const answersArray = [];

    questions.forEach((q, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) correctCount++;

      answersArray.push({
        questionId: q.id || index,
        question: q.question,
        userAnswer: userAnswer || null,
        correctAnswer: q.answer,
        isCorrect,
      });
    });

    setScore(correctCount);
    const percentage = (correctCount / questions.length) * 100;

    // Save result to backend
    try {
      console.log("💾 Saving quiz result to backend...");

      const resultData = {
        quizSetId: quiz?.id,
        score: correctCount,
        totalQuestions: questions.length,
        percentage: parseFloat(percentage.toFixed(2)),
        timeTaken,
        answers: answersArray,
      };

      const response = await quizAPI.saveQuizResult(resultData);
      console.log("✅ Result saved to backend:", response);

      if (response.success) {
        await refreshProfile();
      }
    } catch (error) {
      console.error("❌ Failed to save result to backend:", error);
      // Continue anyway - user can still see results
    }

    setShowResult(true);
  }, [questions, selectedAnswers, quiz, startTime, refreshProfile]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, handleSubmit]);

  // Timer format utility (currently unused but available if needed)
  const _formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const getPerformanceLevel = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80)
      return { level: "Expert", color: "#10b981", emoji: "🏆" };
    if (percentage >= 60)
      return { level: "Intermediate", color: "#3b82f6", emoji: "👍" };
    if (percentage >= 40)
      return { level: "Beginner", color: "#f59e0b", emoji: "📚" };
    return { level: "Needs Improvement", color: "#ef4444", emoji: "💪" };
  };

  // Loading state
  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Loading quiz...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your quiz
          </p>
        </div>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const performance = getPerformanceLevel();
    const percentage = ((score / questions.length) * 100).toFixed(1);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-6">{performance.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Great job on completing the quiz!
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 mb-8">
            <div className="flex justify-center items-center gap-12 mb-6">
              <div>
                <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                  {score}/{questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Score
                </div>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Accuracy
                </div>
              </div>
            </div>

            <div
              className="inline-block px-8 py-3 rounded-full text-white text-xl font-bold mb-4"
              style={{ backgroundColor: performance.color }}
            >
              {performance.level}
            </div>
          </div>

          <div className="text-left bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg mb-8 space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Topic:</strong> {quiz?.title || quiz?.topic || "Quiz"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Difficulty:</strong>{" "}
              <span className="capitalize">{quiz?.difficulty || "Medium"}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Total Questions:</strong> {questions.length}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Correct Answers:</strong> {score}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/quiz-management")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Quizzes
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              TOPIC
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {quiz?.title || quiz?.topic || "Quiz"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Answer the following questions to test your understanding of{" "}
              {quiz?.topic || "this topic"}.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Answered {Object.keys(selectedAnswers).length}/
                {questions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === option
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === option
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-400 dark:border-gray-500"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
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

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-all ${
              currentQuestion === 0
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          <button
            onClick={
              currentQuestion === questions.length - 1 ? null : handleNext
            }
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            {currentQuestion === questions.length - 1 ? "Review" : "Next"}
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizTest;
