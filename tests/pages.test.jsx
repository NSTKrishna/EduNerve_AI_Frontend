// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  interviewAPI: { getOptions: vi.fn(), list: vi.fn(), get: vi.fn(), start: vi.fn(), complete: vi.fn() },
  dashboardAPI: { getStats: vi.fn() },
  tokenAPI: { getTransactions: vi.fn(), getBalance: vi.fn() },
  authAPI: { changePassword: vi.fn(), deleteAccount: vi.fn() },
}));
vi.mock("../src/lib/api.js", () => api);
vi.mock("@vapi-ai/web", () => ({ default: class {} }));
// recharts needs real layout; the chart itself isn't what these tests are about.
vi.mock("recharts", async () => {
  const stub = () => null;
  return { ResponsiveContainer: ({ children }) => <div data-testid="chart">{children}</div>, LineChart: stub, Line: stub, XAxis: stub, YAxis: stub, CartesianGrid: stub, Tooltip: stub, Legend: stub };
});

const user = { id: "u1", name: "Ada Lovelace", email: "ada@x.com", role: "Backend Developer", experience: "3-5 years", skills: ["Node.js", "Redis"], tokens: 80 };
vi.mock("../src/context/LearnerContext.jsx", () => ({
  useLearner: () => ({ user, tokens: 80, setTokens: vi.fn(), updateProfile: vi.fn(), logout: vi.fn() }),
}));

const { ToastProvider } = await import("../src/components/common/Toast.jsx");
const { default: DashboardPage } = await import("../src/pages/DashboardPage.jsx");
const { default: HistoryPage } = await import("../src/pages/HistoryPage.jsx");
const { default: ReportPage } = await import("../src/pages/ReportPage.jsx");
const { default: SettingsPage } = await import("../src/pages/SettingsPage.jsx");
const { default: InterviewPage } = await import("../src/pages/InterviewPage.jsx");

const options = {
  roles: { "Backend Developer": ["Node.js", "Redis", "Go"], "Frontend Developer": ["React"] },
  interviewTypes: ["technical", "behavioral", "mixed"],
  maxTechnologies: 8,
  tokenCost: 10,
  durationMinutes: 10,
};

const summary = (overrides = {}) => ({
  id: "i-1", role: "Backend Developer", interviewType: "mixed", technologies: ["Node.js"], status: "completed",
  duration: 300, startedAt: "2026-10-01T10:00:00Z", completedAt: "2026-10-01T10:05:00Z", feedback: "Solid fundamentals.",
  strengths: ["Clear"], weakAreas: [], technicalScore: 8, communicationScore: 7, problemSolvingScore: 7.5, overallScore: 7.5, ...overrides,
});

const renderAt = (path, element, route = path) =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={element} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  api.interviewAPI.getOptions.mockResolvedValue({ success: true, ...options });
  api.tokenAPI.getTransactions.mockResolvedValue({ transactions: [{ id: "t1", delta: -10, balanceAfter: 90, reason: "INTERVIEW_START", createdAt: "2026-10-01T10:00:00Z" }] });
});
afterEach(cleanup);

describe("DashboardPage", () => {
  it("shows scores on the 0-10 scale (not as a wrong percentage)", async () => {
    api.dashboardAPI.getStats.mockResolvedValue({
      data: { tokens: 80, skillsTracked: 2, interviewSessions: 3, completedInterviews: 2, avgScore: 7.5,
        avgScores: { technical: 8, communication: 7, problemSolving: 7.5 }, scoreTrend: [] },
    });
    api.interviewAPI.list.mockResolvedValue({ interviews: [summary()], total: 1, nextCursor: null });

    renderAt("/dashboard", <DashboardPage />);

    expect(await screen.findByText("Welcome back, Ada")).toBeTruthy();
    expect(screen.getAllByText("7.5/10").length).toBeGreaterThan(0);
    expect(screen.queryByText("8%")).toBeNull();
    expect(screen.getByText("Recent interviews")).toBeTruthy();
  });

  it("shows an empty state and a retry on failure", async () => {
    api.dashboardAPI.getStats.mockRejectedValueOnce(new Error("Server down"));
    api.interviewAPI.list.mockResolvedValue({ interviews: [], total: 0, nextCursor: null });
    renderAt("/dashboard", <DashboardPage />);
    expect(await screen.findByText("Server down")).toBeTruthy();

    api.dashboardAPI.getStats.mockResolvedValue({
      data: { tokens: 80, skillsTracked: 0, interviewSessions: 0, completedInterviews: 0, avgScore: null,
        avgScores: { technical: null, communication: null, problemSolving: null }, scoreTrend: [] },
    });
    screen.getByText("Try again").click();
    expect(await screen.findByText("Ready for your first interview?")).toBeTruthy();
  });
});

describe("HistoryPage", () => {
  it("lists interviews and loads the next page with the cursor", async () => {
    api.interviewAPI.list
      .mockResolvedValueOnce({ interviews: [summary()], total: 2, nextCursor: "i-1" })
      .mockResolvedValueOnce({ interviews: [summary({ id: "i-2", role: "Frontend Developer" })], total: 2, nextCursor: null });

    renderAt("/history", <HistoryPage />);
    expect(await screen.findByText("Backend Developer")).toBeTruthy();
    expect(screen.getByText("2 interviews")).toBeTruthy();

    screen.getByText("Load more").click();
    expect(await screen.findByText("Frontend Developer")).toBeTruthy();
    expect(api.interviewAPI.list).toHaveBeenLastCalledWith(expect.objectContaining({ cursor: "i-1", limit: 10 }));
    expect(screen.queryByText("Load more")).toBeNull();
  });
});

describe("ReportPage", () => {
  const full = {
    ...summary(), transcript: [{ speaker: "Interviewer", text: "Hello" }, { speaker: "You", text: "Hi, I'm Ada" }],
    aiAnalysis: { summary: "Good", notes: ["Use STAR"] }, strengths: ["Clear explanations"], weakAreas: ["Depth"],
  };

  it("renders scores, feedback and the transcript", async () => {
    api.interviewAPI.get.mockResolvedValue({ interview: full });
    renderAt("/interviews/i-1", <ReportPage />, "/interviews/:interviewId");

    expect(await screen.findByText("Solid fundamentals.")).toBeTruthy();
    expect(screen.getByText("Clear explanations")).toBeTruthy();
    expect(screen.getByText("Use STAR")).toBeTruthy();
    expect(screen.getByText("Hi, I'm Ada")).toBeTruthy();
    expect(api.interviewAPI.get).toHaveBeenCalledWith("i-1");
  });

  it("explains unscored (fallback) interviews instead of showing fake scores", async () => {
    api.interviewAPI.get.mockResolvedValue({
      interview: { ...full, technicalScore: null, communicationScore: null, problemSolvingScore: null, overallScore: null, strengths: [], weakAreas: [] },
    });
    renderAt("/interviews/i-1", <ReportPage />, "/interviews/:interviewId");
    expect(await screen.findByText(/AI feedback wasn.t available/)).toBeTruthy();
    expect(screen.queryByText("Scores")).toBeNull();
  });

  it("shows a friendly message for someone else's interview", async () => {
    api.interviewAPI.get.mockRejectedValue(Object.assign(new Error("Interview not found"), { code: "NOT_FOUND" }));
    renderAt("/interviews/nope", <ReportPage />, "/interviews/:interviewId");
    expect(await screen.findByText(/couldn.t find that interview/)).toBeTruthy();
  });
});

describe("SettingsPage", () => {
  it("shows the profile, token ledger and password form", async () => {
    renderAt("/settings", <SettingsPage />);
    expect(await screen.findByDisplayValue("Ada Lovelace")).toBeTruthy();
    expect(screen.getByDisplayValue("Backend Developer")).toBeTruthy();
    expect(await screen.findByText("Interview")).toBeTruthy(); // ledger row
    expect(screen.getByText("Update password")).toBeTruthy();
    expect(screen.getByText("Delete my account")).toBeTruthy();
  });
});

describe("InterviewPage", () => {
  it("builds the form from server options and pre-selects profile skills valid for the role", async () => {
    renderAt("/interviews", <InterviewPage />);
    expect(await screen.findByText("AI mock interview")).toBeTruthy();
    expect(screen.getByDisplayValue("Backend Developer")).toBeTruthy();
    expect(screen.getByText("Node.js").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("Go").getAttribute("aria-pressed")).toBe("false");
    await waitFor(() => expect(screen.getByText("Start interview").closest("button").disabled).toBe(false));
  });
});
