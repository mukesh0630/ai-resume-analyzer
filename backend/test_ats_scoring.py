"""
Quick test of refactored ATS scoring engine
"""

from backend.app.services.ats_scoring_new import ATSScoringEngine

resume = """
John Doe
Experience:
- Senior Python Developer at TechCorp (2020-2024, 4 years)
  Built REST APIs with FastAPI and Django
  Deployed to AWS with Docker and Kubernetes
  Managed PostgreSQL and Redis databases

Skills: Python, JavaScript, React, FastAPI, Django, AWS, Docker, PostgreSQL, Redis, Git
"""

job = """
Senior Full-Stack Engineer
Required Skills: Python, React, AWS, Kubernetes, Docker, FastAPI
Years Required: 5 years
Education: Bachelor's in Computer Science
"""

engine = ATSScoringEngine()
result = engine.calculate_score(resume, job)

print("=" * 60)
print("ATS SCORING TEST RESULTS")
print("=" * 60)
print(f"\nOverall Score: {result['overall_score']}")
print(f"Resume Level: {result['resume_level']}")
print(f"\nScore Breakdown:")
for component, score in result['score_breakdown'].items():
    print(f"  {component.replace('_', ' ').title()}: {score}")

print(f"\nSkill Analysis:")
print(f"  Matched: {result['skill_analysis']['matched_count']} - {result['skill_analysis']['matched_skills']}")
print(f"  Missing: {result['skill_analysis']['missing_count']} - {result['skill_analysis']['missing_skills']}")

print(f"\nExperience Analysis:")
print(f"  Resume Years: {result['experience_analysis']['resume_years']}")
print(f"  Required Years: {result['experience_analysis']['required_years']}")

print("\nTest completed successfully!")
