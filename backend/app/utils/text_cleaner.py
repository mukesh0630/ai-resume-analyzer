"""
Text cleaning and normalization utilities.
Handles PDF artifacts, bullet points, spacing, and standard tokenization.
"""

import re
from typing import List, Set


def clean_text(text: str) -> str:
    """
    Normalize text: remove extra whitespace, standardize bullets, clean newlines.
    
    Args:
        text: Raw text from resume or job description
        
    Returns:
        Cleaned, normalized text
    """
    if not text:
        return ""
    
    # Normalize line breaks
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    
    # Standardize bullet points
    text = re.sub(r"[•●▪◆◇■□▫➤→]", "-", text)
    
    # Remove excessive whitespace
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n", text)
    
    # Clean up PDF artifacts
    text = text.replace("\x00", "").strip()
    
    return text.strip()


def tokenize(text: str, lowercase: bool = True, min_length: int = 2) -> List[str]:
    """
    Tokenize text into words while preserving order and removing duplicates.
    
    Args:
        text: Input text to tokenize
        lowercase: Whether to convert to lowercase
        min_length: Minimum token length
        
    Returns:
        List of deduplicated tokens
    """
    if not text:
        return []
    
    text = text.lower() if lowercase else text
    
    # Remove special characters but preserve programming symbols
    text = re.sub(r"[^\w\s+#\.\-]", " ", text)
    
    tokens = [
        tok.strip() 
        for tok in text.split() 
        if len(tok.strip()) >= min_length
    ]
    
    # Preserve order while removing duplicates
    return list(dict.fromkeys(tokens))


def extract_text_sections(text: str) -> dict:
    """
    Extract major resume sections (experience, education, skills, projects).
    Uses regex patterns to identify common section headers.
    
    Args:
        text: Full resume text
        
    Returns:
        Dictionary with extracted sections
    """
    text = clean_text(text)
    
    sections = {
        "full_text": text,
        "skills": "",
        "experience": "",
        "education": "",
        "projects": "",
        "certifications": ""
    }
    
    # Common section patterns
    patterns = {
        "skills": r"(?:^|\n)(skills|technical skills|core competencies|technologies|tech stack)[\s\S]*?(?=\n(?:experience|education|projects|certifications|$))",
        "experience": r"(?:^|\n)(experience|work experience|employment|professional)[\s\S]*?(?=\n(?:education|skills|projects|certifications|$))",
        "education": r"(?:^|\n)(education|academic|schooling|degrees)[\s\S]*?(?=\n(?:experience|skills|projects|certifications|$))",
        "projects": r"(?:^|\n)(projects|portfolio|work samples)[\s\S]*?(?=\n(?:experience|education|skills|certifications|$))",
        "certifications": r"(?:^|\n)(certifications|licenses|credentials|awards)[\s\S]*?(?=\n(?:experience|education|skills|projects|$))"
    }
    
    for section, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if match:
            sections[section] = clean_text(match.group(0))
    
    return sections


def extract_years_of_experience(text: str) -> int:
    """
    Extract total years of experience from resume text.
    Looks for patterns like "5 years", "2023-2024", etc.
    
    Args:
        text: Resume text
        
    Returns:
        Estimated years of experience (0 if not found)
    """
    text_lower = text.lower()
    
    # Pattern: "X years" or "X+ years"
    year_pattern = r"(\d+)\s*\+?\s*(?:year|yr)s?"
    matches = re.findall(year_pattern, text_lower)
    
    if matches:
        # Sum all matches (rough estimate) or take max
        total_years = max(int(m) for m in matches)
        return min(total_years, 50)  # Cap at 50 years
    
    # Pattern: Year ranges (2020-2023)
    date_pattern = r"(20\d{2})\s*[-–]\s*(20\d{2}|present|current)"
    date_matches = re.findall(date_pattern, text_lower)
    
    if date_matches:
        years = []
        current_year = 2026  # Adjust as needed
        for start, end in date_matches:
            end_year = current_year if end.lower() in ["present", "current"] else int(end)
            years.append(end_year - int(start))
        return min(sum(years), 50)
    
    return 0


def calculate_text_density(text: str, keyword: str) -> float:
    """
    Calculate keyword density percentage in text.
    
    Args:
        text: Input text
        keyword: Keyword to find
        
    Returns:
        Percentage of text that is the keyword (0-100)
    """
    if not text or not keyword:
        return 0.0
    
    text_lower = text.lower()
    keyword_lower = keyword.lower()
    
    keyword_count = len(re.findall(rf"\b{re.escape(keyword_lower)}\b", text_lower))
    total_words = len(tokenize(text))
    
    if total_words == 0:
        return 0.0
    
    return (keyword_count / total_words) * 100


def has_ats_formatting_issues(text: str) -> List[str]:
    """
    Check for common ATS formatting issues.
    
    Args:
        text: Resume text
        
    Returns:
        List of formatting issues found
    """
    issues = []
    
    # Check for tables (ATS can't parse)
    if re.search(r"\|.*\|", text):
        issues.append("Contains tables (ATS may skip content)")
    
    # Check for excessive special characters
    special_char_ratio = len(re.findall(r"[^\w\s]", text)) / max(len(text), 1)
    if special_char_ratio > 0.15:
        issues.append("Excessive special characters (may confuse ATS)")
    
    # Check for missing standard sections
    standard_sections = ["experience", "education", "skills"]
    text_lower = text.lower()
    if not any(section in text_lower for section in standard_sections):
        issues.append("Missing standard resume sections")
    
    # Check for very short resume
    word_count = len(tokenize(text))
    if word_count < 100:
        issues.append("Resume is too short (< 100 words)")
    
    return issues
