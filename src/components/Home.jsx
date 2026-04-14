import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const handleInterviewClick = () => {
    navigate("/interview");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          AI-Powered Learning
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
          Choose Your Learning Path
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Your AI-powered learning companion for interviews and quizzes
        </p>
      </div>

      {/* Interview Card */}
      <div className="w-full max-w-2xl mx-auto">
        <div
          onClick={handleInterviewClick}
          className="group relative overflow-hidden rounded-3xl bg-white border-2 border-slate-200 hover:border-green-300 p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          {/* Hover Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative space-y-6">
            {/* Icon */}
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>

            {/* Title + Description */}
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Mock Interviews
              </h2>

              <p className="text-slate-600 leading-relaxed">
                Practice with AI interviewers and get real-time feedback on your
                performance.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5" />
                <span>Technical & behavioral questions</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5" />
                <span>Voice interaction support</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5" />
                <span>Personalized feedback</span>
              </li>
            </ul>

            {/* Button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 group-hover:gap-3">
              <span>Start Interview</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
