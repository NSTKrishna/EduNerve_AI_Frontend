const API_URL = "http://localhost:3000/api";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("🌐 API Request:", {
    url,
    method: options.method || "GET",
    hasToken: !!token,
    body: options.body ? JSON.parse(options.body) : null,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("📡 API Response:", {
      url,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));

      console.error("❌ API Error:", {
        url,
        status: response.status,
        error,
      });

      throw new Error(
        error.message || error.error || `HTTP ${response.status}`
      );
    }

    // Handle empty response
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Non-JSON response:", {
        url,
        contentType,
        status: response.status,
      });
      throw new Error(
        `Server returned non-JSON response (${
          contentType || "unknown"
        }). Please check backend endpoint.`
      );
    }

    const text = await response.text();
    if (!text) {
      console.error("❌ Empty response body:", { url });
      throw new Error(
        "Server returned empty response. Please check backend endpoint implementation."
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", {
        url,
        text: text.substring(0, 200),
        error: parseError.message,
      });
      throw new Error(
        `Invalid JSON response from server. Response: ${text.substring(0, 100)}`
      );
    }

    console.log("✅ API Success:", { url, data });
    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      console.error("🔌 Network Error: Cannot connect to backend at", url);
      throw new Error(
        "Cannot connect to server. Please ensure the backend is running."
      );
    }
    throw error;
  }
};

// 🔐 Authentication Endpoints (/api/auth)
export const authAPI = {
  register: async (name, email, password, role, experience, skills) => {
    return fetchWithAuth(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, experience, skills }),
    });
  },

  login: async (email, password) => {
    return fetchWithAuth(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  getProfile: async () => {
    return fetchWithAuth(`${API_URL}/auth/me`);
  },

  updateProfile: async (data) => {
    return fetchWithAuth(`${API_URL}/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return fetchWithAuth(`${API_URL}/auth/change-password`, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// 🎤 Interview Endpoints (/api/interview)
export const interviewAPI = {
  start: async (data) => {
    return fetchWithAuth(`${API_URL}/interview/start`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  analyze: async (interviewId, response) => {
    return fetchWithAuth(`${API_URL}/interview/analyze`, {
      method: "POST",
      body: JSON.stringify({ interviewId, response }),
    });
  },

  end: async (interviewId, data) => {
    return fetchWithAuth(`${API_URL}/interview/end`, {
      method: "POST",
      body: JSON.stringify({ interviewId, ...data }),
    });
  },

  getHistory: async () => {
    return fetchWithAuth(`${API_URL}/interview/history`);
  },

  getById: async (interviewId) => {
    return fetchWithAuth(`${API_URL}/interview/${interviewId}`);
  },

  createWithFeedback: async (data) => {
    return fetchWithAuth(`${API_URL}/interview/create-with-feedback`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  startInterview: async (role, interviewType, technologies) => {
    return fetchWithAuth(`${API_URL}/interview/start-interview`, {
      method: "POST",
      body: JSON.stringify({ role, interviewType, technologies }),
    });
  },

  completeInterview: async (interviewId, transcript, duration) => {
    return fetchWithAuth(`${API_URL}/interview/complete`, {
      method: "POST",
      body: JSON.stringify({ interviewId, transcript, duration }),
    });
  },

  getInterview: async (interviewId) => {
    return fetchWithAuth(`${API_URL}/interview/${interviewId}`);
  },

  getUserInterviews: async () => {
    return fetchWithAuth(`${API_URL}/interview/user/history`);
  },
};

// 📝 Quiz Endpoints - Complete Integration
export const quizAPI = {
  // STEP 1: Generate quiz questions (doesn't save to DB)
  generateQuiz: async (topic, difficulty, numberOfQuestions) => {
    return fetchWithAuth(`${API_URL}/quiz/generate`, {
      method: "POST",
      body: JSON.stringify({
        prompt: topic,
        difficulty,
        numberOfQuestions,
      }),
    });
  },

  // STEP 2: Save complete quiz set to database (with all questions)
  saveQuizSet: async (quizData) => {
    return fetchWithAuth(`${API_URL}/quiz/save-set`, {
      method: "POST",
      body: JSON.stringify({
        title: quizData.title,
        topic: quizData.topic,
        difficulty: quizData.difficulty,
        numberOfQuestions: quizData.numberOfQuestions,
        questions: quizData.questions, // Array of question objects
      }),
    });
  },

  // Get all saved quiz sets (user's quiz history)
  getAllQuizSets: async () => {
    return fetchWithAuth(`${API_URL}/quiz/sets`);
  },

  // Get a specific quiz set by ID with all questions
  getQuizSetById: async (quizId) => {
    return fetchWithAuth(`${API_URL}/quiz/set/${quizId}`);
  },

  // Delete a quiz set by ID
  deleteQuizSet: async (quizId) => {
    return fetchWithAuth(`${API_URL}/quiz/set/${quizId}`, {
      method: "DELETE",
    });
  },

  // Update a quiz set
  updateQuizSet: async (quizId, updates) => {
    return fetchWithAuth(`${API_URL}/quiz/set/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Save quiz result to database
  saveQuizResult: async (resultData) => {
    return fetchWithAuth(`${API_URL}/quiz/result`, {
      method: "POST",
      body: JSON.stringify({
        quizSetId: resultData.quizSetId,
        score: resultData.score,
        totalQuestions: resultData.totalQuestions,
        percentage: resultData.percentage,
        timeTaken: resultData.timeTaken,
        answers: resultData.answers, // Array of user's answers
      }),
    });
  },

  // Get all quiz results for user
  getAllResults: async () => {
    return fetchWithAuth(`${API_URL}/quiz/results`);
  },

  // Get results for specific quiz set
  getQuizResults: async (quizSetId) => {
    return fetchWithAuth(`${API_URL}/quiz/results/${quizSetId}`);
  },
};

// 📊 Learning Profile Endpoints (/api/learning-profile)
export const learningProfileAPI = {
  getProfile: async () => {
    return fetchWithAuth(`${API_URL}/learning-profile/profile`);
  },

  getQuickSummary: async () => {
    return fetchWithAuth(`${API_URL}/learning-profile/quick-summary`);
  },

  getTrends: async (period = "month") => {
    return fetchWithAuth(`${API_URL}/learning-profile/trends?period=${period}`);
  },

  getDashboard: async () => {
    return fetchWithAuth(`${API_URL}/learning-profile/dashboard`);
  },
};

// 📚 Resources Endpoints (existing)
export const resourcesAPI = {
  getResources: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(
      `${API_URL}/resource${queryString ? `?${queryString}` : ""}`
    );
  },

  searchResources: async (query) => {
    return fetchWithAuth(
      `${API_URL}/resource/search?q=${encodeURIComponent(query)}`
    );
  },

  addResource: async (resource) => {
    return fetchWithAuth(`${API_URL}/resource`, {
      method: "POST",
      body: JSON.stringify(resource),
    });
  },
};

// 🏥 Health & Utility Endpoints
export const utilityAPI = {
  getWelcome: async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/`
    );
    return response.json();
  },

  healthCheck: async () => {
    return fetchWithAuth(`${API_URL}/health`);
  },
};

// Export all APIs as default
export default {
  authAPI,
  interviewAPI,
  quizAPI,
  learningProfileAPI,
  resourcesAPI,
  utilityAPI,
};
