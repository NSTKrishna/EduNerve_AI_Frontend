import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseLearner } from "../context/LearnerContext";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import { CheckCircle2, XCircle, Clock, Award, BookOpen } from "lucide-react";

const Quiz = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { completeQuiz } = UseLearner();

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && !showResults) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_URL}/quiz/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: topic || "General Knowledge",
            numberOfQuestions: 10,
          }),
        });

        const data = await response.json();

        if (data.success && data.questions) {
          setQuestions(data.questions);
        } else {
          console.error("Failed to fetch quiz questions");
          // Fallback to sample questions if API fails
          setQuestions(getSampleQuestions(topic));
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        // Fallback to sample questions
        setQuestions(getSampleQuestions(topic));
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [topic]);

  // Sample questions fallback
  const getSampleQuestions = (topic) => {
    return [
      {
        id: 1,
        question: `What is the fundamental concept of ${
          topic || "programming"
        }?`,
        options: [
          "Understanding syntax and structure",
          "Memorizing all commands",
          "Writing complex code",
          "Using advanced tools only",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: `Which approach is best for learning ${
          topic || "new skills"
        }?`,
        options: [
          "Reading only",
          "Practice and hands-on experience",
          "Watching videos only",
          "Skipping fundamentals",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: `What is an important skill in ${topic || "technology"}?`,
        options: [
          "Problem-solving",
          "Speed typing only",
          "Avoiding documentation",
          "Working in isolation",
        ],
        correctAnswer: 0,
      },
    ];
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeElapsed(0);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return (
        count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      );
    }, 0);

    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const level =
      percentage >= 80
        ? "Expert"
        : percentage >= 60
        ? "Intermediate"
        : percentage >= 40
        ? "Beginner"
        : "Needs Improvement";

    // Save quiz result
    try {
      await completeQuiz({
        topic: topic || "General Quiz",
        subtopics: [],
        correctAnswers,
        totalQuestions: questions.length,
        percentage,
        level,
        timeElapsed,
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }

    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeElapsed(0);
    setQuizStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScore = () => {
    return questions.reduce((count, question, index) => {
      return (
        count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  const getPercentage = () => {
    return Math.round((getScore() / questions.length) * 100);
  };

  const getPerformanceLevel = () => {
    const percentage = getPercentage();
    if (percentage >= 80)
      return {
        label: "Expert",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
      };
    if (percentage >= 60)
      return {
        label: "Intermediate",
        color: "text-blue-600",
        bg: "bg-blue-100",
      };
    if (percentage >= 40)
      return { label: "Beginner", color: "text-amber-600", bg: "bg-amber-100" };
    return {
      label: "Needs Improvement",
      color: "text-rose-600",
      bg: "bg-rose-100",
    };
  };

  const allQuestionsAnswered = () =>
    questions.every((_, index) => selectedAnswers[index] !== undefined);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Loading quiz questions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Introduction Screen
  if (!quizStarted && !showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/quizzes")}
            className="text-primary hover:underline mb-6 flex items-center gap-2"
          >
            ← Back to Quiz Hub
          </button>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                {topic ? `${topic} Quiz` : "General Quiz"}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Test your knowledge and track your progress with this
              comprehensive quiz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Questions
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {questions.length}
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Estimated Time
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {questions.length * 2} min
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                <p className="text-3xl font-bold text-foreground">Medium</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-3">
                Quiz Instructions:
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Answer all questions to complete the quiz</li>
                <li>
                  • You can navigate between questions using Next/Previous
                  buttons
                </li>
                <li>• Your progress will be saved automatically</li>
                <li>• Submit the quiz when you're ready to see your results</li>
              </ul>
            </div>

            <Button
              onClick={handleStartQuiz}
              className="w-full py-6 text-lg font-semibold"
              size="lg"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const score = getScore();
    const percentage = getPercentage();
    const performance = getPerformanceLevel();

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Quiz Complete!
              </h1>
              <p className="text-lg text-muted-foreground">
                Great job completing the quiz. Here are your results:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Score</p>
                <p className="text-4xl font-bold text-foreground">
                  {score}/{questions.length}
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Percentage</p>
                <p className="text-4xl font-bold text-foreground">
                  {percentage}%
                </p>
              </div>
              <div
                className={`${performance.bg} border border-border rounded-lg p-6 text-center`}
              >
                <p className="text-sm text-muted-foreground mb-2">Level</p>
                <p className={`text-2xl font-bold ${performance.color}`}>
                  {performance.label}
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Time Taken</p>
                <p className="text-4xl font-bold text-foreground">
                  {formatTime(timeElapsed)}
                </p>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-background border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4 text-lg">
                Question Review
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200"
                          : "bg-rose-50 dark:bg-rose-900/20 border-rose-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">
                            Q{index + 1}: {question.question}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your answer:{" "}
                            <span
                              className={
                                isCorrect ? "text-emerald-600" : "text-rose-600"
                              }
                            >
                              {question.options[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Correct answer:{" "}
                              <span className="text-emerald-600">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleRetakeQuiz}
                className="flex-1"
              >
                Retake Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/quizzes")}
                className="flex-1"
              >
                Back to Quiz Hub
              </Button>
              <Button onClick={() => navigate("/dashboard")} className="flex-1">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Answered: {answeredCount}/{questions.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected =
                selectedAnswers[currentQuestionIndex] === index;
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswerSelect(currentQuestionIndex, index)
                  }
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground shadow-md"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
          <Button
            onClick={handleSubmitQuiz}
            disabled={!allQuestionsAnswered()}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {allQuestionsAnswered()
              ? "Submit Quiz"
              : `Answer ${questions.length - answeredCount} more`}
          </Button>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Question Navigator
          </p>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-10 rounded-md font-medium text-sm transition-all ${
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : selectedAnswers[index] !== undefined
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
