// Example component demonstrating new API endpoints usage
import { useState, useEffect } from "react";
import { learningProfileAPI, quizAPI, interviewAPI, authAPI } from "../lib/api";
import { UseLearner } from "../context/LearnerContext";

function ExampleAPIUsage() {
  const { learnerProfile, isAuthenticated } = UseLearner();
  const [dashboardData, setDashboardData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);

  // Example 1: Fetch Dashboard Data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await learningProfileAPI.getDashboard();
      setDashboardData(data);
      console.log("📊 Dashboard Data:", data);
    } catch (error) {
      console.error("Dashboard fetch failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Fetch Performance Trends
  const fetchTrends = async (period = "month") => {
    try {
      const trendsData = await learningProfileAPI.getTrends(period);
      setTrends(trendsData);
      console.log("📈 Trends:", trendsData);
    } catch (error) {
      console.error("Trends fetch failed:", error.message);
    }
  };

  // Example 3: Generate and Take a Quiz
  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);

      // Generate quiz
      const quiz = await quizAPI.generate("JavaScript", 10);
      console.log("📝 Generated Quiz:", quiz);

      // Simulate answering
      const answers = Array(10).fill(0); // All answer 0 for demo

      // Submit quiz
      const result = await quizAPI.submit(quiz.id, {
        answers,
        timeSpent: 600,
      });

      console.log("✅ Quiz Result:", result);

      // Refresh dashboard to see updated stats
      await fetchDashboard();
    } catch (error) {
      console.error("Quiz flow failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 4: Start and Complete Interview
  const handleInterview = async () => {
    try {
      setLoading(true);

      // Start interview
      const interview = await interviewAPI.start({
        role: "Software Engineer",
        interviewType: "technical",
        technologies: ["React", "JavaScript"],
        difficulty: "medium",
      });

      console.log("🎤 Interview Started:", interview);

      // Simulate interview responses
      const response1 = await interviewAPI.analyze(
        interview.interviewId,
        "I have 3 years of experience with React..."
      );

      console.log("💬 Analysis:", response1);

      // End interview
      const results = await interviewAPI.end(interview.interviewId, {
        duration: 1800,
        totalQuestions: 5,
        correctAnswers: 4,
      });

      console.log("🏆 Interview Results:", results);

      // Refresh dashboard
      await fetchDashboard();
    } catch (error) {
      console.error("Interview flow failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 5: Update User Profile
  const handleUpdateProfile = async () => {
    try {
      const updated = await authAPI.updateProfile({
        name: "John Updated",
        role: "Senior Software Engineer",
        skills: ["React", "Node.js", "TypeScript", "Python"],
      });

      console.log("✅ Profile Updated:", updated);
    } catch (error) {
      console.error("Profile update failed:", error.message);
    }
  };

  // Example 6: Get Quiz History
  const fetchQuizHistory = async () => {
    try {
      const history = await quizAPI.getHistory();
      console.log("📚 Quiz History:", history);
    } catch (error) {
      console.error("Quiz history fetch failed:", error.message);
    }
  };

  // Example 7: Get Interview History
  const fetchInterviewHistory = async () => {
    try {
      const history = await interviewAPI.getHistory();
      console.log("🎤 Interview History:", history);
    } catch (error) {
      console.error("Interview history fetch failed:", error.message);
    }
  };

  // Example 8: Change Password
  const handleChangePassword = async () => {
    try {
      const result = await authAPI.changePassword(
        "currentPassword123",
        "newPassword456"
      );
      console.log("🔒 Password Changed:", result.message);
    } catch (error) {
      console.error("Password change failed:", error.message);
    }
  };

  // Load dashboard on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
      fetchTrends("month");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Please log in to see examples
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Integration Examples</h1>

      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading...
        </div>
      )}

      {/* User Info */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Current User</h2>
        <p>
          <strong>Name:</strong> {learnerProfile?.name}
        </p>
        <p>
          <strong>Email:</strong> {learnerProfile?.email}
        </p>
        <p>
          <strong>Role:</strong> {learnerProfile?.role}
        </p>
        <p>
          <strong>Skills:</strong> {learnerProfile?.skills?.join(", ")}
        </p>
      </section>

      {/* Dashboard Data */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Dashboard Data</h2>
        <button
          onClick={fetchDashboard}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Refresh Dashboard
        </button>
        {dashboardData && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        )}
      </section>

      {/* Performance Trends */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Performance Trends</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => fetchTrends("week")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Week
          </button>
          <button
            onClick={() => fetchTrends("month")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Month
          </button>
          <button
            onClick={() => fetchTrends("quarter")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Quarter
          </button>
        </div>
        {trends && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(trends, null, 2)}
          </pre>
        )}
      </section>

      {/* Actions */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGenerateQuiz}
            className="bg-purple-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Generate & Take Quiz
          </button>

          <button
            onClick={handleInterview}
            className="bg-indigo-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Start Interview
          </button>

          <button
            onClick={fetchQuizHistory}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Get Quiz History
          </button>

          <button
            onClick={fetchInterviewHistory}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Get Interview History
          </button>

          <button
            onClick={handleUpdateProfile}
            className="bg-teal-500 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>

          <button
            onClick={handleChangePassword}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </div>
      </section>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="font-bold mb-2">📝 Note:</h3>
        <p className="text-sm text-gray-700">
          Check your browser console for detailed API response logs. Each button
          demonstrates a different API endpoint.
        </p>
      </div>
    </div>
  );
}

export default ExampleAPIUsage;
