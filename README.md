# AI Akinator IPL — IPL Neural Guesser

A lightweight Akinator-style web app that guesses IPL players by asking a sequence of informative questions. The project demonstrates a compact Bayesian reasoning engine combined with optional LLM-based question rephrasing, session persistence, and a modern React + Tailwind frontend with telemetry and light/dark theme support.

---

**Key Features**

- **AI-driven question selection**: The backend computes posteriors across players and chooses questions that maximize expected information gain.
- **Optional LLM rephrasing**: Questions can be rephrased with Google Gemini or OpenAI (fallback) when API keys are provided.
- **Persistent sessions & learning**: Sessions are stored in MongoDB and LearningStats are updated to bias priors from historical plays.
- **User accounts**: Basic auth endpoints allow saving sessions associated with users.
- **Frontend telemetry**: Confidence meter, deduction log, and session history UI.
- **Theme support**: Light and dark themes (persisted in `localStorage`).

---

**Tech Stack**

- Backend: Node.js, Express, Mongoose (MongoDB), axios, dotenv, nodemon
- Frontend: React (Vite), Tailwind CSS, Lucide icons
- LLMs: Google Generative Language (Gemini) and OpenAI (optional fallback)

---

**Repository Layout**

- `Backend/` — Express API, Mongoose models, routes and `.env` configuration.
  - See [Backend/server.js](Backend/server.js) and [Backend/routes/ai.js](Backend/routes/ai.js)
- `Frontend/` — React app built with Vite and Tailwind CSS.
  - See [Frontend/src/App.jsx](Frontend/src/App.jsx)

---

**Environment variables**

The backend reads configuration from environment variables. Create a `Backend/.env` (do NOT commit it).

Required / recommended variables:

- `PORT` — port for backend (default `5000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing auth tokens
- `GEMINI_API_KEY` — Google Generative Language API key (optional)
- `OPENAI_API_KEY` — OpenAI API key (optional; used as fallback)
- `GMAIL_USER` / `GMAIL_PASS` — optional SMTP creds for email flows
- `FRONTEND_URL` — origin for CORS (default `http://localhost:5173`)
- `MAX_QUESTIONS` — maximum turns (backend default used if absent)
- `CONFIDENCE_THRESHOLD` — probability threshold to make a guess (0–1)

Example (do not store secrets in VCS):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai
JWT_SECRET=replace-with-a-secure-secret
GEMINI_API_KEY=
OPENAI_API_KEY=
GMAIL_USER=
GMAIL_PASS=
FRONTEND_URL=http://localhost:5173
MAX_QUESTIONS=8
CONFIDENCE_THRESHOLD=0.8
NODE_ENV=development
```

---

**Running locally**

Prerequisites: Node.js (16+ recommended), npm, MongoDB (local or hosted).

Start backend:

```bash
cd Backend
npm install
# create or edit Backend/.env with values above
npm run dev
```

Start frontend:

```bash
cd Frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:5173` (or Vite's dev URL) and confirm the backend health at `http://localhost:5000/api/health`.

---

**API (selected endpoints)**

- `GET /api/health` — health check
- `POST /api/ai/next` — body: `{ history: [...] }` → returns `{ type: 'question' | 'guess', text, attribute?, reasoning?, confidence? }`
- `POST /api/sessions` — save a session (body: `{ user, history, result }`)
- `GET /api/sessions?user=<userId>&limit=<n>` — fetch saved sessions (most recent first)
- `POST /api/auth/register` — create user (see `Backend/routes/auth.js`)
- `POST /api/auth/login` — login to receive JWT

See the route files in `Backend/routes/` for full details.

---

**LLM & Rephrase behavior**

When an LLM key is set the backend will try to rephrase selected questions to make them more conversational. The code tries OpenAI (if `OPENAI_API_KEY` is present) and falls back to Google Gemini (`GEMINI_API_KEY`) if configured. If the remote rephrase fails (404 or auth issue), the backend logs a helpful message and returns the default question text.

---

**Frontend notes**

- The app includes a History modal (pulls `GET /api/sessions?user=<id>`), a Theme toggle (light/dark stored in `localStorage`), and a Telemetry sidebar showing confidence and deduction logs.
- Key frontend files: [Frontend/src/App.jsx](Frontend/src/App.jsx), [Frontend/src/components/TelemetrySidebar.jsx](Frontend/src/components/TelemetrySidebar.jsx)

---

**Development tips & next steps**

- Add a `Backend/.env.example` containing placeholder keys to help onboarding (do not commit secrets).
- Protect API keys in production (use secrets manager / environment injection).
- Add pagination or a CSV export for the history modal if you want bulk analysis of plays.
- Consider adding end-to-end tests for the AI selection logic (unit tests around information gain and posterior updates).

---

**Contributing**

PRs welcome — please open issues for feature requests or bugs. Keep changes focused, add tests where appropriate, and avoid committing credentials.

**License**

This project is provided as-is. Add a license file if you plan to open-source it (e.g., MIT).
