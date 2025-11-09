# Backend Quiz Set Implementation Guide

## Overview

This document provides the complete backend implementation needed to support quiz sets (quizzes with multiple questions) in your Prisma database.

## 1. Prisma Schema Changes

Add these models to your `schema.prisma` file:

```prisma
// QuizSet - Represents a complete quiz with metadata
model QuizSet {
  id                String      @id @default(cuid())
  title             String
  topic             String
  difficulty        String      // 'easy', 'medium', 'hard'
  numberOfQuestions Int
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  userId            String
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  questions         QuizQuestion[]
  results           QuizResult[]

  @@index([userId])
  @@index([createdAt])
}

// QuizQuestion - Individual questions belonging to a quiz set
model QuizQuestion {
  id         String   @id @default(cuid())
  question   String   @db.Text
  options    Json     // Array of strings: ["A", "B", "C", "D"]
  answer     String   // Correct answer: "A", "B", "C", or "D"
  order      Int      // Question order in the quiz (0, 1, 2...)
  createdAt  DateTime @default(now())

  // Relations
  quizSetId  String
  quizSet    QuizSet  @relation(fields: [quizSetId], references: [id], onDelete: Cascade)

  @@index([quizSetId])
}

// QuizResult - Store user's quiz attempt results
model QuizResult {
  id          String   @id @default(cuid())
  score       Int
  totalQuestions Int
  percentage  Float
  timeTaken   Int      // in seconds
  answers     Json     // Array of user's answers
  createdAt   DateTime @default(now())

  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizSetId   String
  quizSet     QuizSet  @relation(fields: [quizSetId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([quizSetId])
}

// Add to User model
model User {
  // ... existing fields ...
  quizSets    QuizSet[]
  quizResults QuizResult[]
}
```

## 2. Run Prisma Migrations

```bash
npx prisma migrate dev --name add_quiz_sets
npx prisma generate
```

## 3. Backend API Routes

Create these routes in your Express backend:

### File: `routes/quiz.routes.js`

```javascript
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticate } = require("../middleware/auth"); // Your auth middleware

// POST /api/quiz/save-set - Save a complete quiz set with all questions
router.post("/save-set", authenticate, async (req, res) => {
  try {
    const { title, topic, difficulty, numberOfQuestions, questions } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate input
    if (!title || !topic || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, topic, questions",
      });
    }

    // Create quiz set with questions in a transaction
    const quizSet = await prisma.quizSet.create({
      data: {
        title,
        topic,
        difficulty: difficulty || "medium",
        numberOfQuestions: questions.length,
        userId,
        questions: {
          create: questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            answer: q.answer,
            order: index,
          })),
        },
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Quiz set saved successfully",
      quizSet,
    });
  } catch (error) {
    console.error("Error saving quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save quiz set",
    });
  }
});

// GET /api/quiz/sets - Get all quiz sets for the authenticated user
router.get("/sets", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const quizSets = await prisma.quizSet.findMany({
      where: {
        userId,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            questions: true,
            results: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      quizSets,
    });
  } catch (error) {
    console.error("Error fetching quiz sets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quiz sets",
    });
  }
});

// GET /api/quiz/set/:id - Get a specific quiz set with all questions
router.get("/set/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const quizSet = await prisma.quizSet.findFirst({
      where: {
        id,
        userId, // Ensure user owns this quiz
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!quizSet) {
      return res.status(404).json({
        success: false,
        error: "Quiz set not found",
      });
    }

    res.json({
      success: true,
      quizSet,
    });
  } catch (error) {
    console.error("Error fetching quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quiz set",
    });
  }
});

// DELETE /api/quiz/set/:id - Delete a quiz set
router.delete("/set/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if quiz belongs to user
    const quizSet = await prisma.quizSet.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!quizSet) {
      return res.status(404).json({
        success: false,
        error: "Quiz set not found",
      });
    }

    // Delete quiz set (cascade will delete questions and results)
    await prisma.quizSet.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Quiz set deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete quiz set",
    });
  }
});

// PUT /api/quiz/set/:id - Update a quiz set
router.put("/set/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, topic, difficulty } = req.body;

    // Check if quiz belongs to user
    const existingQuiz = await prisma.quizSet.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingQuiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz set not found",
      });
    }

    // Update quiz set
    const updatedQuiz = await prisma.quizSet.update({
      where: {
        id,
      },
      data: {
        title,
        topic,
        difficulty,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Quiz set updated successfully",
      quizSet: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update quiz set",
    });
  }
});

// POST /api/quiz/result - Save quiz attempt result
router.post("/result", authenticate, async (req, res) => {
  try {
    const { quizSetId, score, totalQuestions, percentage, timeTaken, answers } =
      req.body;
    const userId = req.user.id;

    const result = await prisma.quizResult.create({
      data: {
        userId,
        quizSetId,
        score,
        totalQuestions,
        percentage,
        timeTaken,
        answers,
      },
    });

    res.json({
      success: true,
      message: "Result saved successfully",
      result,
    });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save result",
    });
  }
});

// GET /api/quiz/results - Get all quiz results for user
router.get("/results", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await prisma.quizResult.findMany({
      where: {
        userId,
      },
      include: {
        quizSet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch results",
    });
  }
});

module.exports = router;
```

## 4. Register Routes in Main App

In your `app.js` or `server.js`:

```javascript
const quizRoutes = require("./routes/quiz.routes");

// ... other middleware ...

app.use("/api/quiz", quizRoutes);
```

## 5. Testing the API

### Save a Quiz Set

```bash
POST http://localhost:3000/api/quiz/save-set
Headers: Authorization: Bearer <token>
Body:
{
  "title": "JavaScript Basics",
  "topic": "JavaScript",
  "difficulty": "easy",
  "numberOfQuestions": 5,
  "questions": [
    {
      "question": "What is JavaScript?",
      "options": ["A programming language", "A coffee type", "A car brand", "A game"],
      "answer": "A"
    },
    // ... more questions
  ]
}
```

### Get All Quiz Sets

```bash
GET http://localhost:3000/api/quiz/sets
Headers: Authorization: Bearer <token>
```

### Get Specific Quiz Set

```bash
GET http://localhost:3000/api/quiz/set/:id
Headers: Authorization: Bearer <token>
```

### Delete Quiz Set

```bash
DELETE http://localhost:3000/api/quiz/set/:id
Headers: Authorization: Bearer <token>
```

## 6. Frontend Integration

The frontend is already configured to use these endpoints:

- `quizAPI.saveQuizSet(quizData)` - Saves to `/api/quiz/save-set`
- `quizAPI.getAllQuizSets()` - Fetches from `/api/quiz/sets`
- `quizAPI.getQuizSetById(id)` - Fetches from `/api/quiz/set/:id`
- `quizAPI.deleteQuizSet(id)` - Deletes via `/api/quiz/set/:id`

## 7. Data Flow

1. **Generate Quiz** → Frontend calls `/api/quiz/generate` (AI generation)
2. **Save Quiz** → Frontend calls `/api/quiz/save-set` with generated questions
3. **Load Quizzes** → Frontend calls `/api/quiz/sets` on page load
4. **Take Quiz** → User takes quiz in frontend
5. **Save Result** → Frontend calls `/api/quiz/result` with score and answers
6. **View Results** → Frontend calls `/api/quiz/results` to show history

## 8. Migration Notes

- The old `Quiz` table (individual questions) can coexist with the new structure
- Gradually migrate old data to new `QuizSet` structure if needed
- Or keep both for backward compatibility

## 9. Security Considerations

- All routes are protected with `authenticate` middleware
- Users can only access their own quiz sets (userId check)
- Cascade deletes ensure no orphaned data
- Input validation on all POST/PUT routes

## 10. Performance Optimization

```javascript
// Add indexes for better query performance
@@index([userId, createdAt])
@@index([quizSetId, userId])
```

Already included in the schema above.

---

## Quick Start Checklist

- [ ] Copy Prisma schema changes to `schema.prisma`
- [ ] Run `npx prisma migrate dev --name add_quiz_sets`
- [ ] Run `npx prisma generate`
- [ ] Create `routes/quiz.routes.js` with the code above
- [ ] Register routes in `app.js`
- [ ] Test endpoints with Postman or Thunder Client
- [ ] Frontend will automatically start using the new endpoints

## Frontend Status

✅ Frontend is already configured and ready
✅ UI for saved quizzes is complete
✅ API calls are implemented
✅ LocalStorage fallback is in place
✅ Once backend is deployed, switch will be automatic
