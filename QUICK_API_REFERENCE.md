# 🚀 Quick API Reference Card

## Import APIs

```javascript
import {
  authAPI,
  interviewAPI,
  quizAPI,
  learningProfileAPI,
  resourcesAPI,
  utilityAPI,
} from "../lib/api";
```

---

## 🔐 Authentication

```javascript
// Register
await authAPI.register(name, email, password, role, experience, skills);

// Login
await authAPI.login(email, password);

// Google Login
authAPI.googleLogin(); // Redirects to Google

// Get Profile ✅
await authAPI.getProfile();

// Update Profile ✅
await authAPI.updateProfile({ name, role, skills });

// Change Password ✅
await authAPI.changePassword(currentPassword, newPassword);
```

---

## 🎤 Interviews

```javascript
// Start Interview ✅
await interviewAPI.start({ role, interviewType, technologies });

// Analyze Response ✅
await interviewAPI.analyze(interviewId, userResponse);

// End Interview ✅
await interviewAPI.end(interviewId, { duration, totalQuestions });

// Get History ✅
await interviewAPI.getHistory();

// Get by ID ✅
await interviewAPI.getById(interviewId);

// Create with Feedback ✅
await interviewAPI.createWithFeedback(data);
```

---

## 📝 Quizzes

```javascript
// Generate Quiz
await quizAPI.generate(prompt, numberOfQuestions);

// Submit Quiz
await quizAPI.submit(quizId, { answers, timeSpent });

// Get History ✅
await quizAPI.getHistory();

// Get by ID ✅
await quizAPI.getById(quizId);

// Submit with Feedback
await quizAPI.submitWithFeedback(quizData, answers);
```

---

## 📊 Learning Profile

```javascript
// Get Full Profile ✅
await learningProfileAPI.getProfile();

// Get Quick Summary ✅
await learningProfileAPI.getQuickSummary();

// Get Trends ✅
await learningProfileAPI.getTrends("month"); // week|month|quarter

// Get Dashboard ✅
await learningProfileAPI.getDashboard();
```

---

## 📚 Resources

```javascript
// Get Resources
await resourcesAPI.getResources({ category: "tutorial", limit: 10 });

// Search Resources
await resourcesAPI.searchResources("React hooks");

// Add Resource
await resourcesAPI.addResource({ title, url, type });
```

---

## 🏥 Utility

```javascript
// Welcome Message
await utilityAPI.getWelcome();

// Health Check
await utilityAPI.healthCheck();
```

---

## 💡 Quick Example

```javascript
import { learningProfileAPI } from "../lib/api";

function Dashboard() {
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await learningProfileAPI.getDashboard();
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    loadData();
  }, []);
}
```

---

## 🔑 Auth Status

| Symbol | Meaning                    |
| ------ | -------------------------- |
| ✅     | Authentication Required    |
| ❌     | No Authentication Required |
| ⚠️     | Authentication Optional    |

---

## 🌐 Environment

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📍 Access Points

- **App**: http://localhost:5174/
- **API Examples**: http://localhost:5174/api-examples
- **Quiz**: http://localhost:5174/attempt-quiz/:topic

---

**Print this for quick reference!** 📄
