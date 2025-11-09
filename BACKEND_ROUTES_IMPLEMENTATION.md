# Backend Implementation - Quiz Routes

## 🚨 Missing Backend Endpoints

The frontend is calling these endpoints that need to be implemented in your backend:

```
POST   /api/quiz/generate      ✅ (Already exists - AI generation)
POST   /api/quiz/save-set      ❌ (Need to implement)
GET    /api/quiz/sets          ❌ (Need to implement)
GET    /api/quiz/set/:id       ❌ (Need to implement)
DELETE /api/quiz/set/:id       ❌ (Need to implement)
POST   /api/quiz/result        ❌ (Need to implement)
GET    /api/quiz/results       ❌ (Need to implement)
```

---

## 📝 Step-by-Step Backend Implementation

### Step 1: Create Quiz Route File

Create `routes/quizSet.routes.js` in your backend:

```javascript
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import your authentication middleware
const { authenticate } = require("../middleware/auth"); // Adjust path as needed

// ============================================
// POST /api/quiz/save-set
// Save a complete quiz set with all questions
// ============================================
router.post("/save-set", authenticate, async (req, res) => {
  try {
    const { title, topic, difficulty, numberOfQuestions, questions } = req.body;
    const userId = req.user.id;

    console.log("📝 Saving quiz set for user:", userId);
    console.log("📊 Quiz data:", {
      title,
      topic,
      difficulty,
      questionCount: questions?.length,
    });

    // Validate required fields
    if (!title || !topic || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, topic, questions (array)",
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Questions array cannot be empty",
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
            options: q.options, // JSON array
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

    console.log("✅ Quiz set created with ID:", quizSet.id);

    res.json({
      success: true,
      message: "Quiz set saved successfully",
      quizSet,
    });
  } catch (error) {
    console.error("❌ Error saving quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save quiz set",
      details: error.message,
    });
  }
});

// ============================================
// GET /api/quiz/sets
// Get all quiz sets for the authenticated user
// ============================================
router.get("/sets", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("📚 Fetching quiz sets for user:", userId);

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

    console.log(`✅ Found ${quizSets.length} quiz sets`);

    res.json({
      success: true,
      quizSets,
    });
  } catch (error) {
    console.error("❌ Error fetching quiz sets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quiz sets",
      details: error.message,
    });
  }
});

// ============================================
// GET /api/quiz/set/:id
// Get a specific quiz set with all questions
// ============================================
router.get("/set/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log("🔍 Fetching quiz set:", id, "for user:", userId);

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
        error: "Quiz set not found or access denied",
      });
    }

    console.log(
      "✅ Quiz set found with",
      quizSet.questions.length,
      "questions"
    );

    res.json({
      success: true,
      quizSet,
    });
  } catch (error) {
    console.error("❌ Error fetching quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch quiz set",
      details: error.message,
    });
  }
});

// ============================================
// DELETE /api/quiz/set/:id
// Delete a quiz set and all its questions
// ============================================
router.delete("/set/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log("🗑️ Deleting quiz set:", id, "for user:", userId);

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
        error: "Quiz set not found or access denied",
      });
    }

    // Delete quiz set (cascade will delete questions and results)
    await prisma.quizSet.delete({
      where: {
        id,
      },
    });

    console.log("✅ Quiz set deleted successfully");

    res.json({
      success: true,
      message: "Quiz set deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting quiz set:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete quiz set",
      details: error.message,
    });
  }
});

// ============================================
// POST /api/quiz/result
// Save quiz attempt result
// ============================================
router.post("/result", authenticate, async (req, res) => {
  try {
    const { quizSetId, score, totalQuestions, percentage, timeTaken, answers } =
      req.body;
    const userId = req.user.id;

    console.log("💾 Saving quiz result for user:", userId);
    console.log("📊 Result data:", {
      quizSetId,
      score,
      totalQuestions,
      percentage,
    });

    // Validate required fields
    if (!quizSetId || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: quizSetId, score, totalQuestions",
      });
    }

    const result = await prisma.quizResult.create({
      data: {
        userId,
        quizSetId,
        score,
        totalQuestions,
        percentage: percentage || (score / totalQuestions) * 100,
        timeTaken: timeTaken || 0,
        answers: answers || [],
      },
      include: {
        quizSet: {
          select: {
            id: true,
            title: true,
            topic: true,
            difficulty: true,
          },
        },
      },
    });

    console.log("✅ Result saved with ID:", result.id);

    res.json({
      success: true,
      message: "Result saved successfully",
      result,
    });
  } catch (error) {
    console.error("❌ Error saving result:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save result",
      details: error.message,
    });
  }
});

// ============================================
// GET /api/quiz/results
// Get all quiz results for user
// ============================================
router.get("/results", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("📊 Fetching results for user:", userId);

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

    console.log(`✅ Found ${results.length} results`);

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch results",
      details: error.message,
    });
  }
});

module.exports = router;
```

---

### Step 2: Register Routes in Main App

In your `app.js` or `server.js` or `index.js`:

```javascript
const express = require("express");
const app = express();

// ... other imports and middleware ...

// Import quiz routes
const quizSetRoutes = require("./routes/quizSet.routes");

// Register routes
app.use("/api/quiz", quizSetRoutes);

// ... rest of your app ...
```

---

### Step 3: Verify Prisma Schema

Make sure your `schema.prisma` has these models:

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
  options   Json     // Array of options
  answer    String   // Correct answer
  order     Int      // Question order
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

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizSetId String
  quizSet   QuizSet  @relation(fields: [quizSetId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([quizSetId])
}

// Update User model to add relations
model User {
  // ... existing fields ...
  quizSets    QuizSet[]
  quizResults QuizResult[]
}
```

---

### Step 4: Run Prisma Migration

```bash
cd backend
npx prisma migrate dev --name add_quiz_sets
npx prisma generate
```

---

### Step 5: Test Endpoints

Use these cURL commands to test:

```bash
# 1. Save a quiz set
curl -X POST http://localhost:3000/api/quiz/save-set \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "JavaScript Basics",
    "topic": "JavaScript",
    "difficulty": "easy",
    "numberOfQuestions": 2,
    "questions": [
      {
        "question": "What is JavaScript?",
        "options": ["A programming language", "A coffee type", "A car brand", "A game"],
        "answer": "A programming language"
      },
      {
        "question": "What does JS stand for?",
        "options": ["JavaScript", "JavaSource", "JustScript", "None"],
        "answer": "JavaScript"
      }
    ]
  }'

# 2. Get all quiz sets
curl http://localhost:3000/api/quiz/sets \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Get specific quiz set
curl http://localhost:3000/api/quiz/set/QUIZ_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Delete quiz set
curl -X DELETE http://localhost:3000/api/quiz/set/QUIZ_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Quick Fix Checklist

- [ ] Create `routes/quizSet.routes.js` file
- [ ] Copy route code above
- [ ] Register routes in main app file
- [ ] Update Prisma schema if needed
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npx prisma generate`
- [ ] Restart backend server
- [ ] Test with frontend

---

## 🐛 Troubleshooting

### "Route /api/quiz/sets not found"

**Cause**: Routes not registered in main app
**Solution**: Check `app.use('/api/quiz', quizSetRoutes)`

### "Table 'QuizSet' does not exist"

**Cause**: Prisma migrations not run
**Solution**: Run `npx prisma migrate dev`

### "Cannot find module @prisma/client"

**Cause**: Prisma client not installed
**Solution**: Run `npm install @prisma/client` and `npx prisma generate`

### "User relation not found"

**Cause**: User model missing quiz relations
**Solution**: Add `quizSets QuizSet[]` to User model

---

## 📊 Expected Response Formats

### GET /api/quiz/sets

```json
{
  "success": true,
  "quizSets": [
    {
      "id": "clxxx...",
      "title": "JavaScript Basics",
      "topic": "JavaScript",
      "difficulty": "easy",
      "numberOfQuestions": 5,
      "createdAt": "2024-11-09T...",
      "questions": [
        {
          "id": "clyyy...",
          "question": "What is JavaScript?",
          "options": ["A", "B", "C", "D"],
          "answer": "A",
          "order": 0
        }
      ],
      "_count": {
        "questions": 5,
        "results": 2
      }
    }
  ]
}
```

### POST /api/quiz/save-set

```json
{
  "success": true,
  "message": "Quiz set saved successfully",
  "quizSet": {
    "id": "clxxx...",
    "title": "JavaScript Basics",
    ...
  }
}
```

---

**Once implemented, the frontend will automatically work with these endpoints!**
