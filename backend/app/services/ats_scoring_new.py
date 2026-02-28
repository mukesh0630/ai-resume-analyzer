"""
Production-ready ATS scoring service with weighted algorithm.
Implements transparent, explainable scoring with dynamic insights.
"""

from typing import Dict, List, Set
from backend.app.services.skill_matcher import SkillMatcher
from backend.app.services.resume_parser_enhanced import ResumeStructuredParser
from backend.app.utils.text_cleaner import (
    extract_years_of_experience,
    has_ats_formatting_issues,
    calculate_text_density,
    tokenize,
    extract_text_sections
)


class ATSScoringEngine:
    """
    Advanced ATS scoring with weighted algorithm.
    
    Scoring Breakdown (Total: 100):
    - Skills Match: 40%
    - Experience Relevance: 20%
    - Projects Relevance: 15%
    - Education Match: 10%
    - Keyword Density & ATS Formatting: 10%
    - Certifications / Extras: 5%
    """
    
    WEIGHTS = {
        "skills": 40,
        "experience": 20,
        "projects": 15,
        "education": 10,
        "keywords_formatting": 10,
        "certifications": 5
    }
    
    def __init__(self):
        """Initialize scoring engine with skill matcher and parser."""
        self.skill_matcher = SkillMatcher()
        self.resume_parser = ResumeStructuredParser()
    
    def calculate_score(self, resume_text: str, job_description: str) -> Dict:
        """
        Calculate comprehensive ATS score for resume against job description.
        
        Args:
            resume_text: Resume content
            job_description: Job description content
            
        Returns:
            Comprehensive scoring dictionary with breakdown
        """
        # Parse data structures
        resume_data = self.resume_parser.parse_full(resume_text)
        job_skills = self.skill_matcher.extract_skills(job_description)
        
        # Calculate individual scores
        scores = {
            "skills": self._calculate_skills_score(resume_text, job_description),
            "experience": self._calculate_experience_score(resume_text, job_description),
            "projects": self._calculate_projects_score(resume_text, job_description),
            "education": self._calculate_education_score(resume_text, job_description),
            "keywords_formatting": self._calculate_keywords_formatting_score(resume_text, job_description),
            "certifications": self._calculate_certifications_score(resume_text),
        }
        
        # Calculate weighted total
        overall_score = sum(
            scores[component] * (self.WEIGHTS[component] / 100)
            for component in scores
        )
        
        # Get skill matching details
        skill_matching = self.skill_matcher.match_skills(resume_text, job_description)
        
        # Clamp score between 30-95 (30: some relevance, 95: near perfect)
        overall_score = max(30, min(95, round(overall_score)))
        
        return {
            "overall_score": overall_score,
            "score_breakdown": {
                "skills": round(scores["skills"], 1),
                "experience": round(scores["experience"], 1),
                "projects": round(scores["projects"], 1),
                "education": round(scores["education"], 1),
                "keywords_formatting": round(scores["keywords_formatting"], 1),
                "certifications": round(scores["certifications"], 1),
            },
            "skill_analysis": {
                "matched_skills": skill_matching["matched_skills"],
                "missing_skills": skill_matching["missing_skills"],
                "partial_match_skills": skill_matching["partial_match_skills"],
                "matched_count": len(skill_matching["matched_skills"]),
                "missing_count": len(skill_matching["missing_skills"]),
                "match_percentage": self._calculate_match_percentage(skill_matching),
            },
            "experience_analysis": {
                "resume_years": resume_data["total_years_experience"],
                "required_years": self._extract_required_years(job_description),
            },
            "formatting_issues": has_ats_formatting_issues(resume_text),
            "improvements_priority": self._rank_improvements(scores),
            "resume_level": self._determine_resume_level(overall_score, skill_matching),
        }
    
    def _calculate_skills_score(self, resume_text: str, job_text: str) -> float:
        """
        Calculate skills match score (0-100).
        
        Formula:
        - If 0% skills match: 0
        - If 100% skills match: 100
        - Otherwise: (matched / required) * 100, penalize partial matches
        
        Args:
            resume_text: Resume content
            job_text: Job description content
            
        Returns:
            Score 0-100
        """
        skill_matching = self.skill_matcher.match_skills(resume_text, job_text)
        
        matched = len(skill_matching["matched_skills"])
        missing = len(skill_matching["missing_skills"])
        partial = len(skill_matching["partial_match_skills"])
        
        total_required = matched + missing
        
        if total_required == 0:
            return 50  # Default if no skills extracted from job description
        
        # Base score from exact matches
        base_score = (matched / total_required) * 100
        
        # Penalty for missing skills
        missing_penalty = (missing / total_required) * 30
        
        # Small bonus for partial matches (not full points)
        partial_bonus = (partial / total_required) * 5
        
        score = base_score - missing_penalty + partial_bonus
        
        return max(0, min(100, score))
    
    def _calculate_experience_score(self, resume_text: str, job_text: str) -> float:
        """
        Calculate experience relevance score (0-100).
        
        Args:
            resume_text: Resume content
            job_text: Job description content
            
        Returns:
            Score 0-100
        """
        resume_years = extract_years_of_experience(resume_text)
        required_years = self._extract_required_years(job_text)
        
        if required_years == 0:
            return 50  # Default if can't extract required years
        
        if resume_years >= required_years:
            return 100  # Meets or exceeds requirement
        
        # Proportional score (e.g., 3/5 years = 60%)
        percentage = (resume_years / required_years) * 100
        
        # Cap at reasonable levels
        if percentage >= 70:
            return 80  # Still strong even if slightly under
        
        return max(20, percentage)  # Minimum 20 even with very low experience
    
    def _calculate_projects_score(self, resume_text: str, job_text: str) -> float:
        """
        Calculate project relevance score (0-100).
        
        Checks if project descriptions contain job-required skills/keywords.
        
        Args:
            resume_text: Resume content
            job_text: Job description content
            
        Returns:
            Score 0-100
        """
        sections = extract_text_sections(resume_text)
        projects_text = sections.get("projects", "")
        
        if not projects_text or len(projects_text.strip()) < 20:
            return 40  # No projects listed - penalty
        
        job_skills = self.skill_matcher.extract_skills(job_text)
        projects_skills = self.skill_matcher.extract_skills(projects_text)
        
        if not job_skills:
            return 50  # Can't evaluate
        
        # Project skill overlap
        overlap = projects_skills & job_skills
        overlap_percentage = (len(overlap) / len(job_skills)) * 100 if job_skills else 0
        
        # Check for domain keywords in project descriptions
        domain_keywords = ["built", "developed", "created", "implemented", "designed", "architecture"]
        domain_match = sum(
            1 for keyword in domain_keywords 
            if keyword.lower() in projects_text.lower()
        )
        
        domain_bonus = min(domain_match * 5, 20)
        
        score = overlap_percentage * 0.8 + domain_bonus
        
        return max(0, min(100, score))
    
    def _calculate_education_score(self, resume_text: str, job_text: str) -> float:
        """
        Calculate education match score (0-100).
        
        Args:
            resume_text: Resume content
            job_text: Job description content
            
        Returns:
            Score 0-100
        """
        resume_data = self.resume_parser.parse_full(resume_text)
        education_level = resume_data["education_level"]
        
        education_map = {
            "PhD / Doctorate": 100,
            "Master's Degree": 95,
            "Bachelor's Degree": 85,
            "Associate's Degree": 65,
            "Diploma / Certificate": 50,
            "Not specified": 30,
        }
        
        base_score = education_map.get(education_level, 30)
        
        # Check if education field matches job requirements
        job_lower = job_text.lower()
        education_keywords = [
            "computer science", "engineering", "information technology",
            "data science", "mathematics", "physics"
        ]
        
        for keyword in education_keywords:
            if keyword in education_level.lower():
                base_score = min(100, base_score + 10)
        
        return base_score
    
    def _calculate_keywords_formatting_score(self, resume_text: str, job_text: str) -> float:
        """
        Calculate ATS formatting and keyword density score (0-100).
        
        Checks:
        - No formatting issues (tables, excessive symbols)
        - Reasonable keyword density
        - Standard section structure
        
        Args:
            resume_text: Resume content
            job_text: Job description content
            
        Returns:
            Score 0-100
        """
        issues = has_ats_formatting_issues(resume_text)
        
        # Start with 80 (good baseline), deduct for issues
        score = 80
        
        # Penalty for each formatting issue
        score -= len(issues) * 15
        
        # Check keyword density using key job skills
        job_skills = self.skill_matcher.extract_skills(job_text)
        
        if job_skills:
            # Pick top 3 skills
            top_skills = list(job_skills)[:3]
            density_scores = [
                calculate_text_density(resume_text, skill) for skill in top_skills
            ]
            
            # Check if keyword density is reasonable (1-5% per keyword is good)
            excessive_density = sum(
                1 for density in density_scores 
                if density > 10  # More than 10% is spammy
            )
            
            score -= excessive_density * 10
        
        return max(30, min(100, score))
    
    def _calculate_certifications_score(self, resume_text: str) -> float:
        """
        Calculate certifications and extras score (0-100).
        
        Args:
            resume_text: Resume content
            
        Returns:
            Score 0-100
        """
        resume_data = self.resume_parser.parse_full(resume_text)
        certifications = resume_data["certifications"]
        
        # Base score for having certifications
        if not certifications:
            return 30  # Penalty for no certifications
        
        # 1-2 certs: 50 points, 3-5: 75, 5+: 100
        if len(certifications) >= 5:
            return 100
        elif len(certifications) >= 3:
            return 75
        elif len(certifications) >= 1:
            return 50
        
        return 30
    
    def _extract_required_years(self, job_text: str) -> int:
        """
        Extract required years of experience from job description.
        
        Args:
            job_text: Job description text
            
        Returns:
            Required years (default 0 if not found)
        """
        import re
        
        # Pattern: "X years" in job description
        pattern = r"(?:require|need).*?(\d+)\s*(?:\+?\s*)?(?:year|yr)s?"
        
        match = re.search(pattern, job_text, re.IGNORECASE)
        if match:
            return int(match.group(1))
        
        # Alternative pattern
        pattern = r"(\d+)\s*(?:\+?\s*)?(?:year|yr)s?\s*(?:of\s+)?(?:experience|exp)"
        match = re.search(pattern, job_text, re.IGNORECASE)
        if match:
            return int(match.group(1))
        
        return 0
    
    def _calculate_match_percentage(self, skill_matching: Dict) -> float:
        """Calculate skill match percentage."""
        matched = len(skill_matching["matched_skills"])
        total = matched + len(skill_matching["missing_skills"])
        
        if total == 0:
            return 0.0
        
        return round((matched / total) * 100, 1)
    
    def _rank_improvements(self, scores: Dict) -> List[Dict]:
        """
        Rank improvement areas by current score (lowest first).
        
        Args:
            scores: Dictionary of component scores
            
        Returns:
            Sorted list of improvement opportunities
        """
        improvements = [
            {
                "area": area.replace("_", " ").title(),
                "current_score": round(score, 1),
                "weight": self.WEIGHTS[area],
                "impact": round(score * (self.WEIGHTS[area] / 100), 1)
            }
            for area, score in scores.items()
        ]
        
        # Sort by score ascending (lowest priority first)
        return sorted(improvements, key=lambda x: x["current_score"])
    
    def _determine_resume_level(self, overall_score: int, skill_matching: Dict) -> str:
        """
        Determine resume candidate level based on overall score and skills.
        
        Args:
            overall_score: Overall ATS score
            skill_matching: Skill matching results
            
        Returns:
            Resume level label
        """
        match_percentage = (
            len(skill_matching["matched_skills"]) /
            (len(skill_matching["matched_skills"]) + len(skill_matching["missing_skills"]))
            if (len(skill_matching["matched_skills"]) + len(skill_matching["missing_skills"])) > 0
            else 0
        )
        
        if overall_score >= 85 and match_percentage >= 0.80:
            return "Strong Candidate"
        elif overall_score >= 70 and match_percentage >= 0.60:
            return "Job Ready"
        elif overall_score >= 50 and match_percentage >= 0.40:
            return "Intermediate"
        else:
            return "Beginner"
