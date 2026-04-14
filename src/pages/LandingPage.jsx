import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import Button from "../components/common/Button";
import { GridBackgroundDemo } from "../components/grid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import {
  ArrowRight,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  BarChart3,
  Clock,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, learnerProfile, authUser, logout } = useLearner();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const userAvatar = authUser?.picture || learnerProfile?.avatar;
  const userName = learnerProfile?.name || authUser?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <GridBackgroundDemo />
      <div className="min-h-screen flex flex-col relative z-10 bg-gradient-to-b from-transparent to-muted/20">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <img src="../public/logo.png" alt="EduNerve AI Logo" className="h-8 w-8" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  EduNerve AI
                </span>
              </Link>

              <div className="flex items-center gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => navigate("/login")}
                      variant="ghost"
                      className="hidden sm:inline-flex"
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => navigate("/signup")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span className="text-sm font-medium text-foreground hidden sm:block">
                        {userName}
                      </span>
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-9 h-9 rounded-full border-2 border-blue-600 object-cover cursor-pointer ring-2 ring-blue-100"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-semibold cursor-pointer ring-2 ring-blue-100">
                          {userInitials}
                        </div>
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-semibold text-foreground">
                            {userName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {learnerProfile?.email || authUser?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/dashboard");
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Ace your next interview with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  AI practice
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Practice mock interviews with AI and get personalized feedback
                to land your dream job.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={() =>
                    navigate(isAuthenticated ? "/dashboard" : "/signup")
                  }
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all group/btn"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-12 w-full max-w-4xl">
                <div className="flex flex-col items-center space-y-2 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                    7+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Job Roles
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                    40+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Technologies
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                    AI
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Powered
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* Features Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                {/* Mock Interviews Card */}
                <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200 cursor-pointer bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <CardHeader className="relative pb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-600/30">
                      <MessageSquare className="h-7 w-7 text-white" />
                    </div>

                    <CardTitle className="text-2xl sm:text-3xl font-bold">
                      Mock Interviews
                    </CardTitle>

                    <CardDescription className="text-base leading-relaxed pt-2">
                      Practice with AI interviewers and get real-time feedback
                      on your performance.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative space-y-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Technical & behavioral
                      </li>

                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Voice interaction
                      </li>

                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Personalized feedback
                      </li>
                    </ul>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-11 font-semibold"
                      onClick={() =>
                        navigate(isAuthenticated ? "/interviews" : "/signup")
                      }
                    >
                      <span className="flex items-center justify-center gap-2 w-full">
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-white transition-colors">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Learning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Adaptive content that matches your skill level and learning
                  pace.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-white transition-colors">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-600/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Detailed analytics to visualize your strengths and areas to
                  improve.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-white transition-colors">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center shadow-lg shadow-pink-600/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Learn Anytime</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Practice 24/7 at your own pace with instant AI feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 sm:p-12 shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
              <div className="relative flex flex-col items-center text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Ready to ace your next interview?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
                  Start practicing today and improve your interview skills.
                </p>
                <Button
                  size="lg"
                  onClick={() =>
                    navigate(isAuthenticated ? "/dashboard" : "/signup")
                  }
                  className="text-blue-600 hover:bg-blue-50 h-12 px-8 text-base font-semibold shadow-xl hover:shadow-2xl transition-all group/btn"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start for Free
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <img src='../public/logo.png' />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  EduNerve AI
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} EduNerve AI. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
