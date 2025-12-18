# 🚀 AI Resume Analyzer & Skill Gap Finder

An **AI-powered Resume Analyzer** that evaluates resumes against job descriptions, calculates ATS scores, identifies skill gaps, provides AI-driven suggestions, and generates downloadable PDF reports. Built as a **production-ready, hackathon-grade full‑stack application**.

---

## 🌟 Key Features

### 🔍 Resume Analysis

* Upload Resume (**PDF / DOCX**)
* Paste Job Description
* ATS Compatibility Score (0–100)
* Keyword Matching & Similarity Score
* Section-wise Resume Feedback

### 🧠 AI Intelligence

* Skill Gap Detection
* AI-powered Resume Suggestions
* Personalized Learning Roadmap (AI Chatbot)
* Job Role Recommendations

### 📊 Visualization & Reports

* Skill Gap Charts
* ATS Score Ring Animation
* Downloadable **PDF Analysis Report**

### 👤 User System

* Firebase Authentication (Email/Password)
* Resume History per User
* Secure Cloud-based Storage

---

## 🏗️ Tech Stack

### Frontend

* **React + Vite**
* **Tailwind CSS**
* **Chart.js / Recharts**
* Firebase Hosting

### Backend

* **FastAPI (Python)**
* NLP with **spaCy & scikit-learn**
* AI Integration (Groq / Gemini)
* PDF generation with **ReportLab**

### Database & Auth

* **Firebase Firestore**
* **Firebase Authentication**

### Deployment

* **Frontend:** Firebase Hosting
* **Backend:** Render

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── main.py
│   │   └── firebase_config.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (Render)

```
FIREBASE_SERVICE_ACCOUNT=<Firebase service account JSON>
GROQ_API_KEY=<Groq API Key>
```

### Frontend

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 🛠️ How to Run Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Visit: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Live Demo

* **Frontend:** Firebase Hosting URL
* **Backend:** Render URL

---

## 🧪 Test Scenarios

* Upload valid PDF/DOCX resume
* Paste job description
* Verify ATS score changes
* Check missing skills list
* Download PDF report
* Login & view resume history

---

## 🔐 Security Practices

* No secrets committed to GitHub
* Firebase credentials via environment variables
* Secure authentication & authorization

---

## 🎤 Hackathon Pitch (Short)

> "AI Resume Analyzer is a full-stack AI-powered platform that helps candidates optimize resumes using ATS scoring, NLP similarity, and personalized AI learning roadmaps. Built with React, FastAPI, Firebase, and deployed on cloud infrastructure."

---

## 👨‍💻 Author

**Mukesh V**
Full‑Stack Developer | AI Enthusiast

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and feel free to fork or contribute!
