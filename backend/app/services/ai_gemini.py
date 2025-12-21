import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-flash")

def ai_suggestions(resume, job, missing):
    prompt = f"""
Give ONLY 5 short bullet points.

Explain:
- Why ATS score is low
- What to improve
- How to learn missing skills

Missing skills: {', '.join(missing)}
"""
    return model.generate_content(prompt).text
