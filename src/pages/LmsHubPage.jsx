import { useState } from "react"
import { Link } from "react-router-dom"
import { GraduationCap, Clock, TrendingUp, PlayCircle, CheckCircle2, Menu } from "lucide-react"

import Button from "../components/common/Button"
import Badge from "../components/common/Badge"
import Progress from "../components/common/Progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import LearningSidebar from "../components/layout/LearningSidebar"

const enrolledCourses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    instructor: "Sarah Johnson",
    progress: 65,
    totalLessons: 48,
    completedLessons: 31,
    duration: "12 weeks",
    nextLesson: "Building RESTful APIs with Node.js",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    instructor: "Michael Chen",
    progress: 40,
    totalLessons: 32,
    completedLessons: 13,
    duration: "8 weeks",
    nextLesson: "Custom Hooks Deep Dive",
  },
  {
    id: 3,
    title: "System Design Fundamentals",
    instructor: "Emily Rodriguez",
    progress: 85,
    totalLessons: 24,
    completedLessons: 20,
    duration: "6 weeks",
    nextLesson: "Caching Strategies",
  },
]

const recommendedCourses = [
  {
    id: 4,
    title: "TypeScript Mastery",
    instructor: "David Park",
    rating: 4.8,
    students: 12453,
    duration: "10 weeks",
    level: "Intermediate",
  },
  {
    id: 5,
    title: "Cloud Architecture with AWS",
    instructor: "Lisa Anderson",
    rating: 4.9,
    students: 8932,
    duration: "14 weeks",
    level: "Advanced",
  },
  {
    id: 6,
    title: "Database Design & Optimization",
    instructor: "James Wilson",
    rating: 4.7,
    students: 6721,
    duration: "8 weeks",
    level: "Intermediate",
  },
]

export default function LmsHubPage() {
  const [activeTab, setActiveTab] = useState("enrolled")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LearningSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72 flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden inline-flex items-center gap-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
              Menu
            </Button>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Learn</p>
              <h1 className="text-lg font-semibold text-foreground">Learning Hub</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Learn</p>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Learning Management System</h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Track your progress, manage your courses, and discover personalized learning paths tailored to your goals.
              </p>
            </div>

            <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Courses Enrolled</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground mt-1">Active learning paths</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">63%</p>
                  <p className="text-xs text-muted-foreground mt-1">Average completion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">127</p>
                  <p className="text-xs text-muted-foreground mt-1">Hours this month</p>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Your Courses</h2>
                <p className="text-muted-foreground">Switch between active and recommended learning paths.</p>
              </div>
              <div className="inline-flex rounded-lg border border-border bg-card p-1">
                {[{ value: "enrolled", label: "My Courses" }, { value: "recommended", label: "Recommended" }].map(
                  (tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ),
                )}
              </div>
            </section>

            {activeTab === "enrolled" && (
              <section className="space-y-6">
                {enrolledCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="border border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription>Instructor: {course.instructor}</CardDescription>
                        </div>
                        <Badge variant="secondary">{course.duration}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {course.completedLessons} of {course.totalLessons} lessons completed
                          </span>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                        <p>
                          Next lesson: <span className="text-foreground font-medium">{course.nextLesson}</span>
                        </p>
                        <Link to="/learning/continue" className="mt-4 block">
                          <Button className="w-full">
                            <PlayCircle className="mr-2 h-4 w-4" /> Continue Learning
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}

            {activeTab === "recommended" && (
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {recommendedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="border border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">
                          {course.rating} ★
                        </span>
                      </div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {course.students.toLocaleString()} students
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Enroll Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}