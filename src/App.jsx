import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LearnerProvider } from "./context/LearnerContext";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import LmsHubPage from "./pages/LmsHubPage";
import QuizHubPage from "./pages/QuizHubPage";
import QuizPage from "./pages/QuizPage";
import Quiz from "./pages/Quiz.jsx";
import QuizManagementPage from "./pages/QuizManagementPage";
import QuizTest from "./components/QuizTest";
import QuizTakingPage from "./pages/QuizTakingPage";
import QuizViewPage from "./pages/QuizViewPage";
import InterviewPage from "./pages/InterviewPage";
import ProjectsPage from "./pages/ProjectsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ContinueLearningPage from "./pages/ContinueLearningPage";
import ExampleAPIUsage from "./pages/ExampleAPIUsage";

export default function App() {
  console.log("🚀 App component rendering");
  return (
    <LearnerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/learning"
            element={
              <PrivateRoute>
                <LmsHubPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/learning/continue"
            element={
              <PrivateRoute>
                <ContinueLearningPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/lms"
            element={
              <PrivateRoute>
                <LmsHubPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <PrivateRoute>
                <QuizHubPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz-management"
            element={
              <PrivateRoute>
                <QuizManagementPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz-test"
            element={
              <PrivateRoute>
                <QuizTest />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz/:quizId/view"
            element={
              <PrivateRoute>
                <QuizViewPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz/:topic"
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/attempt-quiz/:topic"
            element={
              <PrivateRoute>
                <Quiz />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <PrivateRoute>
                <QuizTakingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <PrivateRoute>
                <InterviewPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/api-examples"
            element={
              <PrivateRoute>
                <ExampleAPIUsage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </LearnerProvider>
  );
}
