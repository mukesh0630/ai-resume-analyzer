"""
Dynamic AI insight generator.
Creates contextual, non-template insights based on actual scoring breakdown.
"""

from typing import Dict, List
from backend.app.services.ats_scoring_new import ATSScoringEngine


class InsightGenerator:
    """Generate dynamic, actionable insights based on scoring analysis."""
    
    def __init__(self):
        """Initialize with ATS scoring engine."""
        self.ats_engine = ATSScoringEngine()
    
    def generate_insights(
        self, 
        resume_text: str, 
        job_description: str,
        score_data: Dict
    ) -> Dict:
        """
        Generate comprehensive insights based on resume analysis.
        
        Args:
            resume_text: Resume content
            job_description: Job description content
            score_data: Scoring data from ATS engine
            
        Returns:
            Dictionary with dynamic insights and recommendations
        """
        insights = {
            "summary": self._generate_summary(score_data),
            "strength_areas": self._identify_strengths(score_data),
            "weakness_areas": self._identify_weaknesses(score_data),
            "actionable_recommendations": self._generate_recommendations(
                resume_text, job_description, score_data
            ),
            "next_steps": self._generate_next_steps(score_data),
            "ai_insights": self._generate_ai_narrative(score_data),
        }
        
        return insights
    
    def _generate_summary(self, score_data: Dict) -> str:
        """Generate executive summary of candidate fit."""
        overall = score_data["overall_score"]
        level = score_data["resume_level"]
        matched = len(score_data["skill_analysis"]["matched_skills"])
        missing = len(score_data["skill_analysis"]["missing_skills"])
        
        if overall >= 85:
            return (
                f"Excellent alignment. {matched} core skills matched with only {missing} gaps. "
                f"Resume is well-positioned as a {level}."
            )
        elif overall >= 70:
            return (
                f"Strong alignment. {matched} key skills present. {missing} additional skills "
                f"would significantly improve candidacy."
            )
        elif overall >= 50:
            return (
                f"Moderate fit with {matched} matching skills. {missing} critical skills are missing. "
                f"Targeted skill development recommended."
            )
        else:
            return (
                f"Limited alignment. Only {matched} of {matched + missing} required skills currently present. "
                f"Significant skill gap exists."
            )
    
    def _identify_strengths(self, score_data: Dict) -> List[str]:
        """Identify resume strengths based on high-scoring areas."""
        breakdown = score_data["score_breakdown"]
        strengths = []
        
        if breakdown["skills"] >= 70:
            matched = len(score_data["skill_analysis"]["matched_skills"])
            strengths.append(f"Strong technical skill alignment ({matched} core skills matched)")
        
        if breakdown["experience"] >= 80:
            years = score_data["experience_analysis"]["resume_years"]
            strengths.append(f"Solid professional experience ({years}+ years)")
        
        if breakdown["projects"] >= 70:
            strengths.append("Relevant project portfolio with demonstrated expertise")
        
        if breakdown["education"] >= 85:
            strengths.append("Strong educational background")
        
        if breakdown["keywords_formatting"] >= 75:
            strengths.append("Well-optimized for ATS with proper formatting")
        
        if breakdown["certifications"] >= 70:
            strengths.append("Relevant certifications and credentials")
        
        return strengths if strengths else ["Resume demonstrates basic career experience"]
    
    def _identify_weaknesses(self, score_data: Dict) -> List[str]:
        """Identify resume weaknesses based on low-scoring areas."""
        breakdown = score_data["score_breakdown"]
        weaknesses = []
        
        if breakdown["skills"] < 50:
            missing = len(score_data["skill_analysis"]["missing_skills"])
            top_missing = score_data["skill_analysis"]["missing_skills"][:3]
            weaknesses.append(
                f"Significant skill gaps: Missing {missing} skills. Priority: {', '.join(top_missing)}"
            )
        
        if breakdown["experience"] < 60:
            required = score_data["experience_analysis"]["required_years"]
            actual = score_data["experience_analysis"]["resume_years"]
            gap = required - actual
            weaknesses.append(f"Experience gap: Need {gap} more years to meet requirement ({actual}/{required})")
        
        if breakdown["projects"] < 50:
            weaknesses.append("Limited project/portfolio evidence. Add concrete work examples.")
        
        if breakdown["education"] < 60:
            weaknesses.append("Educational background may not match job requirements")
        
        if breakdown["keywords_formatting"] < 65:
            issues = score_data["formatting_issues"]
            if issues:
                weaknesses.append(f"ATS formatting issues: {'; '.join(issues[:2])}")
        
        if breakdown["certifications"] < 40:
            weaknesses.append("No relevant certifications listed")
        
        return weaknesses if weaknesses else []
    
    def _generate_recommendations(
        self, 
        resume_text: str, 
        job_description: str,
        score_data: Dict
    ) -> List[Dict]:
        """
        Generate specific, actionable recommendations.
        
        Args:
            resume_text: Resume text
            job_description: Job description
            score_data: Scoring data
            
        Returns:
            List of recommendations with priority
        """
        recommendations = []
        improvements = score_data["improvements_priority"]
        
        for improvement in improvements[:2]:  # Focus on top 2 weaknesses
            area = improvement["area"].lower()
            current = improvement["current_score"]
            
            if area == "Skills":
                missing = score_data["skill_analysis"]["missing_skills"][:3]
                recommendations.append({
                    "priority": "HIGH",
                    "area": "Skills Development",
                    "action": f"Focus on learning: {', '.join(missing)}",
                    "impact": "Completing these skills could increase match by 15-25%",
                    "timeline": "3-6 months",
                    "learning_resources": self._suggest_learning_resources(missing)
                })
            
            elif area == "Experience":
                years_gap = score_data["experience_analysis"]["required_years"] - score_data["experience_analysis"]["resume_years"]
                recommendations.append({
                    "priority": "MEDIUM",
                    "area": "Professional Experience",
                    "action": f"Gain {years_gap} years of relevant experience through internships or entry-level roles",
                    "impact": "Would move you from entry-level to competitive candidate",
                    "timeline": f"{years_gap} years",
                    "learning_resources": None
                })
            
            elif area == "Projects":
                recommendations.append({
                    "priority": "HIGH",
                    "area": "Portfolio Development",
                    "action": "Create 2-3 portfolio projects using required tech stack",
                    "impact": "Demonstrates practical ability and increases credibility by 15%+",
                    "timeline": "2-3 months",
                    "learning_resources": ["GitHub portfolio", "Personal blog with project walkthroughs"]
                })
            
            elif area == "Keywords_Formatting":
                recommendations.append({
                    "priority": "MEDIUM",
                    "area": "Resume Optimization",
                    "action": "Reformat resume to remove tables/special chars and add key skill keywords",
                    "impact": "Better ATS parsing can improve keyword matching by 10%",
                    "timeline": "1-2 weeks",
                    "learning_resources": ["ATS-friendly resume templates", "Tailor resume for each job"]
                })
        
        return recommendations
    
    def _suggest_learning_resources(self, skills: List[str]) -> List[str]:
        """Suggest learning resources for missing skills."""
        resources = {
            "python": ["Codecademy Python Course", "Real Python tutorials", "LeetCode Python problems"],
            "javascript": ["freeCodeCamp JavaScript", "MDN JavaScript guide", "Eloquent JavaScript book"],
            "react": ["React official documentation", "Scrimba React course", "Build 5+ React projects"],
            "flutter": ["Flutter official docs", "Udacity Flutter course"],
            "aws": ["AWS Free Tier practice", "A Cloud Guru AWS course", "Build projects on AWS"],
            "machinelearning": ["Andrew Ng ML course", "Kaggle competitions", "Fast.ai"],
        }
        
        suggestions = []
        for skill in skills:
            skill_lower = skill.lower()
            if skill_lower in resources:
                suggestions.extend(resources[skill_lower][:1])
        
        return suggestions[:3] if suggestions else ["Udemy", "Coursera", "Official documentation"]
    
    def _generate_next_steps(self, score_data: Dict) -> List[Dict]:
        """Generate clear, prioritized next steps."""
        overall = score_data["overall_score"]
        next_steps = []
        
        if overall >= 85:
            next_steps = [
                {
                    "step": 1,
                    "action": "Apply immediately",
                    "reason": "Your profile is a strong match for this role"
                },
                {
                    "step": 2,
                    "action": "Customize cover letter emphasizing matched skills",
                    "reason": f"Highlight your {len(score_data['skill_analysis']['matched_skills'])} core competencies"
                },
                {
                    "step": 3,
                    "action": "Prepare for technical interview",
                    "reason": "Your qualification is strong - focus on interviewing skills"
                }
            ]
        elif overall >= 70:
            next_steps = [
                {
                    "step": 1,
                    "action": "Review missing skills list",
                    "reason": f"{len(score_data['skill_analysis']['missing_skills'])} skills could improve fit"
                },
                {
                    "step": 2,
                    "action": "Apply with tailored resume",
                    "reason": "Reformat resume to emphasize matching competencies"
                },
                {
                    "step": 3,
                    "action": "Plan 2-3 week skill improvement sprint",
                    "reason": "Quick wins in top 2 missing skills could significantly increase competitiveness"
                }
            ]
        elif overall >= 50:
            next_steps = [
                {
                    "step": 1,
                    "action": "Create a 3-month learning plan",
                    "reason": f"Focus on top {len(score_data['skill_analysis']['missing_skills'][:3])} missing skills"
                },
                {
                    "step": 2,
                    "action": "Build relevant projects",
                    "reason": "Practical experience will strengthen your candidacy significantly"
                },
                {
                    "step": 3,
                    "action": "Consider related junior roles first",
                    "reason": "Gain experience before applying to senior positions"
                }
            ]
        else:
            next_steps = [
                {
                    "step": 1,
                    "action": "Reassess job fit",
                    "reason": "This role requires significantly different skillset than yours"
                },
                {
                    "step": 2,
                    "action": "Look for entry-level or junior positions",
                    "reason": "Start with roles closer to current skill level"
                },
                {
                    "step": 3,
                    "action": "Create comprehensive learning roadmap",
                    "reason": f"6-12 month plan to develop core skills: {', '.join(score_data['skill_analysis']['missing_skills'][:3])}"
                }
            ]
        
        return next_steps
    
    def _generate_ai_narrative(self, score_data: Dict) -> str:
        """
        Generate dynamic AI insights paragraph (not template-based).
        
        Args:
            score_data: Scoring data
            
        Returns:
            Personalized insight paragraph
        """
        overall = score_data["overall_score"]
        matched_count = len(score_data["skill_analysis"]["matched_skills"])
        missing_count = len(score_data["skill_analysis"]["missing_skills"])
        level = score_data["resume_level"]
        breakdown = score_data["score_breakdown"]
        
        # Build narrative based on actual performance
        parts = []
        
        # Opening statement
        if overall >= 85:
            parts.append(
                f"Your profile demonstrates exceptional alignment with this opportunity. "
                f"With {matched_count} out of {matched_count + missing_count} critical skills already in place, "
                f"you've built a strong foundation as a {level}."
            )
        elif overall >= 70:
            parts.append(
                f"Your background shows solid promise for this role. You bring {matched_count} essential skills "
                f"to the table, positioning you as an {level}. The remaining {missing_count} skill gaps are "
                f"addressable with focused development."
            )
        elif overall >= 50:
            parts.append(
                f"While your resume contains {matched_count} relevant skills, there's a noticeable gap "
                f"with {missing_count} required competencies. Your current level is {level}, suggesting "
                f"growth potential with targeted skill development."
            )
        else:
            parts.append(
                f"Your resume shows {matched_count} matching skills but has {missing_count} significant gaps. "
                f"At the {level} stage, you may benefit from transitioning to entry-level roles first "
                f"before moving to this level."
            )
        
        # Highlight strongest area
        max_component = max(breakdown.items(), key=lambda x: x[1])
        parts.append(
            f"Your strongest area is {max_component[0].replace('_', ' ').lower()} (score: {max_component[1]:.0f}), "
            f"providing a solid advantage."
        )
        
        # Point out critical gap if exists
        if missing_count > 0:
            top_missing = score_data["skill_analysis"]["missing_skills"][:2]
            parts.append(
                f"To move from {level} to 'Strong Candidate', prioritize mastering {' and '.join(top_missing)}, "
                f"which are in high demand for this role."
            )
        
        # Closing recommendation
        if overall >= 80:
            parts.append("with your current qualifications, you should move forward with an application.")
        elif overall >= 60:
            parts.append("A 4-8 week focused improvement plan in your weakest areas could significantly boost your candidacy.")
        else:
            parts.append("A comprehensive 3-6 month learning path is recommended before applying to similar roles.")
        
        return " ".join(parts)
