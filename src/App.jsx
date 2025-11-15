import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LearnerProvider } from "./context/LearnerContext"
import PrivateRoute from "./components/PrivateRoute"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardPage from "./pages/DashboardPage"
import QuizHubPage from "./pages/QuizHubPage"
import InterviewPage from "./pages/InterviewPage"
import NotFoundPage from "./pages/NotFoundPage"
export default function App() {
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
              path="/quizzes"
              element={
                <PrivateRoute>
                  <QuizHubPage />
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


            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </LearnerProvider>
  )
}