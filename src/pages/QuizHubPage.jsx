// src/pages/QuizHubPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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

// These components must exist in your project
import QuizTaking from "../components/quiz/QuizTaking";
import QuizResults from "../components/quiz/QuizResults";

/**
 * quizAPI is a placeholder object that should implement:
 * - getAllQuizzes()
 * - getQuizById(id)
 * - createQuiz(payload)
 * - deleteQuiz(id)
 *
 * Replace this import with your real API client.
 */
// import quizAPI from "../lib/quizAPI";
const quizAPI = {
  // Example mock implementations - replace with real API calls
  async getAllQuizzes() {
    return []; // return array or { quizzes: [...] } or { data: [...] }
  },
  async getQuizById(id) {
    return null;
  },
  async createQuiz(payload) {
    // should return either created quiz object or { id } or { quiz: {...} }
    return null;
  },
  async deleteQuiz(id) {
    return true;
  },
};

const quizzesData = [
  // Optional initial fallback data if you want local seed
  // leave empty or add sample quizzes
];

const subjects = ["All", "Programming", "Computer Science", "System Design", "Database"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyStyles = {
  Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function QuizHubPage() {
  // Page state
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Quiz flow
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizState, setQuizState] = useState("browse"); // 'browse' | 'taking' | 'results'
  const [answers, setAnswers] = useState([]);

  // AI generator + loading
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Quizzes list
  const [quizzes, setQuizzes] = useState(quizzesData);

  // Fetch quizzes on mount
  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getAllQuizzes();
      // Normalize response to an array
      let quizzesArray = [];
      if (Array.isArray(data)) quizzesArray = data;
      else if (Array.isArray(data.quizzes)) quizzesArray = data.quizzes;
      else if (Array.isArray(data.data)) quizzesArray = data.data;
      else if (data && data.quiz) quizzesArray = [data.quiz];
      else quizzesArray = [];

      const formatted = quizzesArray.map((q) => ({
        id: q.id || q._id || String(q.quizId || Math.random()),
        title: q.title || q.topic || "Quiz",
        description: q.description || q.summary || "Test your knowledge",
        subject: q.subject || q.category || "General",
        difficulty: q.difficulty || "Intermediate",
        questions: Array.isArray(q.questions) ? q.questions.length : q.questionCount || 0,
        duration:
          q.duration ||
          `${(Array.isArray(q.questions) ? q.questions.length : q.questionCount || 10) * 2} min`,
        completions: q.completions || 0,
        generatedQuestions: q.questions || [],
        raw: q,
      }));

      setQuizzes(formatted);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setQuizzes([]); // fallback to empty
    }
  };

  // Filtered view
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const subjectMatch = selectedSubject === "All" || quiz.subject === selectedSubject;
      const difficultyMatch = selectedDifficulty === "All" || quiz.difficulty === selectedDifficulty;
      return subjectMatch && difficultyMatch;
    });
  }, [selectedSubject, selectedDifficulty, quizzes]);

  // Start taking a quiz
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizState("taking");
    setAnswers([]);
  };

  // Called when the taking component finishes
  const handleQuizComplete = (userAnswers) => {
    setAnswers(userAnswers);
    setQuizState("results");
  };

  // Back to browse
  const handleBackToBrowse = () => {
    setActiveQuiz(null);
    setQuizState("browse");
    setAnswers([]);
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    const confirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return;

    try {
      await quizAPI.deleteQuiz(quizId);
      // Client-side remove immediately for snappy UX
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      // Optionally re-fetch to sync
      // await fetchQuizzes();
      alert("Quiz deleted successfully.");
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  // AI generate quiz flow
  const handleGenerateQuiz = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    try {
      // Call backend create endpoint (expected variable shapes handled)
      const payload = {
        prompt: aiPrompt,
        difficulty: selectedDifficulty !== "All" ? selectedDifficulty : "Intermediate",
        questionCount: 10,
      };
      const res = await quizAPI.createQuiz(payload);

      // Normalize: res might be quiz obj, or { quiz }, or { id }, etc.
      let quizData = null;
      if (!res) quizData = null;
      else if (res.quiz) quizData = res.quiz;
      else if (res.data?.quiz) quizData = res.data.quiz;
      else if (res.data && Array.isArray(res.data.questions) === false && (res.data.title || res.data.questions)) quizData = res.data;
      else if (res.id || res._id || res.quizId) quizData = res;
      else if (Array.isArray(res.questions) || res.title) quizData = res;

      // If response contains questions directly, use them
      if (quizData && Array.isArray(quizData.questions) && quizData.questions.length > 0) {
        const created = {
          id: quizData.id || quizData._id || Date.now(),
          title: quizData.title || aiPrompt || "AI Generated Quiz",
          description: quizData.description || aiPrompt,
          subject: quizData.subject || "AI Generated",
          difficulty: quizData.difficulty || (selectedDifficulty !== "All" ? selectedDifficulty : "Intermediate"),
          questions: quizData.questions.length,
          duration: quizData.duration || `${quizData.questions.length * 2} min`,
          completions: quizData.completions || 0,
          aiGenerated: true,
          generatedQuestions: quizData.questions,
        };

        // Add to list and open it
        setQuizzes((prev) => [created, ...prev]);
        setActiveQuiz(created);
        setQuizState("taking");
        setAiPrompt("");
        return;
      }

      // If API returned an id, fetch details
      const quizId = res?.id || res?._id || res?.quizId;
      if (quizId) {
        const quizDetails = await quizAPI.getQuizById(quizId);
        let qd = quizDetails;
        if (quizDetails?.data) qd = quizDetails.data;
        const created = {
          id: qd.id || qd._id || quizId,
          title: qd.title || aiPrompt || "AI Generated Quiz",
          description: qd.description || aiPrompt,
          subject: qd.subject || "AI Generated",
          difficulty: qd.difficulty || (selectedDifficulty !== "All" ? selectedDifficulty : "Intermediate"),
          questions: Array.isArray(qd.questions) ? qd.questions.length : qd.questionCount || 10,
          duration: qd.duration || `${(Array.isArray(qd.questions) ? qd.questions.length : qd.questionCount || 10) * 2} min`,
          completions: qd.completions || 0,
          aiGenerated: true,
          generatedQuestions: qd.questions || [],
        };

        setQuizzes((prev) => [created, ...prev]);
        setActiveQuiz(created);
        setQuizState("taking");
        setAiPrompt("");
        return;
      }

      // Otherwise fallback to a small local quiz
      console.warn("Create quiz returned no usable data; using fallback quiz.");
      const fallback = {
        id: Date.now(),
        title: aiPrompt.slice(0, 60) || "AI Generated Quiz",
        description: aiPrompt,
        subject: "AI Generated",
        difficulty: selectedDifficulty !== "All" ? selectedDifficulty : "Intermediate",
        questions: 5,
        duration: "10 min",
        completions: 0,
        aiGenerated: true,
        generatedQuestions: [
          {
            id: "f1",
            question: "Fallback: What is this quiz about?",
            options: ["Option A", "Option B", "Option C"],
            answerIndex: 0,
          },
        ],
      };
      setQuizzes((prev) => [fallback, ...prev]);
      setActiveQuiz(fallback);
      setQuizState("taking");
      setAiPrompt("");
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // When taking "taking" or "results", render those pages (Option A)
  if (quizState === "taking" && activeQuiz) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="px-4 py-10 sm:px-8 lg:px-12">
          <QuizTaking quiz={activeQuiz} onComplete={handleQuizComplete} onBack={handleBackToBrowse} />
        </div>
      </div>
    );
  }

  if (quizState === "results" && activeQuiz) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="px-4 py-10 sm:px-8 lg:px-12">
          <QuizResults quiz={activeQuiz} answers={answers} onBack={handleBackToBrowse} />
        </div>
      </div>
    );
  }

  // Browser view
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Assess</p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Interactive Quizzes</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Challenge yourself with our comprehensive quiz library. Filter by subject and difficulty to find the perfect quiz for your skill level.
            </p>
          </div>

          {/* AI Quiz Generator Bar */}
          <section className="mb-10 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 p-6 shadow-lg backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">AI Quiz Generator</h2>
                <p className="text-xs text-muted-foreground">Generate custom quizzes on any topic using AI</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerateQuiz()}
                  placeholder="E.g., Create a quiz about React hooks, Python basics, Machine Learning..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isGenerating}
                />
                {aiPrompt && !isGenerating && (
                  <button onClick={() => setAiPrompt("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    ✕
                  </button>
                )}
              </div>

              <Button variant="primary" onClick={handleGenerateQuiz} disabled={isGenerating || !aiPrompt.trim()} className="px-6 disabled:opacity-50">
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
              {["JavaScript ES6 features", "Python data structures", "React best practices", "SQL queries basics"].map((s) => (
                <button
                  key={s}
                  onClick={() => setAiPrompt(s)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:border-primary hover:bg-primary/5 transition-colors"
                  disabled={isGenerating}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Filters */}
          <section className="mb-10 rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Button key={subject} variant={selectedSubject === subject ? "primary" : "outline"} size="sm" onClick={() => setSelectedSubject(subject)}>
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <Button key={difficulty} variant={selectedDifficulty === difficulty ? "primary" : "outline"} size="sm" onClick={() => setSelectedDifficulty(difficulty)}>
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Quiz Cards */}
          <section>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="group border border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {quiz.subject}
                        </Badge>
                        <Badge className={difficultyStyles[quiz.difficulty] || ""}>{quiz.difficulty}</Badge>
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

                    <CardTitle className="text-xl transition-colors group-hover:text-primary">{quiz.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{quiz.description}</CardDescription>
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
                      {Number(quiz.completions || 0).toLocaleString()} completions
                    </div>

                    <Button className="w-full" variant="primary" onClick={() => handleStartQuiz(quiz)}>
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredQuizzes.length === 0 && (
              <div className="mt-10 rounded-xl border border-dashed border-border bg-card/40 py-12 text-center">
                <p className="text-muted-foreground">No quizzes found matching your filters.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
