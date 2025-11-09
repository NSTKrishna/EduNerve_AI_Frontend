# Quiz Component Documentation

## Overview

A comprehensive quiz component (`Quiz.jsx`) has been added to your EduNerve AI Frontend application. Users can now attempt interactive quizzes with a full-featured quiz-taking experience.

## File Location

- **Component**: `/src/pages/Quiz.jsx`
- **Route**: `/attempt-quiz/:topic`

## Features

### 1. **Quiz Introduction Screen**

- Shows quiz overview with total questions and estimated time
- Displays quiz instructions
- Start button to begin the quiz

### 2. **Interactive Quiz Taking**

- Question navigation (Next/Previous buttons)
- Real-time progress tracking
- Visual progress bar
- Timer showing elapsed time
- Question navigator grid to jump to any question
- Answer selection with visual feedback
- Tracks answered vs unanswered questions
- Submit button (enabled only when all questions are answered)

### 3. **Results Screen**

- Score display (correct/total)
- Percentage score
- Performance level (Expert, Intermediate, Beginner, Needs Improvement)
- Time taken to complete quiz
- **Detailed Question Review** showing:
  - Each question
  - User's answer
  - Correct answer
  - Visual indicators (✓ for correct, ✗ for incorrect)
- Options to:
  - Retake quiz
  - Return to Quiz Hub
  - Go to Dashboard

### 4. **Data Integration**

- Fetches questions from API endpoint: `/api/quiz/generate`
- Falls back to sample questions if API fails
- Saves quiz results to user profile via `completeQuiz()` function
- Uses `UseLearner` context for state management

## How to Use

### For Users:

1. Navigate to `/attempt-quiz/:topic` (replace `:topic` with the quiz subject)

   - Example: `/attempt-quiz/JavaScript`
   - Example: `/attempt-quiz/Data%20Structures`

2. Read the quiz introduction and click "Start Quiz"

3. Answer questions by clicking on options

4. Navigate between questions using Next/Previous or the question navigator

5. Submit when all questions are answered

6. Review your results and performance

### For Developers:

#### Accessing the Quiz:

```jsx
// In your component:
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to quiz
navigate(`/attempt-quiz/${topicName}`);
```

#### Example from Quiz Hub:

```jsx
<Button onClick={() => navigate(`/attempt-quiz/JavaScript`)}>
  Take JavaScript Quiz
</Button>
```

## API Integration

### Required Endpoint:

```
POST /api/quiz/generate
```

**Request Body:**

```json
{
  "prompt": "JavaScript",
  "numberOfQuestions": 10
}
```

**Expected Response:**

```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "What is JavaScript?",
      "options": ["Language", "Framework", "Library", "Database"],
      "correctAnswer": 0
    }
  ]
}
```

## Customization

### Modify Number of Questions:

In `Quiz.jsx`, line ~46:

```javascript
numberOfQuestions: 10; // Change this value
```

### Modify Performance Levels:

In `Quiz.jsx`, lines ~190-195:

```javascript
const getPerformanceLevel = () => {
  const percentage = getPercentage();
  if (percentage >= 80) return { label: "Expert", ... };
  if (percentage >= 60) return { label: "Intermediate", ... };
  // Modify thresholds and labels here
};
```

### Fallback Questions:

The `getSampleQuestions()` function (lines ~79-107) provides fallback questions when API is unavailable. Customize these as needed.

## Styling

- Uses Tailwind CSS classes
- Supports dark mode via your existing design system
- Responsive design (mobile-friendly)
- Matches your app's color scheme (primary, muted, foreground, etc.)

## State Management

- Uses React hooks (`useState`, `useEffect`)
- Integrates with `UseLearner` context for:
  - `completeQuiz()` - Saves quiz results
  - User authentication
  - Profile updates

## Routes Added

### In `App.jsx`:

```jsx
<Route
  path="/attempt-quiz/:topic"
  element={
    <PrivateRoute>
      <Quiz />
    </PrivateRoute>
  }
/>
```

## Components Used

- **Navbar** - Top navigation
- **Button** - Custom button component
- **Icons** - lucide-react (CheckCircle2, XCircle, Clock, Award, BookOpen)

## Future Enhancements

Consider adding:

1. Timed quizzes (countdown timer)
2. Question categories/filtering
3. Difficulty levels
4. Hints or explanations for each question
5. Quiz history and analytics
6. Social sharing of results
7. Leaderboards
8. Multiple quiz formats (true/false, fill-in-blank)
9. Image/video questions
10. Quiz bookmarking

## Testing

Visit: `http://localhost:5176/attempt-quiz/Programming`

## Support

For issues or questions, check:

- Browser console for errors
- Network tab for API calls
- Ensure backend `/api/quiz/generate` endpoint is running

---

**Status**: ✅ **Fully Integrated and Ready to Use!**

The quiz component is now live at `http://localhost:5176/attempt-quiz/:topic`
