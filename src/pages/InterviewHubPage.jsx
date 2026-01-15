import { useState } from "react";
import {
  MessageSquare,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Menu,
} from "lucide-react";

import LearningSidebar from "../components/layout/LearningSidebar";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";

const technicalQuestions = [
  {
    id: 1,
    question:
      "Explain the difference between var, let, and const in JavaScript",
    difficulty: "Beginner",
    category: "JavaScript",
  },
  {
    id: 2,
    question: "What is the time complexity of common sorting algorithms?",
    difficulty: "Intermediate",
    category: "Algorithms",
  },
  {
    id: 3,
    question: "How does React's virtual DOM work?",
    difficulty: "Intermediate",
    category: "React",
  },
  {
    id: 4,
    question: "Explain database indexing and when to use it",
    difficulty: "Advanced",
    category: "Database",
  },
];

const behavioralQuestions = [
  {
    id: 1,
    question: "Tell me about a time you faced a challenging project deadline",
    category: "Time Management",
  },
  {
    id: 2,
    question:
      "Describe a situation where you had to work with a difficult team member",
    category: "Teamwork",
  },
  {
    id: 3,
    question: "How do you handle constructive criticism?",
    category: "Growth Mindset",
  },
  {
    id: 4,
    question: "Share an example of when you took initiative on a project",
    category: "Leadership",
  },
];

const hrQuestions = [
  {
    id: 1,
    question: "Why do you want to work for our company?",
    category: "Motivation",
  },
  {
    id: 2,
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
  },
  {
    id: 3,
    question: "What are your salary expectations?",
    category: "Compensation",
  },
  {
    id: 4,
    question: "Why are you leaving your current position?",
    category: "Career Change",
  },
];

export default function InterviewHubPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("technical");

  const renderQuestions = (questions, options = {}) => (
    <div className="grid grid-cols-1 gap-5">
      {questions.map((question) => (
        <Card
          key={question.id}
          className="bg-white border border-border rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600"
                  >
                    {question.category}
                  </Badge>
                  {question.difficulty && (
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {question.difficulty}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-relaxed font-semibold">
                  {question.question}
                </CardTitle>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant={options.buttonVariant || "ghost"}
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition-colors"
            >
              {options.buttonLabel || "View Answer & Tips"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-foreground">
      <LearningSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-white/80 backdrop-blur px-4 py-4 shadow-sm lg:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Prepare
            </p>
            <p className="text-base font-semibold">Interview Preparation</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Prepare
              </p>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                Interview Preparation
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Prepare for your next interview with our comprehensive question
                bank and mock interview sessions. Practice makes perfect.
              </p>
            </div>

            <Card className="mb-12 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold">
                      Book a Mock Interview
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      Practice with AI interviewer and get personalized feedback
                      on your performance.
                    </CardDescription>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    "1-on-1 AI sessions",
                    "Instant feedback",
                    "Practice anytime",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Schedule Mock Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Question Bank</h2>
                <p className="text-muted-foreground">
                  Switch between technical, behavioral, and HR prompts.
                </p>
              </div>
              <div className="inline-flex rounded-xl border border-border bg-white p-1.5 shadow-sm">
                {[
                  { value: "technical", label: "Technical" },
                  { value: "behavioral", label: "Behavioral" },
                  { value: "hr", label: "HR" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                      activeTab === tab.value
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </section>

            {activeTab === "technical" && renderQuestions(technicalQuestions)}

            {activeTab === "behavioral" &&
              renderQuestions(behavioralQuestions, {
                buttonLabel: "View Answer Framework",
                buttonVariant: "ghost",
              })}

            {activeTab === "hr" &&
              renderQuestions(hrQuestions, {
                buttonLabel: "View Best Practices",
                buttonVariant: "ghost",
              })}
          </div>
        </main>
      </div>
    </div>
  );
}
