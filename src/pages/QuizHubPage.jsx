import { useMemo, useState, useEffect } from "react";
import { quizAPI } from "../lib/api";
import {
  BookOpen,
  Clock,
  Trophy,
  Filter,
  Sparkles,
  Loader2,
  Send,
  Trash2,
} from "lucide-react";

import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import QuizTaking from "../components/quiz/QuizTaking";
import QuizResults from "../components/quiz/QuizResults";

const subjects = [
  "All",
  "Programming",
  "Computer Science",
  "System Design",
  "Database",
];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyStyles = {
  Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function QuizHubPage() {
  const [selectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizState, setQuizState] = useState("browse");
  const [answers, setAnswers] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getAllQuizzes();
      console.log("Fetched quizzes:", data);

      let quizzesArray = [];
      if (Array.isArray(data)) {
        quizzesArray = data;
      } else if (data.quizzes && Array.isArray(data.quizzes)) {
        quizzesArray = data.quizzes;
      } else if (data.data && Array.isArray(data.data)) {
        quizzesArray = data.data;
      }

      const formattedQuizzes = quizzesArray.map((quiz) => ({
        id: quiz.id || quiz._id,
        title: quiz.title || quiz.topic || "Quiz",
        description: quiz.description || "Test your knowledge",
        subject: quiz.subject || quiz.category || "General",
        difficulty: quiz.difficulty || "Intermediate",
        questions: quiz.questions?.length || quiz.questionCount || 0,
        duration:
          quiz.duration ||
          `${(quiz.questions?.length || quiz.questionCount || 0) * 2} min`,
        completions: quiz.completions || 0,
        generatedQuestions: quiz.questions || [],
      }));

      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);

      setQuizzes([]);
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const subjectMatch =
        selectedSubject === "All" || quiz.subject === selectedSubject;
      const difficultyMatch =
        selectedDifficulty === "All" || quiz.difficulty === selectedDifficulty;
      return subjectMatch && difficultyMatch;
    });
  }, [selectedSubject, selectedDifficulty, quizzes]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizState("taking");
    setAnswers([]);
  };

  const handleQuizComplete = (userAnswers) => {
    setAnswers(userAnswers);
    setQuizState("results");
  };

  const handleBackToBrowse = () => {
    setActiveQuiz(null);
    setQuizState("browse");
    setAnswers([]);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      await quizAPI.deleteQuiz(quizId);

      await fetchQuizzes();
      alert("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const handleGenerateQuiz = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt to generate a quiz");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("🚀 Starting quiz generation with prompt:", aiPrompt);

      const quizData = {
        prompt: aiPrompt,
        difficulty:
          selectedDifficulty === "All" ? "Intermediate" : selectedDifficulty,
        questionCount: 5,
      };

      console.log("📤 Sending to backend:", quizData);

      const createResponse = await quizAPI.createQuiz(quizData);
      console.log("✅ Create quiz response:", createResponse);

      let questions = null;
      let quizInfo = null;

      if (createResponse.quiz) {
        quizInfo = createResponse.quiz;
        questions = createResponse.quiz.questions;
      } else if (createResponse.data?.quiz) {
        quizInfo = createResponse.data.quiz;
        questions = createResponse.data.quiz.questions;
      } else if (createResponse.questions) {
        questions = createResponse.questions;
        quizInfo = createResponse;
      } else if (createResponse.data?.questions) {
        questions = createResponse.data.questions;
        quizInfo = createResponse.data;
      }

      console.log("Extracted questions:", questions);
      console.log("Quiz info:", quizInfo);

      if (questions && Array.isArray(questions) && questions.length > 0) {
        console.log("✅ Found questions, count:", questions.length);
        console.log("Sample question:", questions[0]);

        const customQuiz = {
          id: quizInfo?.id || quizInfo?._id || Date.now().toString(),
          title:
            quizInfo?.title || quizInfo?.topic || aiPrompt.substring(0, 50),
          description:
            quizInfo?.description || `AI-generated quiz about ${aiPrompt}`,
          difficulty: quizInfo?.difficulty || quizData.difficulty,
          subject: quizInfo?.subject || "AI Generated",
          questions: questions.length,
          duration: `${questions.length * 2} min`,
          completions: 0,
          generatedQuestions: questions,
        };

        console.log("📝 Starting quiz with:", customQuiz);

        fetchQuizzes().catch((err) =>
          console.error("Error refreshing quiz list:", err)
        );

        setActiveQuiz(customQuiz);
        setQuizState("taking");
        setAiPrompt("");
      } else {
        console.error("❌ No questions in response");
        console.error("Full response:", createResponse);
        alert(
          "Quiz was created but no questions were returned. Please check the backend response format."
        );
      }
    } catch (error) {
      console.error("❌ Error generating quiz:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      alert(
        `Failed to generate quiz: ${error.message}. Check console for details.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (quizState === "taking" && activeQuiz) {
    return (
      <div className="bg-background text-foreground">
        <QuizTaking
          quiz={activeQuiz}
          onComplete={handleQuizComplete}
          onBack={handleBackToBrowse}
        />
      </div>
    );
  }

  if (quizState === "results" && activeQuiz) {
    return (
      <div className="bg-background text-foreground">
        <QuizResults
          quiz={activeQuiz}
          answers={answers}
          onBack={handleBackToBrowse}
        />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <div className="flex flex-col">
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl">

            <section className="mb-10 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI QUIZ GENERATOR
                  </h2>
                  <p className="text-sm text-blue-100">
                    Generate a custom quiz in seconds
                  </p>
                </div>
              </div>

              <p className="text-white mb-6 text-lg">
                Enter any topic, and let our AI create a personalized quiz to
                test your knowledge.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-white text-sm mb-2 block font-medium">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleGenerateQuiz()
                    }
                    placeholder="e.g. React Hooks, Database Indexing"
                    className="w-full rounded-xl border-0 bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-white text-sm mb-2 block font-medium">
                    Difficulty
                  </label>
                  <select
                    value={
                      selectedDifficulty === "All"
                        ? "Beginner"
                        : selectedDifficulty
                    }
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isGenerating}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-white text-sm mb-2 block font-medium">
                    Questions
                  </label>
                  <select
                    className="w-full rounded-xl border-0 bg-white px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isGenerating}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleGenerateQuiz}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full md:w-auto text-blue-600 hover:bg-blue-50 px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </section>

            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Your Quizzes
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredQuizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="group bg-white border border-border rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <CardHeader className="pb-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <Badge
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyStyles[quiz.difficulty] || ""
                            }`}
                        >
                          {quiz.difficulty}
                        </Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuiz(quiz.id);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete quiz"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <CardTitle className="text-xl font-bold transition-colors group-hover:text-blue-600">
                        {quiz.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {quiz.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4" />
                          Oct {Math.floor(Math.random() * 28) + 1}, 2023
                        </span>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 shadow-md hover:shadow-lg transition-all"
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredQuizzes.length === 0 && (
                <div className="mt-10 rounded-xl border border-dashed border-border bg-card/40 py-12 text-center">
                  <p className="text-muted-foreground">
                    No quizzes found matching your filters.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
