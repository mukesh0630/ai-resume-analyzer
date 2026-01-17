from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
try:
    from dotenv import load_dotenv
except Exception:
    def load_dotenv():
        return None

from datetime import datetime
import os
import uuid
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4


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
# Firebase (initialized in firestore_db.py service)
# -----------------------------
from backend.app.firebase_config import db  # Optional import, not used directly

# -----------------------------
# Routes
# -----------------------------
from backend.app.routes import (
    ai_ats,
    resume,
    history,
    ai,
    ats,
    skill_gap,
    roadmap,
    feedback,
)


app.include_router(resume.router)
app.include_router(ats.router)
app.include_router(skill_gap.router)
app.include_router(roadmap.router)
app.include_router(ai_ats.router)
app.include_router(ai.router)
app.include_router(history.router)
app.include_router(feedback.router)

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
    try:
        # Extract and validate data
        ats_score = data.get("ats_score", 0)
        missing_skills = data.get("missing_skills", [])
        roadmap_data = data.get("roadmap", [])
        ai_summary_data = data.get("ai_summary", [])

        print(f"PDF Generation Request:")
        print(f"  ATS Score: {ats_score}")
        print(f"  Missing Skills: {missing_skills}")
        print(f"  Roadmap Items: {len(roadmap_data)} items")
        print(f"  AI Summary Items: {len(ai_summary_data)} items")

        # Ensure they are the right type
        if isinstance(ats_score, (int, float)):
            ats_score = float(ats_score)
        else:
            ats_score = 0.0

        if not isinstance(missing_skills, list):
            missing_skills = []

        if not isinstance(roadmap_data, list):
            roadmap_data = []

        if not isinstance(ai_summary_data, list):
            ai_summary_data = []

        REPORT_DIR = os.path.join(os.getcwd(), "generated_reports")
        os.makedirs(REPORT_DIR, exist_ok=True)

        filename = f"resume_report_{uuid.uuid4()}.pdf"
        file_path = os.path.join(REPORT_DIR, filename)

        c = canvas.Canvas(file_path, pagesize=A4)
        width, height = A4

        y = height - 50
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y, "AI Resume Analysis Report")

        # ATS Score
        y -= 40
        c.setFont("Helvetica", 12)
        c.drawString(50, y, f"ATS Score: {ats_score:.1f}%")

        # Missing Skills Section
        y -= 30
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Missing Skills:")
        y -= 18
        c.setFont("Helvetica", 10)
        
        if missing_skills:
            for skill in missing_skills:
                skill_name = str(skill).strip()
                c.drawString(70, y, f"- {skill_name}")
                y -= 16
        else:
            c.drawString(70, y, "No missing skills identified")
            y -= 16

        # Learning Roadmap Section
        y -= 15
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Learning Roadmap:")
        y -= 18
        c.setFont("Helvetica", 10)
        
        if roadmap_data:
            for item in roadmap_data:
                # Handle both dict and string items
                if isinstance(item, dict):
                    skill = item.get("skill", "Unknown")
                    recommendation = item.get("recommendation", "")
                    c.setFont("Helvetica-Bold", 10)
                    c.drawString(70, y, f"{skill}:")
                    y -= 15
                    c.setFont("Helvetica", 9)
                    y = draw_wrapped_text(c, f"→ {recommendation}", 90, y, width - 140, line_height=13)
                    y -= 10
                else:
                    # Handle string items
                    c.drawString(70, y, f"• {str(item)}")
                    y -= 16
        else:
            c.drawString(70, y, "No roadmap data available")
            y -= 16

        # AI Career Insights Section
        y -= 15
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "AI Career Insights:")
        y -= 18
        c.setFont("Helvetica", 10)
        
        if ai_summary_data:
            for insight in ai_summary_data:
                insight_text = str(insight).strip()
                if insight_text:
                    y = draw_wrapped_text(c, f"• {insight_text}", 70, y, width - 120, line_height=12)
                    y -= 5
        else:
            c.drawString(70, y, "No insights available")
            y -= 16

        c.save()

        print(f"PDF saved to: {file_path}")

        return FileResponse(
            file_path,
            media_type="application/pdf",
            filename="AI_Resume_Report.pdf",
            headers={"Content-Disposition": "attachment; filename=AI_Resume_Report.pdf"}
        )
    except Exception as e:
        import traceback
        error_msg = f"PDF generation failed: {str(e)}"
        print(f"Error: {error_msg}")
        traceback.print_exc()
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=error_msg)