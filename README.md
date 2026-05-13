# 🎓 TubeStudy AI - Supercharge Your Learning

Welcome to your new portfolio project! This repository transforms any educational YouTube video into a structured AI-powered study guide.

## 🏗️ Project Overview
This system follows a robust full-stack architecture:
- **Frontend**: Built using React 18 + Vite + TypeScript. It leverages modern vanilla CSS modules, glassmorphic design patterns, and Framer Motion for premium visual interactions.
- **Backend**: Python FastAPI driving an orchestration pipeline that handles auto-generated transcript mining via `youtube-transcript-api` and high-speed JSON-mode parsing with Google Gemini Flash.

## 🚀 Final Launch Instructions

### 1. Configure Gemini AI Key
Before triggering the analysis engine, you need a Gemini API key.
1. Create a new `.env` file inside the `/backend` folder (you can copy the format from `.env.example`).
2. Open `/backend/.env` and add your key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

### 2. Spinning Up The Backend
Run these commands in your first terminal:
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```
*The backend will self-host at `http://localhost:8000` with hot-reloading active.*

### 3. Spinning Up The Frontend Dashboard
Open a second terminal window and run:
```powershell
cd frontend
npm run dev
```
*Open the resulting local URL (e.g., `http://localhost:5173`) to use your app.*

---

## ✨ Features Implemented
✅ **Automated Transcription Engine**: Deep extraction of YouTube subtitles.
✅ **Structured Dashboard Grid**: Clean multi-pane interface with smooth CSS blur filters.
✅ **Smart Summary & Key Concepts**: Generated via Gemini Flash.
✅ **Interactive Chapters**: View major topics covered in time sequence.
✅ **Gamified Flashcards**: Flip-style card deck to aid memorization.
✅ **Dynamic MCQs**: Live graded quizzes with logic confirmations and post-answer explanations.
