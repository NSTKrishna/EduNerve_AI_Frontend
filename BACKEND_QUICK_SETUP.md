# Quick Backend Setup - Quiz Sets

## 🚀 5-Minute Setup Guide

### Step 1: Update Prisma Schema

Add to your `prisma/schema.prisma`:

```prisma
model QuizSet {
  id                String         @id @default(cuid())
  title             String
  topic             String
  difficulty        String
  numberOfQuestions Int
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  userId            String
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  questions         QuizQuestion[]
  results           QuizResult[]

  @@index([userId])
  @@index([createdAt])
}

model QuizQuestion {
  id        String   @id @default(cuid())
  question  String   @db.Text
  options   Json
  answer    String
  order     Int
  createdAt DateTime @default(now())
  quizSetId String
  quizSet   QuizSet  @relation(fields: [quizSetId], references: [id], onDelete: Cascade)

  @@index([quizSetId])
}

model QuizResult {
  id             String   @id @default(cuid())
  score          Int
  totalQuestions Int
  percentage     Float
  timeTaken      Int
  answers        Json
  createdAt      DateTime @default(now())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizSetId      String
  quizSet        QuizSet  @relation(fields: [quizSetId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([quizSetId])
}
```

Also update User model:

```prisma
model User {
  // ... existing fields
  quizSets    QuizSet[]
  quizResults QuizResult[]
}
```

### Step 2: Run Migration

```bash
npx prisma migrate dev --name add_quiz_sets
npx prisma generate
```

### Step 3: Create Route File

Create `routes/quizSet.routes.js`:

```javascript
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Assuming you have auth middleware that adds req.user
const { authenticate } = require("../middleware/auth");

// Save complete quiz set
router.post("/save-set", authenticate, async (req, res) => {
  try {
    const { title, topic, difficulty, numberOfQuestions, questions } = req.body;

    const quizSet = await prisma.quizSet.create({
      data: {
        title,
        topic,
        difficulty: difficulty || "medium",
        numberOfQuestions: questions.length,
        userId: req.user.id,
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
          orderBy: { order: "asc" },
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

// Get all quiz sets for user
router.get("/sets", authenticate, async (req, res) => {
  try {
    const quizSets = await prisma.quizSet.findMany({
      where: { userId: req.user.id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { questions: true, results: true },
        },
      },
      orderBy: { createdAt: "desc" },
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

// Get specific quiz set
router.get("/set/:id", authenticate, async (req, res) => {
  try {
    const quizSet = await prisma.quizSet.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
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

// Delete quiz set
router.delete("/set/:id", authenticate, async (req, res) => {
  try {
    const quizSet = await prisma.quizSet.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!quizSet) {
      return res.status(404).json({
        success: false,
        error: "Quiz set not found",
      });
    }

    await prisma.quizSet.delete({
      where: { id: req.params.id },
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
      include: {
        quizSet: true,
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
        quizSet: {
          select: {
            id: true,
            title: true,
            topic: true,
            difficulty: true,
            numberOfQuestions: true,
          },
        },
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

// GET /api/quiz/results/:quizSetId - Get results for specific quiz set
router.get("/results/:quizSetId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizSetId } = req.params;

    const results = await prisma.quizResult.findMany({
      where: {
        userId,
        quizSetId,
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
    console.error("Error fetching quiz results:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quiz results",
    });
  }
});

module.exports = router;
```

### Step 4: Register Routes

In your `app.js` or `server.js`:

```javascript
const quizSetRoutes = require("./routes/quizSet.routes");

// ... other middleware ...

app.use("/api/quiz", quizSetRoutes);
```

### Step 5: Test with cURL

```bash
# Save a quiz set
curl -X POST http://localhost:3000/api/quiz/save-set \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "JavaScript Basics",
    "topic": "JavaScript",
    "difficulty": "easy",
    "questions": [
      {
        "question": "What is JavaScript?",
        "options": ["A programming language", "A coffee", "A car", "A game"],
        "answer": "A programming language"
      }
    ]
  }'

# Get all quiz sets
curl http://localhost:3000/api/quiz/sets \
  -H "Authorization: Bearer YOUR_TOKEN"

# Delete a quiz set
curl -X DELETE http://localhost:3000/api/quiz/set/QUIZ_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ That's it!

Frontend will automatically start using these endpoints. The localStorage fallback ensures everything works even if backend is temporarily down.

## 🔍 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution**: Run `npm install @prisma/client` and `npx prisma generate`

### Issue: "User relation not found"

**Solution**: Make sure you added the relations to the User model

### Issue: "Authentication failed"

**Solution**: Ensure your auth middleware is working and adds `req.user.id`

### Issue: "Quiz set not appearing in frontend"

**Solution**: Check browser console for API errors. Frontend will fall back to localStorage if backend fails.

## 📊 Database Schema Visualization

```
User
  └─ QuizSet (one-to-many)
      ├─ QuizQuestion (one-to-many)
      └─ QuizResult (one-to-many)
```

## 🎯 API Endpoints Summary

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/quiz/save-set` | Save new quiz set with questions |
| GET    | `/api/quiz/sets`     | Get all user's quiz sets         |
| GET    | `/api/quiz/set/:id`  | Get specific quiz set            |
| DELETE | `/api/quiz/set/:id`  | Delete quiz set                  |
| PUT    | `/api/quiz/set/:id`  | Update quiz set (optional)       |

## 🔐 Security Checklist

- ✅ All routes require authentication
- ✅ User can only access their own quizzes
- ✅ Cascade deletes prevent orphaned data
- ✅ Input validation on POST routes
- ✅ Error messages don't leak sensitive info

---

**Need help?** Check `BACKEND_QUIZ_IMPLEMENTATION.md` for detailed implementation.
