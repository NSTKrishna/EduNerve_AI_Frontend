// filepath: src/components/quiz/QuizTaking.jsx
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Button from "../common/Button";

// 🔥 SAFELY NORMALIZE ANY QUESTION SHAPE
function normalizeQuestions(rawQuestions, quiz) {
  if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
    console.warn("⚠ No valid generatedQuestions. Using fallback questions.");
    return generateFallbackQuestions(quiz);
  }

  return rawQuestions.map((q, index) => {
    const id = q.id || q._id || index + 1;

    const questionText =
      q.question ||
      q.questionText ||
      q.text ||
      `Question ${index + 1}`;

    const options =
      q.options ||
      q.choices ||
      q.answers ||
      ["Option 1", "Option 2", "Option 3", "Option 4"];

    let correctAnswerIndex = 0;

    // If backend returned "answer": "Correct Option"
    if (q.answer && Array.isArray(options)) {
      const idx = options.findIndex((opt) => opt === q.answer);
      correctAnswerIndex = idx !== -1 ? idx : 0;
    }

    // If backend returned numeric correct index
    if (typeof q.correctAnswerIndex === "number") {
      correctAnswerIndex = q.correctAnswerIndex;
    }

    if (typeof q.correctAnswer === "number") {
      correctAnswerIndex = q.correctAnswer;
    }

    return {
      id,
      question: questionText,
      options,
      correctAnswer: correctAnswerIndex,
    };
  });
}

// 🔥 Fallback (if no AI questions)
function generateFallbackQuestions(quiz) {
  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        "To style components",
        "To manage state and side effects",
        "To create class components",
        "To handle routing",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which of the following is NOT a JS primitive?",
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
  ];

  return questions.slice(0, Math.min(quiz.questions, questions.length));
}

export default function QuizTaking({ quiz, onComplete, onBack }) {
  // Normalize questions safely
  const [questions] = useState(() => {
    if (quiz.generatedQuestions?.length > 0) {
      return normalizeQuestions(quiz.generatedQuestions, quiz);
    }
    return generateFallbackQuestions(quiz);
  });

  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);

  const totalQuestions = questions.length;
  const q = questions[current];
  const progress = ((current + 1) / totalQuestions) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  const handleSelect = (index) => {
    setSelectedAnswers({ ...selectedAnswers, [q.id]: index });
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
      totalQuestions,
      timeElapsed,
    });
  };

  const isLast = current === totalQuestions - 1;
  const answeredCurrent = selectedAnswers[q.id] !== undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Quizzes
          </button>

          {/* Header */}
          <div className="border border-border bg-card p-6 rounded-xl mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {quiz.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {current + 1} of {totalQuestions}
                </p>
              </div>

              <div className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-foreground">{formatTime(timeElapsed)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full">
              <div
                className="h-2 bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>
                {Object.keys(selectedAnswers).length} of {totalQuestions} answered
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="border border-border bg-card p-8 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-6">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isSelected = selectedAnswers[q.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${
                          isSelected ? "bg-primary border-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <span className="text-foreground">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => current > 0 && setCurrent(current - 1)}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>

            <Button
              variant="primary"
              disabled={!answeredCurrent}
              onClick={() =>
                isLast ? handleSubmit() : setCurrent(current + 1)
              }
            >
              {isLast ? "Submit Quiz" : "Next"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
