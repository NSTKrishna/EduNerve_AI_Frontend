const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const getAuthToken = () => {
  return localStorage.getItem("authToken")
}

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return fetchWithAuth(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (name, email, password, role, experience, skills) => {
    return fetchWithAuth(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, experience, skills }),
    })
  },

  getProfile: async () => {
    return fetchWithAuth(`${API_URL}/auth/profile`)
  },

  updateProfile: async (data) => {
    return fetchWithAuth(`${API_URL}/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}


export const interviewAPI = {
  startInterview: async (role, interviewType, technologies) => {
    return fetchWithAuth(`${API_URL}/interview/start-interview`, {
      method: "POST",
      body: JSON.stringify({ role, interviewType, technologies }),
    })
  },

  completeInterview: async (interviewId, transcript, duration) => {
    return fetchWithAuth(`${API_URL}/interview/complete`, {
      method: "POST",
      body: JSON.stringify({ interviewId, transcript, duration }),
    })
  },

  getInterview: async (interviewId) => {
    return fetchWithAuth(`${API_URL}/interview/${interviewId}`)
  },

  getUserInterviews: async () => {
    return fetchWithAuth(`${API_URL}/interview/user/history`)
  },
}


export const resourcesAPI = {
  getResources: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return fetchWithAuth(`${API_URL}/resource${queryString ? `?${queryString}` : ""}`)
  },

  searchResources: async (query) => {
    return fetchWithAuth(`${API_URL}/resource/search?q=${encodeURIComponent(query)}`)
  },

  addResource: async (resource) => {
    return fetchWithAuth(`${API_URL}/resource`, {
      method: "POST",
      body: JSON.stringify(resource),
    })
  },
}

export const quizAPI = {
  createQuiz: async (quizData) => {
    return fetchWithAuth(`${API_URL}/quiz/create_quiz`, {
      method: "POST",
      body: JSON.stringify(quizData),
    })
  },

  getAllQuizzes: async () => {
    return fetchWithAuth(`${API_URL}/quiz/quizzes`)
  },

  submitQuizAnswers: async (id, answers) => {
    return fetchWithAuth(`${API_URL}/quiz/correct_quiz/${id}`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
  },
  getQuizById: async (id) => {
    return fetchWithAuth(`${API_URL}/quiz/quiz/${id}`)
  },
  deleteQuiz: async (id) => {
    return fetchWithAuth(`${API_URL}/quiz/delete_quiz/${id}`, {
      method: "DELETE",
    })
  }
}

export default {
  authAPI,
  interviewAPI,
  resourcesAPI,
}
