"""
Enhanced resume parser for structured data extraction.
Extracts experience, education, projects, and other resume components.
"""

import re
from typing import Dict, List, Tuple
from backend.app.utils.text_cleaner import (
    clean_text, 
    extract_text_sections, 
    extract_years_of_experience,
    tokenize
)


class ResumeStructuredParser:
    """Parse and extract structured data from resume text."""
    
    def __init__(self):
        """Initialize parser."""
        pass
    
    def parse_full(self, resume_text: str) -> Dict:
        """
        Parse entire resume and extract all structured data.
        
        Args:
            resume_text: Raw resume text
            
        Returns:
            Dictionary with parsed resume data
        """
        clean = clean_text(resume_text)
        sections = extract_text_sections(clean)
        
        return {
            "full_text": clean,
            "word_count": len(tokenize(clean)),
            
            # Structured data
            "experience": self._parse_experience(sections.get("experience", "")),
            "education": self._parse_education(sections.get("education", "")),
            "skills_section": self._parse_skills_section(sections.get("skills", "")),
            "projects": self._parse_projects(sections.get("projects", "")),
            "certifications": self._parse_certifications(sections.get("certifications", "")),
            
            # Metrics
            "total_years_experience": extract_years_of_experience(clean),
            "company_count": self._count_companies(sections.get("experience", "")),
            "education_level": self._detect_education_level(sections.get("education", "")),
        }
    
    def _parse_experience(self, experience_text: str) -> List[Dict]:
        """
        Extract work experience entries from experience section.
        
        Args:
            experience_text: Experience section text
            
        Returns:
            List of experience dictionaries
        """
        if not experience_text:
            return []
        
        experiences = []
        
        # Split by common job separators (newlines with capitalized words)
        lines = experience_text.split("\n")
        
        current_job = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this looks like a job title line (usually uppercase or title case after company)
            if re.match(r"^[A-Z][A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Consultant|Lead|Architect)", line):
                if current_job:
                    experiences.append(current_job)
                
                current_job = {
                    "title": line,
                    "duration": "",
                    "description": ""
                }
            elif current_job and ("20" in line or "-" in line):
                # Likely a date range
                current_job["duration"] = line
            elif current_job:
                # Add to description
                current_job["description"] += " " + line
        
        if current_job:
            experiences.append(current_job)
        
        return experiences
    
    def _parse_education(self, education_text: str) -> List[Dict]:
        """
        Extract education entries.
        
        Args:
            education_text: Education section text
            
        Returns:
            List of education dictionaries
        """
        if not education_text:
            return []
        
        education = []
        
        # Look for degree patterns
        degree_pattern = r"(Bachelor|Master|PhD|Associate|Diploma|Certificate).*?(?:in|of)?\s+([A-Za-z\s]+?)(?:\n|$)"
        
        matches = re.finditer(degree_pattern, education_text, re.IGNORECASE)
        for match in matches:
            education.append({
                "degree": match.group(1),
                "field": match.group(2).strip(),
                "text": match.group(0).strip()
            })
        
        return education
    
    def _parse_skills_section(self, skills_text: str) -> List[str]:
        """
        Extract listed skills from skills section.
        
        Args:
            skills_text: Skills section text
            
        Returns:
            List of skill strings
        """
        if not skills_text:
            return []
        
        # Remove section header
        skills_text = re.sub(r"^.*?(?:skills|competencies).*?\n", "", skills_text, flags=re.IGNORECASE)
        
        # Split by common delimiters
        skills = re.split(r"[•,;-]|\n", skills_text)
        
        # Clean and flatten
        skills = [s.strip() for s in skills if s.strip()]
        
        return skills
    
    def _parse_projects(self, projects_text: str) -> List[Dict]:
        """
        Extract project information.
        
        Args:
            projects_text: Projects section text
            
        Returns:
            List of project dictionaries
        """
        if not projects_text:
            return []
        
        projects = []
        
        # Split by project separators
        project_blocks = re.split(r"\n\n+", projects_text)
        
        for block in project_blocks:
            if block.strip():
                projects.append({
                    "title": block.split("\n")[0].strip(),
                    "description": block.strip()
                })
        
        return projects
    
    def _parse_certifications(self, cert_text: str) -> List[str]:
        """
        Extract certifications and credentials.
        
        Args:
            cert_text: Certifications section text
            
        Returns:
            List of certification strings
        """
        if not cert_text:
            return []
        
        # Remove section header
        cert_text = re.sub(r"^.*?(?:certifications|licenses).*?\n", "", cert_text, flags=re.IGNORECASE)
        
        # Split by bullets or newlines
        certs = re.split(r"[•,;-]|\n", cert_text)
        
        return [c.strip() for c in certs if c.strip()]
    
    def _count_companies(self, experience_text: str) -> int:
        """
        Estimate number of companies from experience section.
        
        Args:
            experience_text: Experience section text
            
        Returns:
            Estimated company count
        """
        if not experience_text:
            return 0
        
        # Count company name patterns (usually followed by title)
        # This is approximate but counts sections separated by blank lines
        sections = experience_text.split("\n\n")
        
        return max(1, len([s for s in sections if s.strip()]))
    
    def _detect_education_level(self, education_text: str) -> str:
        """
        Detect highest education level.
        
        Args:
            education_text: Education section text
            
        Returns:
            Education level (e.g., "Bachelor's Degree")
        """
        if not education_text:
            return "Not specified"
        
        education_lower = education_text.lower()
        
        if "phd" in education_lower or "doctorate" in education_lower:
            return "PhD / Doctorate"
        elif "master" in education_lower:
            return "Master's Degree"
        elif "bachelor" in education_lower:
            return "Bachelor's Degree"
        elif "associate" in education_lower:
            return "Associate's Degree"
        elif "diploma" in education_lower or "certificate" in education_lower:
            return "Diploma / Certificate"
        
        return "Not specified"
