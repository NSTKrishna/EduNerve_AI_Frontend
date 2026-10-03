# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Early-career candidates preparing for software interviews on their own: students,
freshers, and engineers with up to roughly three years of experience. The user
signs up themselves, practices alone, and is usually working toward a specific
upcoming interview. Access is self-serve — the individual chooses the product and
pays for it; there is no institution or admin between them and the app.

Settings offers a wider experience range (Student / Fresher, 0–1, 1–3, 3–5, 5+
years), so later-career users are supported, but they are not who the product is
designed around.

## Product Purpose

Practice a spoken mock interview with an AI interviewer, then review a scored
report and track improvement across sessions.

One session is a live voice call: the user picks a target role, an interview type
and the technologies they want to be asked about, talks to the interviewer with
live captions, and ends with a report containing scores, strengths, areas to
improve, tips and the full transcript.

Success is a user who comes back — who runs interviews repeatedly and whose
scores rise over time. A single rehearsal is not the outcome; measurable
improvement is.

## Positioning

The interview is generated from the user's actual target role plus the specific
technologies they select, so the questions match the job being applied for rather
than coming from a generic bank. The backend exposes a role → technologies map,
and the user's selection is what configures the voice assistant for that session.

A neighboring product can offer voice practice or scored feedback. What it cannot
truthfully copy is that this interview was built around the stack the user named.

## Operating Context

- Runs in the browser and requires microphone permission. The app requests the
  microphone **before** starting an interview, so a denied prompt costs nothing.
- One interview is a live voice call through Vapi, of a fixed length the backend
  sets per session, with live captions as the user speaks.
- The flow is: setup (role, interview type, technologies) → live call → report.
  Reports are reachable later from History.
- Interview types: `technical`, `behavioral`, `mixed`.
- Interview statuses: `completed`, `in_progress`, `abandoned`.
- Requires the separate EduNerve AI backend. The API shape — endpoints, error
  codes and the score scale — is documented in that repository's
  `API_CONTRACT.md`, not in this one.
- Deployed on Vercel; every route rewrites to `index.html` for client-side
  routing.

## Capabilities and Constraints

**Scoring.** Scores run 0–10 on three axes — technical, communication, problem
solving — plus an overall score. Any of them can be null when AI evaluation did
not run; the UI must show that honestly rather than rendering a zero.

**The report** carries feedback prose, strengths, areas to improve, tips, and the
complete transcript.

**Dashboard** shows token balance, average score, interview counts, skills
tracked, a score trend across scored sessions, and recent interviews.

**History** filters by status and interview type and is cursor-paginated.

**Settings** covers profile (name, target role, experience level, up to 20
skills), token transaction history, password change, and account deletion.

**Auth.** JWT held in `localStorage` with the profile cached alongside it.
Specific session-expiry error codes force a logout.

**Tokens.** An interview costs 10 tokens. New accounts receive a signup grant. An
interview that ends before any answers are recorded is refunded automatically. An
admin adjustment reason exists in the ledger.

Tokens are intended as **paid credits**: users are meant to buy more when they run
out. **No purchase path exists in the product today** — there is no pricing, no
packs, no checkout, and the API exposes only balance and transaction history.
Until that is built, running out of tokens is a hard stop, and the product must
say so plainly rather than directing the user somewhere that cannot help them.
Prices, pack sizes and billing provider are **undecided and must not be
invented.**

**Mark attribution is session-level, and undecided beyond that.** The report
returns `strengths`, `weakAreas` and `aiAnalysis.notes` as flat arrays with no
reference to the transcript turn each one came from. The UI therefore presents
them as marks on the session as a whole, read against the conversation, and says
so on screen. Attaching a mark to the specific answer it refers to would require
the API to return a turn reference with each item — **an open backend contract
decision, not a frontend gap.** Until it is made, no surface may imply per-answer
attribution.

**Degraded AI.** AI feedback can be unavailable. The interview is still saved with
its transcript and no scores; this is a normal state, not an error.

**Error handling.** Failed requests throw `ApiError` with a stable `code`. Branch
on the code, never on message text.

**Terminology.** "Tokens" (not credits, coins or points). "Interview" (not quiz,
test or assessment). "Role" and "technologies" for the setup choices. "Report"
for the result.

## Brand Commitments

The product name is **EduNerve AI**. No other identity constraint, voice
guideline or reference has been confirmed by the user.

## Evidence on Hand

- `README.md` — features, local setup, scripts, backend contract pointer, deploy
  notes. Accurate as of this record.
- The backend lives in a separate repository; `API_CONTRACT.md` is there, not
  here.
- **No logo or wordmark asset is committed.** `public/logo.png` was removed and
  the mark is currently a generic icon. Future work must not claim a brand asset
  exists or reference a file that does not.
- The landing page currently states "7+ Job Roles", "40+ Technologies", "AI
  Powered" and "24/7". These are UI copy, **not verified figures** — the real
  counts come from the backend's options endpoint at runtime. Do not treat them
  as confirmed numbers or repeat them as claims elsewhere.
- **No testimonials, customers, case studies, press, pricing, benchmarks or
  usage statistics exist.** None may be fabricated.

## Product Principles

1. **The stack the user named is the product.** An interview that could have been
   generated without knowing their role and technologies has failed its core
   promise.
2. **Measure the same way every time.** One rubric across every session is what
   makes progress real rather than anecdotal; changing what is measured breaks
   the comparison the product exists to offer.
3. **Never charge for a session the user did not get.** Permission is requested
   before tokens are spent, and an interview with no answers is refunded.
4. **The user's words survive the machinery.** A transcript is kept even when
   scoring fails, because the recording of what they actually said is theirs.
5. **State the true situation, including when the product cannot help.** A dead
   end described honestly is better than a cheerful nudge toward a screen that
   resolves nothing.
