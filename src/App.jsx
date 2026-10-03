import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LearnerProvider } from "./context/LearnerContext";
import { ToastProvider } from "./components/common/Toast";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import { PageLoading } from "./components/common/PageState";

// Signed-in pages are split out: the dashboard pulls in recharts and the interview page the Vapi SDK.
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InterviewPage = lazy(() => import("./pages/InterviewPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LearnerProvider>
          <BrowserRouter>
            {/* First tab stop on every page: without it, reaching the content
                means tabbing through the whole sidebar. */}
            <a
              href="#main"
              className="sr-only z-200 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-ink"
            >
              Skip to content
            </a>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                <Route
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/interviews" element={<InterviewPage />} />
                  <Route path="/interviews/:interviewId" element={<ReportPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LearnerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
