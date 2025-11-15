// filepath: /Users/krishnagehlot/Desktop/EduNerve_AI_Frontend/src/components/quiz/QuizTaking.jsx
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Button from "../common/Button";

// Sample questions data - you can later fetch this from API
const generateQuizQuestions = (quiz) => {
  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        "To style components",
        "To manage state and side effects in functional components",
        "To create class components",
        "To handle routing",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which of the following is NOT a JavaScript primitive type?",
      options: ["String", "Number", "Array", "Boolean"],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets",
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "In React, what is the virtual DOM?",
      options: [
        "A copy of the browser DOM",
        "A lightweight representation of the actual DOM",
        "A database for storing component state",
        "A routing mechanism",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
      correctAnswer: 2,
    },
  ];

  return questions.slice(0, Math.min(quiz.questions, questions.length));
};

export default function QuizTaking({ quiz, onComplete, onBack }) {
  console.log("QuizTaking received quiz:", quiz);
  console.log("Quiz generatedQuestions:", quiz.generatedQuestions);
  console.log("Is array?", Array.isArray(quiz.generatedQuestions));

  const [questions] = useState(() => {
    // Use AI-generated questions if available, otherwise generate default ones
    if (
      quiz.generatedQuestions &&
      Array.isArray(quiz.generatedQuestions) &&
      quiz.generatedQuestions.length > 0
    ) {
      console.log(
        "✅ Loading AI-generated questions:",
        quiz.generatedQuestions
      );
      return quiz.generatedQuestions.map((q, index) => {
        // Get correct answer index from the answer string
        let correctAnswerIndex = 0;
        if (q.answer && q.options) {
          correctAnswerIndex = q.options.findIndex((opt) => opt === q.answer);
          if (correctAnswerIndex === -1) correctAnswerIndex = 0;
        } else if (q.correctAnswer !== undefined) {
          correctAnswerIndex = q.correctAnswer;
        } else if (q.correctAnswerIndex !== undefined) {
          correctAnswerIndex = q.correctAnswerIndex;
        }

        return {
          id: q.id || q._id || index + 1,
          question: q.question || q.questionText || q.text,
          options: q.options || q.choices || q.answers || [],
          correctAnswer: correctAnswerIndex,
        };
      });
    }
    console.log("Using default questions");
    return generateQuizQuestions(quiz);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  console.log("Current questions:", questions);
  console.log("Current question:", currentQuestion);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id],
      correctAnswer: q.correctAnswer,
      isCorrect: selectedAnswers[q.id] === q.correctAnswer,
    }));

    onComplete({
      answers,
      timeElapsed,
      totalQuestions: questions.length,
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quizzes
            </button>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {quiz.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-foreground">
                    {formatTime(timeElapsed)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {answeredCount} of {totalQuestions} answered
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl border border-border bg-card p-8 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected =
                  selectedAnswers[currentQuestion.id] === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 flex-shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-foreground">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-primary"
                      : selectedAnswers[questions[index].id] !== undefined
                      ? "bg-green-500"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {isLastQuestion ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!hasAnsweredCurrent}
                className="disabled:opacity-50"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                className="disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
