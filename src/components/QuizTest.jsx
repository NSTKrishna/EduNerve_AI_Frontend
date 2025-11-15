import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";

function QuizTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, subtopics } = location.state || {};
  const { refreshProfile } = useLearner();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!category || !subtopics) {
      navigate("/quiz");
      return;
    }
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      const prompt = `${category} - ${subtopics.join(", ")}`;
      
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await fetch(`${API_URL}/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          numberOfQuestions: 10
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
      } else {
        alert("Failed to generate quiz. Please try again.");
        navigate("/quiz");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("Error generating quiz. Please try again.");
      navigate("/quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {

    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    
    try {
      const percentage = (correctCount / questions.length) * 100;
      let level = "Beginner";
      if (percentage >= 80) level = "Expert";
      else if (percentage >= 60) level = "Intermediate";
      else if (percentage >= 40) level = "Beginner";
      else level = "Needs Improvement";

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`${API_URL}/quiz/result`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          subtopics,
          score: correctCount,
          total: questions.length,
          percentage,
          level
        }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshProfile() // Refresh profile to update dashboard
        navigate(`/quiz-result`, { state: { result: data.data } })
      } else {
        console.error("Failed to save quiz result")
      }
    } catch (error) {
      console.error("Error saving quiz result:", error)
    }

    setShowResult(true);
  };

  const getPerformanceLevel = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { level: "Expert", color: "#10b981", emoji: "🏆" };
    if (percentage >= 60) return { level: "Intermediate", color: "#3b82f6", emoji: "👍" };
    if (percentage >= 40) return { level: "Beginner", color: "#f59e0b", emoji: "📚" };
    return { level: "Needs Improvement", color: "#ef4444", emoji: "💪" };
  };

  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  const handleGoHome = () => {
    navigate("/"); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold mb-4">Generating your personalized quiz...</h2>
          <p className="text-xl opacity-90">Creating 10 questions based on: {subtopics?.join(", ")}</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const performance = getPerformanceLevel();
    const percentage = ((score / questions.length) * 100).toFixed(1);

    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-12 max-w-2xl w-full text-center">
          <div className="text-8xl mb-6">{performance.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz Completed!</h1>
          
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="text-6xl font-extrabold text-indigo-600">
              {score}/{questions.length}
            </div>
            <div className="text-5xl font-bold text-purple-600">
              {percentage}%
            </div>
          </div>
          
          <div 
            className="inline-block px-10 py-4 rounded-full text-white text-2xl font-bold mb-8"
            style={{ backgroundColor: performance.color }}
          >
            {performance.level}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left">
            <p className="mb-3 text-gray-700 text-lg">
              <strong>Category:</strong> {category.toUpperCase()}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Topics:</strong> {subtopics.join(", ")}
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleRetakeQuiz}
              className="px-8 py-4 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              Take Another Quiz
            </button>
            <button 
              onClick={handleGoHome}
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl  p-6">
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold uppercase text-sm">
            {category}
          </span>
          <span className="text-gray-600 font-semibold">
            Answered: {Object.keys(selectedAnswers).length}/{questions.length}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8 bg-white rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 leading-relaxed">
          {currentQ.question}
        </h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`flex items-center gap-4 p-5 border-3 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedAnswers[currentQuestion] === option
                  ? "border-indigo-600 bg-linear-to-r from-indigo-50 to-purple-50"
                  : "border-gray-200 hover:border-purple-400 hover:bg-gray-50 hover:translate-x-1"
              }`}
            >
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="flex-1 text-lg text-gray-700">{option}</div>
              {selectedAnswers[currentQuestion] === option && (
                <div className="text-indigo-600 text-2xl font-bold">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-8 flex gap-5">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-10 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-semibold text-lg transition-all duration-300 ${
            currentQuestion === 0 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-indigo-600 hover:text-white hover:scale-105"
          }`}
        >
          ← Previous
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className={`flex-1 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
              Object.keys(selectedAnswers).length !== questions.length
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl"
            }`}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Next →
          </button>
        )}
      </div>

      {/* Question Dots */}
      <div className="max-w-4xl mx-auto flex justify-center flex-wrap gap-3">
        {questions.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentQuestion 
                ? "bg-white scale-150" 
                : selectedAnswers[index] 
                  ? "bg-green-400" 
                  : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default QuizTest;
