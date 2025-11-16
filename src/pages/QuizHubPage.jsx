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

import Navbar from "../components/layout/Navbar";
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
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizState, setQuizState] = useState("browse"); // browse, taking, results
  const [answers, setAnswers] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  // Fetch all quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getAllQuizzes();
      console.log("Fetched quizzes:", data);

      // Handle different response formats
      let quizzesArray = [];
      if (Array.isArray(data)) {
        quizzesArray = data;
      } else if (data.quizzes && Array.isArray(data.quizzes)) {
        quizzesArray = data.quizzes;
      } else if (data.data && Array.isArray(data.data)) {
        quizzesArray = data.data;
      }

      // Format quizzes for display
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
      // Keep empty array on error
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
      // Refresh the quiz list after deletion
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

      // Create quiz
      const createResponse = await quizAPI.createQuiz(quizData);
      console.log("✅ Create quiz response:", createResponse);

      // Handle different response structures
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

      // Check if we got questions
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

        // Refresh quiz list in background
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
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
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
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <QuizResults
          quiz={activeQuiz}
          answers={answers}
          onBack={handleBackToBrowse}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Assess
              </p>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                Interactive Quizzes
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Challenge yourself with our comprehensive quiz library. Filter
                by subject and difficulty to find the perfect quiz for your
                skill level.
              </p>
            </div>

            {/* AI Quiz Generator Bar */}
            <section className="mb-10 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 p-6 shadow-lg backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    AI Quiz Generator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Generate custom quizzes on any topic using AI
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleGenerateQuiz()
                    }
                    placeholder="E.g., Create a quiz about React hooks, Python basics, Machine Learning..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={isGenerating}
                  />
                  {aiPrompt && !isGenerating && (
                    <button
                      onClick={() => setAiPrompt("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  variant="primary"
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="px-6 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Try:</span>
                {[
                  "JavaScript ES6 features",
                  "Python data structures",
                  "React best practices",
                  "SQL queries basics",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setAiPrompt(suggestion)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:border-primary hover:bg-primary/5 transition-colors"
                    disabled={isGenerating}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-10 rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Subject
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Button
                        key={subject}
                        variant={
                          selectedSubject === subject ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Difficulty
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={
                          selectedDifficulty === difficulty
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredQuizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="group border border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {quiz.subject}
                          </Badge>
                          <Badge
                            className={difficultyStyles[quiz.difficulty] || ""}
                          >
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuiz(quiz.id);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete quiz"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <CardTitle className="text-xl transition-colors group-hover:text-primary">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {quiz.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {quiz.questions} questions
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {quiz.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        {quiz.completions.toLocaleString()} completions
                      </div>
                      <Button
                        className="w-full"
                        variant="primary"
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
