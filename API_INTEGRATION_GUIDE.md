# API Integration Guide

## 📦 Overview

All backend endpoints have been integrated into the frontend via `/src/lib/api.js`. This guide shows you how to use each endpoint.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

For production:

```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## 🔐 Authentication Endpoints

### Import

```javascript
import { authAPI } from "../lib/api";
```

### 1. Register New User

```javascript
const handleRegister = async () => {
  try {
    const response = await authAPI.register(
      "John Doe", // name
      "john@example.com", // email
      "password123", // password
      "Software Engineer", // role
      "3 years", // experience
      ["React", "Node.js"] // skills
    );

    // Store token
    localStorage.setItem("authToken", response.token);
    console.log("User registered:", response.user);
  } catch (error) {
    console.error("Registration failed:", error.message);
  }
};
```

### 2. Login

```javascript
const handleLogin = async () => {
  try {
    const response = await authAPI.login("john@example.com", "password123");

    localStorage.setItem("authToken", response.token);
    console.log("Logged in:", response.user);
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};
```

### 3. Google OAuth Login

```javascript
const handleGoogleLogin = () => {
  // Redirects to Google OAuth
  authAPI.googleLogin();
};
```

### 4. Get Current User Profile ✅ Auth Required

```javascript
const fetchProfile = async () => {
  try {
    const profile = await authAPI.getProfile();
    console.log("User profile:", profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error.message);
  }
};
```

### 5. Update Profile ✅ Auth Required

```javascript
const updateProfile = async () => {
  try {
    const response = await authAPI.updateProfile({
      name: "John Updated",
      role: "Senior Engineer",
      skills: ["React", "Node.js", "TypeScript"],
    });
    console.log("Profile updated:", response);
  } catch (error) {
    console.error("Update failed:", error.message);
  }
};
```

### 6. Change Password ✅ Auth Required

```javascript
const changePassword = async () => {
  try {
    const response = await authAPI.changePassword(
      "oldPassword123",
      "newPassword456"
    );
    console.log("Password changed:", response.message);
  } catch (error) {
    console.error("Password change failed:", error.message);
  }
};
```

---

## 🎤 Interview Endpoints

### Import

```javascript
import { interviewAPI } from "../lib/api";
```

### 1. Start New Interview ✅ Auth Required

```javascript
const startInterview = async () => {
  try {
    const response = await interviewAPI.start({
      role: "Software Engineer",
      interviewType: "technical",
      technologies: ["React", "JavaScript"],
      difficulty: "medium",
    });

    console.log("Interview started:", response.interviewId);
  } catch (error) {
    console.error("Failed to start interview:", error.message);
  }
};
```

### 2. Analyze User Response ✅ Auth Required

```javascript
const analyzeResponse = async (interviewId, userResponse) => {
  try {
    const analysis = await interviewAPI.analyze(
      interviewId,
      "My answer to the technical question..."
    );

    console.log("Analysis:", analysis.feedback);
  } catch (error) {
    console.error("Analysis failed:", error.message);
  }
};
```

### 3. End Interview ✅ Auth Required

```javascript
const endInterview = async (interviewId) => {
  try {
    const results = await interviewAPI.end(interviewId, {
      duration: 1800, // seconds
      totalQuestions: 10,
      correctAnswers: 7,
    });

    console.log("Interview results:", results);
  } catch (error) {
    console.error("Failed to end interview:", error.message);
  }
};
```

### 4. Get Interview History ✅ Auth Required

```javascript
const fetchInterviewHistory = async () => {
  try {
    const history = await interviewAPI.getHistory();
    console.log("Interview history:", history);
  } catch (error) {
    console.error("Failed to fetch history:", error.message);
  }
};
```

### 5. Get Specific Interview ✅ Auth Required

```javascript
const fetchInterview = async (interviewId) => {
  try {
    const interview = await interviewAPI.getById(interviewId);
    console.log("Interview details:", interview);
  } catch (error) {
    console.error("Failed to fetch interview:", error.message);
  }
};
```

### 6. Create Interview with AI Feedback ✅ Auth Required

```javascript
const createInterviewWithFeedback = async () => {
  try {
    const response = await interviewAPI.createWithFeedback({
      role: "Data Scientist",
      questions: ["Tell me about yourself", "What is machine learning?"],
      answers: ["I am a developer...", "ML is..."],
    });

    console.log("Feedback:", response.feedback);
  } catch (error) {
    console.error("Failed to create interview:", error.message);
  }
};
```

---

## 📝 Quiz Endpoints

### Import

```javascript
import { quizAPI } from "../lib/api";
```

### 1. Generate Quiz ❌ No Auth Required

```javascript
const generateQuiz = async () => {
  try {
    const quiz = await quizAPI.generate(
      "JavaScript basics", // prompt
      10 // number of questions
    );

    console.log("Generated quiz:", quiz.questions);
  } catch (error) {
    console.error("Quiz generation failed:", error.message);
  }
};
```

### 2. Submit Quiz ✅ Auth Optional

```javascript
const submitQuiz = async (quizId) => {
  try {
    const response = await quizAPI.submit(quizId, {
      answers: [0, 2, 1, 3, 0, 1, 2, 3, 0, 1],
      timeSpent: 600, // seconds
    });

    console.log("Quiz result:", response.score);
  } catch (error) {
    console.error("Quiz submission failed:", error.message);
  }
};
```

### 3. Get Quiz History ✅ Auth Required

```javascript
const fetchQuizHistory = async () => {
  try {
    const history = await quizAPI.getHistory();
    console.log("Quiz history:", history);
  } catch (error) {
    console.error("Failed to fetch quiz history:", error.message);
  }
};
```

### 4. Get Specific Quiz ✅ Auth Required

```javascript
const fetchQuiz = async (quizId) => {
  try {
    const quiz = await quizAPI.getById(quizId);
    console.log("Quiz details:", quiz);
  } catch (error) {
    console.error("Failed to fetch quiz:", error.message);
  }
};
```

### 5. Submit Quiz with AI Feedback ❌ No Auth Required

```javascript
const submitWithFeedback = async () => {
  try {
    const response = await quizAPI.submitWithFeedback(
      {
        topic: "React Hooks",
        questions: [...],
      },
      {
        answers: [0, 2, 1],
        userEmail: "optional@email.com"
      }
    );

    console.log("AI Feedback:", response.feedback);
  } catch (error) {
    console.error("Submission failed:", error.message);
  }
};
```

---

## 📊 Learning Profile Endpoints

### Import

```javascript
import { learningProfileAPI } from "../lib/api";
```

### 1. Get Full AI Learning Profile ✅ Auth Required

```javascript
const fetchLearningProfile = async () => {
  try {
    const profile = await learningProfileAPI.getProfile();
    console.log("Learning profile:", profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error.message);
  }
};
```

### 2. Get Quick Skill Summary ✅ Auth Required

```javascript
const fetchQuickSummary = async () => {
  try {
    const summary = await learningProfileAPI.getQuickSummary();
    console.log("Quick summary:", summary);
  } catch (error) {
    console.error("Failed to fetch summary:", error.message);
  }
};
```

### 3. Get Performance Trends ✅ Auth Required

```javascript
const fetchTrends = async (period = "month") => {
  try {
    // period: 'week' | 'month' | 'quarter'
    const trends = await learningProfileAPI.getTrends(period);
    console.log("Performance trends:", trends);
  } catch (error) {
    console.error("Failed to fetch trends:", error.message);
  }
};
```

### 4. Get Dashboard Data ✅ Auth Required

```javascript
const fetchDashboard = async () => {
  try {
    const dashboard = await learningProfileAPI.getDashboard();
    console.log("Dashboard data:", dashboard);
  } catch (error) {
    console.error("Failed to fetch dashboard:", error.message);
  }
};
```

---

## 📚 Resources Endpoints (Existing)

### Import

```javascript
import { resourcesAPI } from "../lib/api";
```

### Example Usage

```javascript
const fetchResources = async () => {
  try {
    const resources = await resourcesAPI.getResources({
      category: "tutorial",
      limit: 10,
    });
    console.log("Resources:", resources);
  } catch (error) {
    console.error("Failed to fetch resources:", error.message);
  }
};
```

---

## 🏥 Health & Utility Endpoints

### Import

```javascript
import { utilityAPI } from "../lib/api";
```

### 1. API Welcome Message

```javascript
const checkWelcome = async () => {
  try {
    const message = await utilityAPI.getWelcome();
    console.log("API Message:", message);
  } catch (error) {
    console.error("Failed to get welcome:", error.message);
  }
};
```

### 2. Health Check

```javascript
const checkHealth = async () => {
  try {
    const health = await utilityAPI.healthCheck();
    console.log("API Health:", health.status);
  } catch (error) {
    console.error("Health check failed:", error.message);
  }
};
```

---

## 🔑 Authentication Flow

### Complete Example with Context

```javascript
import { UseLearner } from "../context/LearnerContext";

function MyComponent() {
  const { login, logout, learnerProfile, isAuthenticated } = UseLearner();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Profile is automatically loaded by context
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {learnerProfile?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => handleLogin("user@example.com", "password")}>
          Login
        </button>
      )}
    </div>
  );
}
```

---

## 📊 Dashboard Integration Example

```javascript
import { useEffect, useState } from "react";
import { learningProfileAPI, quizAPI, interviewAPI } from "../lib/api";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch combined dashboard data
        const data = await learningProfileAPI.getDashboard();

        // Or fetch individually
        const [profile, quizHistory, interviewHistory] = await Promise.all([
          learningProfileAPI.getProfile(),
          quizAPI.getHistory(),
          interviewAPI.getHistory(),
        ]);

        setDashboardData({
          profile,
          quizHistory,
          interviewHistory,
        });
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Quizzes completed: {dashboardData?.quizHistory?.length}</p>
      <p>Interviews practiced: {dashboardData?.interviewHistory?.length}</p>
    </div>
  );
}
```

---

## 🚨 Error Handling

All API calls automatically handle errors. You can catch them:

```javascript
try {
  const data = await authAPI.getProfile();
} catch (error) {
  // error.message contains the error description
  if (error.message.includes("401")) {
    // Handle unauthorized
    console.log("Please login again");
  } else if (error.message.includes("500")) {
    // Handle server error
    console.log("Server error, please try again");
  }
}
```

---

## 📝 Endpoint Summary

| Category         | Endpoints | Auth Required    |
| ---------------- | --------- | ---------------- |
| Authentication   | 6         | 3 require auth   |
| Interview        | 6         | All require auth |
| Quiz             | 5         | 2 require auth   |
| Learning Profile | 4         | All require auth |
| Resources        | 3         | Optional         |
| Utility          | 2         | None             |

**Total: 26 endpoints integrated** ✅

---

## 🎯 Next Steps

1. **Update existing components** to use new endpoints
2. **Add error handling** UI components
3. **Implement loading states** for better UX
4. **Create API status monitor** component
5. **Add retry logic** for failed requests

---

## 🔗 Related Files

- **API Configuration**: `/src/lib/api.js`
- **Context**: `/src/context/LearnerContext.jsx`
- **Environment**: `/.env`

---

**Last Updated**: November 8, 2025  
**Status**: ✅ All Endpoints Integrated
