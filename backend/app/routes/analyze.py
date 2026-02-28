"""
Main analysis API endpoint for comprehensive ATS scoring.
Combines all services into a production-ready endpoint.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.app.services.ats_scoring_new import ATSScoringEngine
from backend.app.services.insight_generator import InsightGenerator
from backend.app.utils.text_cleaner import clean_text

router = APIRouter(prefix="/analyze", tags=["Analysis"])


class AnalysisRequest(BaseModel):
    """Request model for resume analysis."""
    resume_text: str
    job_description: str
    resume_id: Optional[str] = None


class AnalysisResponse(BaseModel):
    """Response model for analysis results."""
    status: str
    overall_score: int
    resume_level: str
    score_breakdown: dict
    skill_analysis: dict
    experience_analysis: dict
    formatting_issues: list
    improvements_priority: list
    insights: dict
    visualization_data: dict


class ScoreBreakdownChart(BaseModel):
    """Chart data for score breakdown visualization."""
    category: str
    score: float
    max_score: float
    weight: int


@router.post("/comprehensive", response_model=AnalysisResponse)
async def comprehensive_analysis(request: AnalysisRequest):
    """
    Comprehensive ATS analysis endpoint.
    
    Returns detailed scoring breakdown, skill analysis, and actionable insights.
    
    Args:
        request: Analysis request with resume and job description
        
    Returns:
        Comprehensive analysis response
        
    Raises:
        HTTPException: If inputs are invalid
    """
    try:
        # Validate inputs
        if not request.resume_text or len(request.resume_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Resume must be at least 50 characters"
            )
        
        if not request.job_description or len(request.job_description.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description must be at least 50 characters"
            )
        
        # Clean inputs
        resume_text = clean_text(request.resume_text)
        job_description = clean_text(request.job_description)
        
        # Initialize engines
        scoring_engine = ATSScoringEngine()
        insight_generator = InsightGenerator()
        
        # Calculate scores
        score_data = scoring_engine.calculate_score(resume_text, job_description)
        
        # Generate insights
        insights = insight_generator.generate_insights(
            resume_text, 
            job_description, 
            score_data
        )
        
        # Prepare visualization data
        visualization_data = _prepare_visualization_data(score_data)
        
        return AnalysisResponse(
            status="success",
            overall_score=score_data["overall_score"],
            resume_level=score_data["resume_level"],
            score_breakdown=score_data["score_breakdown"],
            skill_analysis=score_data["skill_analysis"],
            experience_analysis=score_data["experience_analysis"],
            formatting_issues=score_data["formatting_issues"],
            improvements_priority=score_data["improvements_priority"],
            insights=insights,
            visualization_data=visualization_data
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error during analysis. Please try again."
        )


def _prepare_visualization_data(score_data: dict) -> dict:
    """
    Prepare data optimized for frontend visualization.
    Returns clean JSON without radar charts - using horizontal bars instead.
    
    Args:
        score_data: Scoring analysis data
        
    Returns:
        Frontend-ready visualization data
    """
    
    breakdown = score_data["score_breakdown"]
    weights = {
        "skills": 40,
        "experience": 20,
        "projects": 15,
        "education": 10,
        "keywords_formatting": 10,
        "certifications": 5,
    }
    
    # Horizontal score breakdown chart
    score_chart = [
        {
            "category": "Skills Match",
            "score": breakdown["skills"],
            "max_score": 100,
            "weight": weights["skills"],
            "weighted_impact": round(breakdown["skills"] * weights["skills"] / 100, 1)
        },
        {
            "category": "Experience",
            "score": breakdown["experience"],
            "max_score": 100,
            "weight": weights["experience"],
            "weighted_impact": round(breakdown["experience"] * weights["experience"] / 100, 1)
        },
        {
            "category": "Projects",
            "score": breakdown["projects"],
            "max_score": 100,
            "weight": weights["projects"],
            "weighted_impact": round(breakdown["projects"] * weights["projects"] / 100, 1)
        },
        {
            "category": "Education",
            "score": breakdown["education"],
            "max_score": 100,
            "weight": weights["education"],
            "weighted_impact": round(breakdown["education"] * weights["education"] / 100, 1)
        },
        {
            "category": "Keywords & Formatting",
            "score": breakdown["keywords_formatting"],
            "max_score": 100,
            "weight": weights["keywords_formatting"],
            "weighted_impact": round(breakdown["keywords_formatting"] * weights["keywords_formatting"] / 100, 1)
        },
        {
            "category": "Certifications",
            "score": breakdown["certifications"],
            "max_score": 100,
            "weight": weights["certifications"],
            "weighted_impact": round(breakdown["certifications"] * weights["certifications"] / 100, 1)
        },
    ]
    
    # Skill gap visualization
    skill_analysis = score_data["skill_analysis"]
    total_skills = skill_analysis["matched_count"] + skill_analysis["missing_count"]
    
    skill_gap_chart = {
        "matched": skill_analysis["matched_count"],
        "missing": skill_analysis["missing_count"],
        "matched_percentage": round(
            (skill_analysis["matched_count"] / total_skills * 100) if total_skills > 0 else 0, 
            1
        ),
        "missing_percentage": round(
            (skill_analysis["missing_count"] / total_skills * 100) if total_skills > 0 else 0,
            1
        ),
    }
    
    # Experience gap visualization
    exp_analysis = score_data["experience_analysis"]
    resume_years = exp_analysis["resume_years"]
    required_years = exp_analysis["required_years"]
    
    experience_gap_chart = {
        "resume_years": resume_years,
        "required_years": required_years,
        "gap": max(0, required_years - resume_years),
        "surplus": max(0, resume_years - required_years),
        "percentage": round(
            (resume_years / required_years * 100) if required_years > 0 else 100,
            1
        )
    }
    
    return {
        "score_breakdown_chart": score_chart,
        "skill_gap_chart": skill_gap_chart,
        "experience_gap_chart": experience_gap_chart,
        "overall_score": score_data["overall_score"],
        "resume_level": score_data["resume_level"],
    }
