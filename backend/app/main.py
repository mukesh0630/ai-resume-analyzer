from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import uuid

# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()

# -----------------------------
# App Initialization
# -----------------------------
app = FastAPI(
    title="AI Resume Analyzer API",
    version="1.0.0"
)

# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Firebase
# -----------------------------
from backend.app.firebase_config import db

# -----------------------------
# Routes
# -----------------------------
from backend.app.routes import (
    resume,
    ats,
    similarity,
    skill_gap,
    feedback,
    ai,
    protected,
    history,
    roadmap
)

app.include_router(resume.router)
app.include_router(ats.router)
app.include_router(similarity.router)
app.include_router(skill_gap.router)
app.include_router(feedback.router)
app.include_router(ai.router)
app.include_router(protected.router)
app.include_router(history.router)
app.include_router(roadmap.router)

# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def home():
    return {"status": "Backend running successfully"}

# -----------------------------
# PDF Helper
# -----------------------------
def draw_wrapped_text(c, text, x, y, max_width, line_height=14):
    from reportlab.pdfbase.pdfmetrics import stringWidth

    words = text.split(" ")
    line = ""

    for word in words:
        test_line = line + word + " "
        if stringWidth(test_line, "Helvetica", 10) <= max_width:
            line = test_line
        else:
            c.drawString(x, y, line)
            y -= line_height
            line = word + " "
    if line:
        c.drawString(x, y, line)

    return y

# -----------------------------
# PDF Report Generator
# -----------------------------
@app.post("/report/pdf")
def generate_pdf(data: dict):
    ats_score = data.get("ats_score", 0)
    missing_skills = data.get("missing_skills", [])
    roadmap_text = data.get("roadmap", "")
    ai_summary = data.get("ai_summary", "")

    REPORT_DIR = os.path.join(os.getcwd(), "generated_reports")
    os.makedirs(REPORT_DIR, exist_ok=True)

    filename = f"resume_report_{uuid.uuid4()}.pdf"
    file_path = os.path.join(REPORT_DIR, filename)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "AI Resume Analysis Report")

    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"ATS Score: {ats_score:.2f}%")

    y -= 30
    c.drawString(50, y, "Missing Skills:")
    for skill in missing_skills:
        y -= 18
        c.drawString(70, y, f"- {skill}")

    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Learning Roadmap:")
    y -= 20
    c.setFont("Helvetica", 10)
    y = draw_wrapped_text(c, roadmap_text, 50, y, width - 100)

    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "AI Career Assistant Summary:")

    y -= 20
    c.setFont("Helvetica", 10)
    y = draw_wrapped_text(c, ai_summary, 50, y, width - 100)

    c.save()

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="AI_Resume_Report.pdf"
    )

# -----------------------------
# Save History
# -----------------------------
@app.post("/history/save")
def save_history(data: dict):
    user_id = data["user_id"]

    record = {
        "user_id": user_id,
        "ats_score": data.get("ats_score"),
        "missing_skills": data.get("missing_skills", []),
        "roadmap": data.get("roadmap", ""),
        "created_at": datetime.utcnow()
    }

    db.collection("users") \
      .document(user_id) \
      .collection("history") \
      .add(record)

    return {"status": "saved"}

# -----------------------------
# Fetch History
# -----------------------------
@app.get("/history/{user_id}")
def get_history(user_id: str):
    docs = (
        db.collection("users")
        .document(user_id)
        .collection("history")
        .stream()
    )

    return {"history": [doc.to_dict() for doc in docs]}




