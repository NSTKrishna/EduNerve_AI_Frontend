import { useNavigate } from "react-router-dom";
import { BookOpen, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    navigate("/quiz");
  };

  const handleInterviewClick = () => {
    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Choose Your Learning Path
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
            Your AI-powered learning companion for interviews and quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Quiz Card */}
          <div
            onClick={handleQuizClick}
            className="group relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-300 p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-slate-900">
                  Interactive Quizzes
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Test your knowledge with AI-generated quizzes across multiple
                  subjects and difficulty levels.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Multiple subjects available</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Instant feedback & scoring</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Track your progress</span>
                </li>
              </ul>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group-hover:gap-3">
                <span>Start Quiz</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Interview Card */}
          <div
            onClick={handleInterviewClick}
            className="group relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200 hover:border-green-300 p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-slate-900">
                  Mock Interviews
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Practice with AI interviewers and get real-time feedback on
                  your performance.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>Technical & behavioral questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>Voice interaction support</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>Personalized feedback</span>
                </li>
              </ul>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group-hover:gap-3">
                <span>Start Interview</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
