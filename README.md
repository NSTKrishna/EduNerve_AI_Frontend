# EduNerve AI Frontend

React 19 + Vite + Tailwind CSS 4 client for EduNerve AI: practice voice mock interviews with an AI interviewer (Vapi), then review scored feedback, transcripts and your progress.

## Features

- **Voice mock interviews** — pick a role, interview type and technologies; talk to the AI with live captions.
- **Interview report** — scores out of 10, strengths, areas to improve, tips and the full transcript.
- **Dashboard** — token balance, averages, score trend chart and recent interviews.
- **History** — filterable, paginated list of every interview.
- **Settings** — profile (role, experience, skills), token history, password change, account deletion.

## Run locally

```bash
npm install
cp .env.example .env     # VITE_API_URL must point at the backend, including /api
npm run dev
```

Needs the [backend](https://github.com/khuswant18/EduNerve_AI_Backend) running (default `http://localhost:3000`). Allow microphone access when starting an interview.

| Script | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Project layout

```
src/
├── lib/api.js           # the only place that calls the backend (ApiError, typed endpoints)
├── lib/format.js        # score / duration / date formatting (scores are 0-10)
├── context/             # auth + token balance (LearnerContext)
├── hooks/               # useVapiInterview (call + transcript + submit), useAsync
├── pages/               # Landing, Login, SignUp, Dashboard, Interview, Report, History, Settings
└── components/          # layout, interview/, dashboard/, common/, ui/
```

## Backend contract

The API shape (endpoints, error codes, score scale) is documented in the backend repo's `API_CONTRACT.md`. Failed requests throw `ApiError` with a stable `code`; switch on that, never on the message text.

## Deploy

Vercel: set `VITE_API_URL` to the deployed backend URL (ending in `/api`). `vercel.json` rewrites every route to `index.html` for client-side routing. Add the deployed origin to the backend's `CORS_ORIGINS` if it isn't `*.vercel.app` for this project.
