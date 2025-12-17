import os
from groq import Groq
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from app.routes import (
    resume,
    ats,
    similarity,
    skill_gap,
    feedback,
    ai,
    firebase_test,
    protected,
    history
)
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from fastapi.responses import FileResponse
import uuid
def draw_wrapped_text(canvas, text, x, y, max_width, line_height=14):
    from reportlab.pdfbase.pdfmetrics import stringWidth

    words = text.split(" ")
    line = ""

    for word in words:
        test_line = line + word + " "
        if stringWidth(test_line, "Helvetica", 10) <= max_width:
            line = test_line
        else:
            canvas.drawString(x, y, line)
            y -= line_height
            line = word + " "
    if line:
        canvas.drawString(x, y, line)

    return y

load_dotenv()


app = FastAPI(
    title="AI Resume Analyzer API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(resume.router)
app.include_router(ats.router)
app.include_router(similarity.router)
app.include_router(skill_gap.router)
app.include_router(feedback.router)
app.include_router(ai.router)
app.include_router(firebase_test.router)
app.include_router(protected.router)
app.include_router(history.router)

@app.get("/")
def home():
    return {"status": "Backend running successfully"}
@app.post("/ats/skills")
def skill_gap(data: dict):
    resume_text = data["resume_text"].lower()
    job_description = data["job_description"].lower()

    # basic skill keywords (can be expanded later)
    skills = [
        "python", "javascript", "react", "react.js",
        "fastapi", "django",
        "mongodb", "firebase", "sql",
        "git", "docker", "aws",
        "nlp", "ats", "resume parsing"
    ]

    matched = []
    missing = []

    for skill in skills:
        if skill in job_description:
            if skill in resume_text:
                matched.append(skill)
            else:
                missing.append(skill)

    return {
        "matched_skills": matched,
        "missing_skills": missing
    }
    
@app.post("/ats/roadmap")
def learning_roadmap(data: dict):
    missing_skills = data["missing_skills"]

    roadmap = {
        "aws": "Learn EC2, S3, IAM basics and deploy a simple app",
        "docker": "Learn Dockerfile, images, containers and docker-compose",
        "nlp": "Learn spaCy basics and text processing pipelines",
        "ats": "Understand ATS keyword optimization and resume parsing",
        "resume parsing": "Learn PDF/DOCX parsing and keyword extraction",
        "django": "Learn Django fundamentals and REST framework",
        "react.js": "Learn React hooks, state management, and best practices",
        "git": "Learn Git branching, pull requests, and workflows",
    }

    suggestions = []

    for skill in missing_skills:
        if skill in roadmap:
            suggestions.append({
                "skill": skill,
                "recommendation": roadmap[skill]
            })

    return {
        "learning_roadmap": suggestions
    }

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/ai/assistant")
def ai_assistant(data: dict):
    resume = data["resume_text"]
    job = data["job_description"]
    missing_skills = ", ".join(data["missing_skills"])

    prompt = f"""
You are an AI career assistant.

Resume:
{resume}

Job Description:
{job}

Missing Skills:
{missing_skills}

Tasks:
1. Explain why the ATS score is low
2. Suggest a personalized learning roadmap
3. Give tips to improve the resume

Respond in simple, clear bullet points.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )

    return {
        "ai_response": response.choices[0].message.content
    }

@app.post("/report/pdf")
def generate_pdf(data: dict):
    ats_score = data["ats_score"]
    missing_skills = data["missing_skills"]
    roadmap = data["roadmap"]
    ai_summary = data["ai_summary"]

    filename = f"resume_report_{uuid.uuid4()}.pdf"
    REPORT_DIR = os.path.join(os.getcwd(), "generated_reports")
    os.makedirs(REPORT_DIR, exist_ok=True)

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
        y -= 20
        c.drawString(70, y, f"- {skill}")

    y -= 30
    c.drawString(50, y, "Learning Roadmap:")
    for item in roadmap:
        y -= 20
        c.drawString(70, y, f"{item['skill']}: {item['recommendation']}")

    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "AI Career Assistant Summary:")

    y -= 20
    c.setFont("Helvetica", 10)

    max_width = width - 100  # page width minus margins
    y = draw_wrapped_text(c, ai_summary, 50, y, max_width)


    c.save()

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="AI_Resume_Report.pdf",
    )
    
    from datetime import datetime

@app.post("/history/save")
def save_history(data: dict):
    user_id = data["user_id"]
    record = {
        "ats_score": data["ats_score"],
        "missing_skills": data["missing_skills"],
        "roadmap": data["roadmap"],
        "created_at": datetime.utcnow().isoformat()
    }

    # Firestore reference
    db.collection("users").document(user_id)\
      .collection("history").add(record)

    return {"status": "saved"}

@app.get("/history/{user_id}")
def get_history(user_id: str):
    docs = db.collection("users")\
             .document(user_id)\
             .collection("history")\
             .stream()

    history = []
    for doc in docs:
        history.append(doc.to_dict())

    return {"history": history}
# Render needs app variable
app = app





