// All backend calls live here. See API_CONTRACT.md in the backend repo.
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export const TOKEN_KEY = "authToken";

const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

/** Every failed request throws this. Branch on `code`, never on `message`. */
export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Codes meaning "your session is no longer valid" (as opposed to e.g. a wrong login password).
const SESSION_CODES = new Set(["UNAUTHORIZED", "INVALID_TOKEN", "TOKEN_EXPIRED"]);
let onSessionExpired = null;

/** Called once by the auth provider so an expired JWT logs the user out anywhere in the app. */
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

async function request(path, { method = "GET", body, query } = {}) {
  const headers = {};
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const search = query
    ? new URLSearchParams(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ""),
      ).toString()
    : "";
  const url = `${API_URL}${path}${search ? `?${search}` : ""}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", {
      code: "NETWORK_ERROR",
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new ApiError(data?.error || `Request failed (${response.status})`, {
      status: response.status,
      code: data?.code || "UNKNOWN",
      details: data?.details,
    });
    if (response.status === 401 && SESSION_CODES.has(error.code)) onSessionExpired?.();
    throw error;
  }

  return data;
}

export const authAPI = {
  login: ({ email, password }) => request("/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  getProfile: () => request("/auth/profile"),
  updateProfile: (changes) => request("/auth/profile", { method: "PUT", body: changes }),
  changePassword: (payload) => request("/auth/password", { method: "PUT", body: payload }),
  deleteAccount: (password) => request("/auth/me", { method: "DELETE", body: { password } }),
};

export const dashboardAPI = {
  getStats: () => request("/auth/dashboard"),
};

export const tokenAPI = {
  getBalance: () => request("/token"),
  getTransactions: (limit = 30) => request("/token/transactions", { query: { limit } }),
};

export const interviewAPI = {
  getOptions: () => request("/interview/options"),
  start: ({ role, interviewType, technologies }) =>
    request("/interview/start-interview", { method: "POST", body: { role, interviewType, technologies } }),
  complete: ({ interviewId, transcript, duration }) =>
    request("/interview/complete", { method: "POST", body: { interviewId, transcript, duration } }),
  get: (interviewId) => request(`/interview/${encodeURIComponent(interviewId)}`),
  list: (params) => request("/interview/user/history", { query: params }),
};
