# 🏏 AI Akinator IPL — Neural Cricket Guesser

<div align="center">

### 🤖 Think of an IPL Player. Let AI Guess It.

An intelligent full-stack web application inspired by Akinator that uses AI-powered questioning, Bayesian reasoning, and machine learning concepts to guess IPL players through interactive gameplay.

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge\&logo=node.js)
![Express](https://img.shields.io/badge/API-Express-black?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge\&logo=mongodb)
![Tailwind](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge\&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge\&logo=google)

</div>

---

# 📌 Overview

AI Akinator IPL is a smart web application where users think of an IPL player and the AI attempts to guess the player by asking strategic questions.

The platform combines:

* 🧠 AI-driven decision making
* 📊 Bayesian probability logic
* ⚡ Real-time gameplay
* 🔐 Secure authentication
* 🌙 Modern responsive UI
* 🤖 Gemini AI integration

This project was built using the MERN stack and designed to deliver a fun, interactive, and intelligent cricket experience.

---

# ✨ Features

## 🧠 Intelligent Guessing Engine

* AI asks optimized questions to narrow down possible IPL players
* Uses probability-based logic for smarter predictions
* Dynamic player deduction system

## 🤖 Gemini AI Integration

* Generates natural and conversational questions
* Improves gameplay interaction and realism
* Enhances user engagement with AI-generated responses

## 🔐 Authentication System

* User registration and login
* JWT-based authentication
* Password encryption using bcrypt
* Protected routes and sessions

## 📊 Session Tracking

* Save gameplay sessions
* Track previous guesses and results
* Store player interaction history

## 🎨 Modern UI/UX

* Responsive design for all devices
* Smooth animations and transitions
* Dark and Light mode support
* Interactive gameplay interface

## ⚡ Real-Time Gameplay Experience

* Fast API communication
* Seamless frontend-backend integration
* Optimized performance using Vite

---

# 🛠️ Tech Stack

| Category        | Technologies                 |
| --------------- | ---------------------------- |
| Frontend        | React.js, Vite, Tailwind CSS |
| Backend         | Node.js, Express.js          |
| Database        | MongoDB, Mongoose            |
| Authentication  | JWT, bcrypt.js               |
| AI Integration  | Google Gemini API            |
| Version Control | Git & GitHub                 |
| API Testing     | Postman                      |

---

# 📂 Project Structure

```bash
AI-Akinator-IPL/
│
├── Backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   ├── config/
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/AI-Akinator-IPL.git
cd AI-Akinator-IPL
```

---

## 2️⃣ Setup Backend

```bash
cd Backend
npm install
```

### Create `.env` File

```env
`PORT` — port for backend (default `5000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing auth tokens
- `GEMINI_API_KEY` — Google Generative Language API key (optional)
- `OPENAI_API_KEY` — OpenAI API key (optional; used as fallback)
- `GMAIL_USER` / `GMAIL_PASS` — optional SMTP creds for email flows
- `FRONTEND_URL` — origin for CORS (default `http://localhost:5173`)
- `MAX_QUESTIONS` — maximum turns (backend default used if absent)
- `CONFIDENCE_THRESHOLD` — probability threshold to make a guess (0–1)
```

### Run Backend Server

```bash
cd Backend
npm install
# create or edit Backend/.env with values above
npm run dev
```

---

## 3️⃣ Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```
Open the frontend at `http://localhost:5173` (or Vite's dev URL) and confirm the backend health at `http://localhost:5000/api/health`.
---

# 🎮 How It Works

1. User thinks of an IPL player.
2. AI starts asking intelligent questions.
3. User answers with Yes / No / Maybe.
4. AI updates probabilities after each answer.
5. System predicts the most likely player.
6. Results and sessions can be saved.

---

# 🔥 Key Highlights

* Full MERN Stack Project
* AI-Powered Gameplay
* Gemini API Integration
* Authentication System
* Responsive Design
* Professional UI/UX
* Real-Time API Handling
* Scalable Architecture

---

# 🧪 API Endpoints

## Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login existing user |
| GET    | `/api/auth/me`       | Get current user    |

---

## AI Routes

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| POST   | `/api/ai/next` | Generate next AI question |

---

## Session Routes

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| POST   | `/api/sessions` | Save gameplay session   |
| GET    | `/api/sessions` | Fetch previous sessions |

---

# 🌐 Deployment

## Frontend Deployment

* Versel
* Netlify

## Backend Deployment

* Render
* Railway
* Cyclic

## Database

* MongoDB Compass

---

# 👨‍💻 Team Contribution

| Role               | Responsibility                  |
| ------------------ | ------------------------------- |
| Frontend Developer | UI Design & React Integration   |
| Backend Developer  | APIs, Authentication & Database |
| AI Integration     | Gemini API & AI Logic           |
| Database Manager   | MongoDB Schema & Data Handling  |

---

# 🧠 Future Improvements

* 🏆 Multiplayer Mode
* 📈 Better AI Learning System
* 🎤 Voice-Based Questions
* 🌍 Multi-language Support
* 📱 Mobile Application
* 🧾 Leaderboards & Rankings

---

**LLM & Rephrase behavior**

When an LLM key is set the backend will try to rephrase selected questions to make them more conversational. The code tries OpenAI (if `OPENAI_API_KEY` is present) and falls back to Google Gemini (`GEMINI_API_KEY`) if configured. If the remote rephrase fails (404 or auth issue), the backend logs a helpful message and returns the default question text.

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you liked this project, give it a ⭐ on GitHub and share it with others.




