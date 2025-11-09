# Quiz System Architecture

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                   (React + Vite)                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Quiz Management Page                       │   │
│  │                                                       │   │
│  │  [Create] [Saved Quizzes] [Results]                  │   │
│  │                                                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐              │   │
│  │  │ Quiz 1  │  │ Quiz 2  │  │ Quiz 3  │              │   │
│  │  │ ┌─────┐ │  │ ┌─────┐ │  │ ┌─────┐ │              │   │
│  │  │ │EASY │ │  │ │MED. │ │  │ │HARD │ │              │   │
│  │  │ └─────┘ │  │ └─────┘ │  │ └─────┘ │              │   │
│  │  │ Topic   │  │ Topic   │  │ Topic   │              │   │
│  │  │ [Start] │  │ [Start] │  │ [Start] │              │   │
│  │  └─────────┘  └─────────┘  └─────────┘              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Quiz Test Page                          │   │
│  │                                                       │   │
│  │  Timer: 05:00                    Question 1/10       │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━         │   │
│  │                                                       │   │
│  │  Question: What is JavaScript?                       │   │
│  │  ⭕ A) A programming language                        │   │
│  │  ⭕ B) A coffee type                                 │   │
│  │  ⭕ C) A car brand                                   │   │
│  │  ⭕ D) A game                                        │   │
│  │                                                       │   │
│  │  [Previous]              [Next]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ API Calls (quizAPI)
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐            ┌────────────────┐
│   Backend     │            │  localStorage  │
│   (Prisma)    │            │   (Fallback)   │
└───────┬───────┘            └────────────────┘
        │                             ▲
        │                             │
        ▼                             │
┌───────────────────────────┐        │
│    PostgreSQL/MySQL       │        │
│                           │        │
│  ┌─────────────────────┐ │        │
│  │     QuizSet         │ │        │
│  │  - id               │ │        │
│  │  - title            │ │        │
│  │  - topic            │ │        │
│  │  - difficulty       │ │        │
│  │  - userId           │ │        │
│  └─────────┬───────────┘ │        │
│            │             │        │
│  ┌─────────▼───────────┐ │        │
│  │   QuizQuestion      │ │        │
│  │  - id               │ │        │
│  │  - question         │ │        │
│  │  - options (JSON)   │ │        │
│  │  - answer           │ │        │
│  │  - order            │ │        │
│  │  - quizSetId        │ │        │
│  └─────────────────────┘ │        │
│                           │        │
│  ┌─────────────────────┐ │        │
│  │   QuizResult        │ │        │
│  │  - id               │ │        │
│  │  - score            │ │        │
│  │  - percentage       │ │        │
│  │  - timeTaken        │ │        │
│  │  - answers (JSON)   │ │        │
│  │  - userId           │ │        │
│  │  - quizSetId        │ │        │
│  └─────────────────────┘ │        │
│                           │        │
└───────────────────────────┘        │
        │                            │
        │ If Backend Unavailable     │
        └────────────────────────────┘
```

## 🔄 Data Flow

### 1. Quiz Generation Flow

```
User Input
    ↓
Generate Button Click
    ↓
POST /api/quiz/generate (AI Service)
    ↓
Receive Generated Questions
    ↓
Create Quiz Object
    ↓
├─→ Try POST /api/quiz/save-set (Backend)
│   ├─→ Success: Save to Prisma Database
│   └─→ Fail: Continue anyway
│
├─→ Save to localStorage (Always)
│
├─→ Update React State (Immediate UI Update)
│
└─→ Switch to "Saved Quizzes" Tab
```

### 2. Quiz Loading Flow

```
Page Load
    ↓
Try GET /api/quiz/sets (Backend)
    ↓
├─→ Success: Load from Database
│   └─→ Display in UI
│
└─→ Fail: Load from localStorage
    └─→ Display in UI
```

### 3. Quiz Taking Flow

```
Click "Start Quiz"
    ↓
Navigate to /quiz-test
    ↓
Pass Quiz Data via React Router State
    ↓
Display Questions with Timer
    ↓
User Answers Questions
    ↓
Click "Submit"
    ↓
Calculate Score
    ↓
Display Results
    ↓
POST /api/quiz/result (Save to Backend)
```

### 4. Quiz Deletion Flow

```
Click Delete Button
    ↓
Show Confirmation Dialog
    ↓
User Confirms
    ↓
├─→ Try DELETE /api/quiz/set/:id (Backend)
│   └─→ Log result (don't block on failure)
│
├─→ Remove from localStorage
│
└─→ Update React State (Immediate UI Update)
```

## 🎯 Component Hierarchy

```
App.jsx
└─ Routes
   ├─ QuizManagementPage
   │  ├─ Navbar
   │  ├─ Tabs (Create | Saved | Results)
   │  ├─ Create Tab
   │  │  └─ QuizForm
   │  ├─ Saved Tab
   │  │  └─ QuizCard[] (Grid)
   │  │     ├─ GradientHeader
   │  │     ├─ DifficultyBadge
   │  │     ├─ MetaInfo
   │  │     └─ ActionButtons
   │  └─ Results Tab
   │     └─ ResultsList
   │
   └─ QuizTest
      ├─ Timer
      ├─ ProgressBar
      ├─ QuestionDisplay
      ├─ AnswerOptions
      ├─ Navigation
      └─ ResultsScreen
```

## 📦 State Management

```javascript
// QuizManagementPage State
{
  activeTab: "create" | "saved" | "results",
  loading: boolean,
  error: string,
  success: string,
  quizzes: Quiz[],
  results: Result[],
  quizForm: {
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    numberOfQuestions: number
  }
}

// QuizTest State (from useLocation)
{
  quiz: Quiz,
  questions: Question[]
}

// localStorage
{
  "savedQuizzes": Quiz[],
  "authToken": string
}
```

## 🔐 Security Flow

```
Frontend Request
    ↓
Add Authorization Header
    ↓
Backend Middleware (authenticate)
    ↓
Verify JWT Token
    ↓
Extract User ID
    ↓
Attach to req.user
    ↓
Route Handler
    ↓
Check User Ownership (req.user.id === quiz.userId)
    ↓
Perform Action
    ↓
Return Response
```

## 🚀 API Endpoints Map

```
/api/quiz
├─ POST   /generate           → AI generates questions
├─ POST   /save-set           → Save quiz to Prisma
├─ GET    /sets               → Get all user's quizzes
├─ GET    /set/:id            → Get specific quiz
├─ PUT    /set/:id            → Update quiz
├─ DELETE /set/:id            → Delete quiz
├─ POST   /result             → Save quiz result
└─ GET    /results            → Get all results
```

## 💾 Storage Strategy

```
┌──────────────────────────────────────┐
│         Storage Decision Tree         │
└──────────────────────────────────────┘

Is Backend Available?
    ├─→ YES
    │   ├─→ Primary: Prisma Database
    │   └─→ Backup: localStorage
    │
    └─→ NO
        └─→ Fallback: localStorage Only

Benefits:
✅ Always works (offline/online)
✅ No data loss
✅ Automatic sync when backend available
✅ Cross-device sync (with backend)
✅ Fast local access (with localStorage)
```

## 🎨 UI Component Structure

```
QuizCard
├─ GradientHeader (bg-gradient-to-r from-blue-500 to-purple-600)
│  ├─ DifficultyBadge
│  ├─ QuestionCount
│  └─ Title
├─ ContentSection
│  ├─ TimeEstimate (Clock icon)
│  ├─ QuestionCount (Book icon)
│  └─ CreatedDate (Calendar icon)
└─ ActionSection
   ├─ StartButton (Primary gradient)
   ├─ PreviewButton (Gray)
   └─ DeleteButton (Red)
```

## 🔄 Real-time Updates

```
User Action → Update State → Update localStorage → Update Backend
                    ↓              ↓                     ↓
              Immediate UI    Persistent       Sync Across
                Update        Storage           Devices
```

---

**Note**: This architecture ensures the frontend works independently while gracefully integrating with the backend when available.
