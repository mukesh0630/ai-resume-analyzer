import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_resume_with_ai(resume_text: str, job_description: str):
    prompt = f"""
You are an Applicant Tracking System (ATS) engine.

Analyze the resume against the job description.

Return STRICT JSON ONLY with the following fields:
- ats_score (number between 0 and 100)
- matched_skills (array of strings)
- missing_skills (array of strings)
- feedback (array of max 5 short bullet points)
- roadmap (array of max 5 short learning steps)

Resume:
{resume_text}

Job Description:
{job_description}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except Exception:
        raise ValueError("AI response is not valid JSON")
