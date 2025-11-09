# 🎯 Quiz System - User Flow Diagram

## Visual User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         QUIZ SYSTEM FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ Navigate to /quiz-management
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      QUIZ MANAGEMENT HUB                             │
│  ┌───────────┬───────────────┬─────────────┐                        │
│  │  CREATE   │ SAVED QUIZZES │ MY RESULTS  │                        │
│  └───────────┴───────────────┴─────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
  │         │              │
  │         │              └──→ View Results History
  │         │                    │
  │         │                    ├─→ See Scores
  │         │                    ├─→ See Percentages
  │         │                    └─→ See Completion Dates
  │         │
  │         └──────────→ Browse Saved Quizzes
  │                       │
  │                       ├─→ View Quiz Details
  │                       │    │
  │                       │    ├─→ /quiz/:quizId/view (Preview)
  │                       │    │    │
  │                       │    │    ├─→ See Questions
  │                       │    │    ├─→ See Answers
  │                       │    │    ├─→ Read Explanations
  │                       │    │    ├─→ Start Quiz OR
  │                       │    │    └─→ Delete Quiz
  │                       │    │
  │                       │    └─→ Start Quiz
  │                       │         │
  │                       │         └─→ GO TO QUIZ TAKING ───┐
  │                       │                                   │
  │                       └─→ Delete Quiz                     │
  │                            │                              │
  │                            └─→ Confirmation Dialog        │
  │                                 │                         │
  │                                 ├─→ Cancel               │
  │                                 └─→ Confirm Delete        │
  │                                                           │
  ▼                                                           │
CREATE NEW QUIZ                                              │
  │                                                           │
  ├─→ Enter Topic                                            │
  ├─→ Select Difficulty (Easy/Medium/Hard)                   │
  ├─→ Choose Questions (5-20)                                │
  └─→ Click "Generate Quiz"                                  │
       │                                                      │
       ├─→ API Call: POST /api/generate-quiz                 │
       │    │                                                 │
       │    ├─→ Success: Quiz Generated                      │
       │    │    │                                            │
       │    │    ├─→ API Call: POST /api/quizzes (Save)      │
       │    │    │    │                                       │
       │    │    │    └─→ Success: Quiz Saved                │
       │    │    │         │                                  │
       │    │    │         └─→ Redirect to Quiz Taking ──────┤
       │    │    │                                            │
       │    │    └─→ Error: Show Error Message               │
       │    │                                                 │
       │    └─→ Error: Show Error Message                    │
       │                                                      │
       ▼                                                      │
  ┌──────────────────────────────────────────────────┐      │
  │           QUIZ TAKING PAGE                       │◄─────┘
  │           /quiz/:quizId                          │
  └──────────────────────────────────────────────────┘
       │
       ├─→ Load Quiz: GET /api/quizzes/:id
       │    │
       │    └─→ Display Quiz Header
       │         ├─→ Topic
       │         ├─→ Difficulty
       │         ├─→ Timer (00:00)
       │         └─→ Progress Bar
       │
       ├─→ Display Question
       │    │
       │    ├─→ Question Text
       │    ├─→ 4 Options (Radio Buttons)
       │    └─→ Answer Selection
       │         │
       │         └─→ Save Answer to State
       │
       ├─→ Navigation
       │    │
       │    ├─→ Previous Button
       │    │    └─→ Go to Previous Question
       │    │
       │    ├─→ Next Button
       │    │    └─→ Go to Next Question
       │    │
       │    └─→ Question Number Grid
       │         ├─→ Blue = Current
       │         ├─→ Green = Answered
       │         └─→ Gray = Not Answered
       │
       └─→ Submit Quiz (Last Question)
            │
            ├─→ Confirmation Dialog
            │    │
            │    ├─→ Cancel
            │    │
            │    └─→ Confirm
            │         │
            │         ├─→ Calculate Score
            │         │    │
            │         │    ├─→ Count Correct Answers
            │         │    ├─→ Calculate Percentage
            │         │    └─→ Determine Performance Level
            │         │
            │         ├─→ Save Result: POST /api/quiz-results
            │         │    │
            │         │    └─→ Success
            │         │
            │         └─→ Show Results Screen
            │
            ▼
  ┌──────────────────────────────────────────────────┐
  │              RESULTS SCREEN                       │
  └──────────────────────────────────────────────────┘
       │
       ├─→ Score Display
       │    │
       │    ├─→ Correct/Total (8/10)
       │    ├─→ Percentage (80%)
       │    └─→ Performance Level (Good)
       │
       ├─→ Time Taken (02:45)
       │
       ├─→ Answer Review
       │    │
       │    └─→ For Each Question:
       │         │
       │         ├─→ Question Text
       │         ├─→ Your Answer (Highlighted)
       │         ├─→ Correct Answer (Highlighted)
       │         ├─→ ✓ or ✗ Icon
       │         └─→ Explanation
       │
       └─→ Actions
            │
            ├─→ Retake Quiz
            │    └─→ Reload Page
            │
            └─→ Back to Quizzes
                 └─→ Navigate to /quiz-management

END
```

## 📊 State Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT                          │
└─────────────────────────────────────────────────────────────────┘

Quiz Management Page State:
├─ activeTab: "create" | "saved" | "results"
├─ quizzes: Array<Quiz>
├─ results: Array<QuizResult>
├─ quizForm: { topic, difficulty, numberOfQuestions }
├─ loading: boolean
└─ error: string

Quiz Taking Page State:
├─ quiz: Quiz | null
├─ currentQuestion: number (0 to N-1)
├─ answers: { [questionIndex]: selectedAnswer }
├─ showResults: boolean
├─ timeElapsed: number (seconds)
├─ loading: boolean
└─ error: string

Quiz View Page State:
├─ quiz: Quiz | null
├─ loading: boolean
└─ error: string
```

## 🔄 API Call Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                      API CALL FLOW                               │
└─────────────────────────────────────────────────────────────────┘

CREATE QUIZ:
1. User fills form
2. POST /api/generate-quiz
   ├─ Request: { topic, difficulty, numberOfQuestions }
   └─ Response: { success, quiz: [questions] }
3. POST /api/quizzes
   ├─ Request: { topic, difficulty, questions }
   └─ Response: { success, quiz: { _id, ...data } }
4. Navigate to /quiz/:quizId

LOAD SAVED QUIZZES:
1. Component mounts
2. GET /api/quizzes?userId=xxx
   └─ Response: { success, quizzes: [quiz1, quiz2, ...] }
3. Display in grid

TAKE QUIZ:
1. Component mounts
2. GET /api/quizzes/:id
   └─ Response: { success, quiz: { ...data, questions: [...] } }
3. User answers questions
4. Submit quiz
5. POST /api/quiz-results
   ├─ Request: { quizId, userId, score, answers: [...] }
   └─ Response: { success, result: { ...data } }
6. Show results

VIEW RESULTS:
1. Component mounts
2. GET /api/quiz-results?userId=xxx
   └─ Response: { success, results: [result1, result2, ...] }
3. Display results list

DELETE QUIZ:
1. User clicks delete
2. Confirmation dialog
3. DELETE /api/quizzes/:id
   └─ Response: { success, message }
4. Refresh quiz list
```

## 🎨 UI State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                     UI STATE DIAGRAM                             │
└─────────────────────────────────────────────────────────────────┘

QUIZ TAKING PAGE:

Initial State
     │
     ├─→ loading = true
     │    │
     │    └─→ Show Loading Spinner
     │
     ├─→ Fetch Quiz
     │    │
     │    ├─→ Success
     │    │    │
     │    │    ├─→ loading = false
     │    │    ├─→ quiz = data
     │    │    └─→ Show Quiz Interface
     │    │
     │    └─→ Error
     │         │
     │         ├─→ loading = false
     │         ├─→ error = message
     │         └─→ Show Error Screen
     │
     ├─→ Answer Questions
     │    │
     │    └─→ Update answers state
     │         └─→ Update UI (green indicators)
     │
     └─→ Submit Quiz
          │
          ├─→ loading = true
          │    └─→ Disable submit button
          │
          ├─→ Save Result
          │    │
          │    ├─→ Success
          │    │    │
          │    │    ├─→ loading = false
          │    │    ├─→ showResults = true
          │    │    └─→ Render Results Screen
          │    │
          │    └─→ Error
          │         │
          │         ├─→ loading = false
          │         ├─→ error = message
          │         └─→ Show Error Alert
          │
          └─→ Results Screen
               │
               ├─→ View Answers
               │
               ├─→ Retake Quiz
               │    └─→ Reload Page
               │
               └─→ Back to Management
                    └─→ Navigate Away
```

## 📱 Responsive Layout Changes

```
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONSIVE BREAKPOINTS                         │
└─────────────────────────────────────────────────────────────────┘

MOBILE (< 768px):
├─ Quiz cards: 1 column
├─ Tab navigation: Stacked
├─ Question options: Full width
├─ Navigation buttons: Full width
└─ Question grid: Compact (smaller buttons)

TABLET (768px - 1024px):
├─ Quiz cards: 2 columns
├─ Tab navigation: Horizontal
├─ Question options: Full width
├─ Navigation buttons: Inline
└─ Question grid: Normal

DESKTOP (> 1024px):
├─ Quiz cards: 3 columns
├─ Tab navigation: Horizontal with icons
├─ Question options: Standard
├─ Navigation buttons: Inline with spacing
└─ Question grid: Full size with hover effects
```

## 🎯 Success Indicators

```
VISUAL FEEDBACK:

Create Quiz:
├─ Loading: Spinner + "Generating Quiz..."
├─ Success: Green alert + Auto-redirect
└─ Error: Red alert with message

Answer Question:
├─ Unselected: Gray border
├─ Selected: Blue border + Blue background
└─ Answered (in grid): Green number

Submit Quiz:
├─ Confirming: Modal dialog
├─ Submitting: Spinner + "Submitting..."
└─ Complete: Results screen

Results Display:
├─ Correct Answer: Green border + ✓ icon
├─ Wrong Answer: Red border + ✗ icon
└─ Performance: Color-coded badge
     ├─ Excellent: Green
     ├─ Good: Blue
     ├─ Average: Yellow
     └─ Needs Improvement: Red
```

## 🔄 Error Recovery Flow

```
ERROR HANDLING:

Network Error:
├─ Detect: fetch fails
├─ Log: Console error
├─ Display: User-friendly message
│   └─ "Cannot connect to server. Please check your connection."
└─ Action: Retry button or back navigation

API Error:
├─ Detect: HTTP status code (400, 404, 500)
├─ Parse: Response error message
├─ Display: Specific error message
└─ Action: Based on error type
     ├─ 404: "Quiz not found" → Back to management
     ├─ 401: "Unauthorized" → Redirect to login
     └─ 500: "Server error" → Retry option

Validation Error:
├─ Detect: Form validation
├─ Prevent: Submit disabled if invalid
└─ Guide: Inline error messages
```

---

**This comprehensive flow diagram shows every possible path through the quiz system!**

Use this as a reference for:
- Understanding user journeys
- Debugging issues
- Planning new features
- Testing workflows

Happy Learning! 🎓
