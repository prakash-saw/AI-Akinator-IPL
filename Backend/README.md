MERN Backend for Google Event App

Quick start

1. Install dependencies

```bash
cd Backend
npm install
```

2. Create an `.env` file (copy `.env.example`) and set `MONGODB_URI` and `GEMINI_API_KEY`.

3. Run the server in development:

```bash
npm run dev
```

The backend exposes:
- `POST /api/ai/next` — backend proxy to the Generative Language API (uses `GEMINI_API_KEY`), or returns a safe sample when the key is not configured.
- `POST /api/sessions` — save a game session to MongoDB.

Authentication endpoints:
- `POST /api/auth/register` — register a new user. Body: `{ name, email, password }`. Returns `{ token, user }`.
- `POST /api/auth/login` — login existing user. Body: `{ email, password }`. Returns `{ token, user }`.
- `GET /api/auth/me` — returns authenticated user's info. Requires `Authorization: Bearer <token>` header.

Set `JWT_SECRET` in your `.env` to secure generated tokens.
