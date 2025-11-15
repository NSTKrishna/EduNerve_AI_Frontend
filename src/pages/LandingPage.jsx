import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLearner } from "../context/LearnerContext"
import Button from "../components/common/Button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card"
import { ArrowRight, BookOpen, MessageSquare, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, learnerProfile, authUser, logout } = useLearner()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate("/")
  }

  const userAvatar = authUser?.picture || learnerProfile?.avatar
  const userName = learnerProfile?.name || authUser?.name || "User"
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen flex flex-col">

      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">EduNerve AI</Link>
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost">Log in</Button>
                <Button onClick={() => navigate('/signup')}>Get started</Button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <span className="text-sm text-muted-foreground hidden sm:block">{userName}</span>
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full border-2 border-primary object-cover cursor-pointer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold cursor-pointer">
                      {userInitials}
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{learnerProfile?.email || authUser?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        navigate("/dashboard")
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div> 
      </header>     
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Master your skills with{" "}
              <span className="text-primary">intelligent learning</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive platform for quizzes, interview preparation, and
              structured learning paths. Everything you need to succeed in one
              place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/quizzes')}
              >
                Try a Quiz
              </Button>
            </div>
          </div> 
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Interactive Quizzes</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Test your knowledge with adaptive quizzes across multiple
                  subjects and difficulty levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Multiple subjects available
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Adaptive difficulty levels
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Instant feedback & scoring
                  </li>
                </ul>
                <Button
                  // variant="ghost"
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => navigate(isAuthenticated ? '/quizzes' : '/signup')}
                >
                  {isAuthenticated ? 'Start Quiz' : 'View More'}
                  {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Interview Preparation
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Ace your interviews with comprehensive prep materials and mock
                  interview sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Technical & behavioral questions
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    AI-powered mock interviews
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Expert feedback & tips
                  </li>
                </ul>
                <Button
                  // variant="ghost"
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => navigate(isAuthenticated ? '/interviews' : '/signup')}
                >
                  {isAuthenticated ? 'Start Interview' : 'View More'}
                  {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card px-6 py-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduNerve AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
