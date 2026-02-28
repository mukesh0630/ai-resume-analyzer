"""
Advanced skill matching and extraction service.
Combines exact matches, fuzzy matching, and synonym detection.
"""

import re
from typing import Dict, List, Set, Tuple
from backend.app.utils.similarity import SynonymMatcher, SkillNormalizer, string_similarity, fuzzy_match
from backend.app.utils.text_cleaner import tokenize


# Comprehensive skill keyword dictionary with categories
SKILL_CATEGORIES = {
    "programming_languages": {
        "python": ["python", "py"],
        "java": ["java"],
        "javascript": ["javascript", "js"],
        "typescript": ["typescript", "ts"],
        "cpp": ["c++", "cpp"],
        "csharp": ["c#"],
        "go": ["golang", "go"],
        "rust": ["rust"],
        "php": ["php"],
        "ruby": ["ruby"],
        "kotlin": ["kotlin"],
        "swift": ["swift"],
    },
    
    "frontend": {
        "react": ["react", "reactjs"],
        "angular": ["angular"],
        "vue": ["vue", "vuejs"],
        "html": ["html", "html5"],
        "css": ["css", "css3"],
        "nextjs": ["nextjs", "next.js"],
        "tailwind": ["tailwind"],
        "bootstrap": ["bootstrap"],
        "webpack": ["webpack"],
        "vite": ["vite"],
    },
    
    "backend": {
        "nodejs": ["nodejs", "node.js", "node"],
        "django": ["django", "drf"],
        "fastapi": ["fastapi"],
        "flask": ["flask"],
        "spring": ["spring", "springboot"],
        "express": ["express"],
        "nestjs": ["nestjs"],
        "graphql": ["graphql"],
    },
    
    "databases": {
        "mongodb": ["mongodb", "mongo"],
        "postgresql": ["postgresql", "postgres"],
        "mysql": ["mysql"],
        "redis": ["redis"],
        "firebase": ["firebase", "firestore"],
        "elasticsearch": ["elasticsearch"],
        "oracle": ["oracle"],
    },
    
    "cloud_devops": {
        "aws": ["aws", "amazon web services"],
        "gcp": ["gcp", "google cloud"],
        "azure": ["azure"],
        "docker": ["docker"],
        "kubernetes": ["kubernetes", "k8s"],
        "cicd": ["ci/cd", "github actions", "jenkins"],
        "terraform": ["terraform"],
    },
    
    "tools_platforms": {
        "git": ["git", "github", "gitlab"],
        "jira": ["jira"],
        "postman": ["postman"],
        "linux": ["linux"],
        "windows": ["windows"],
        "macos": ["macos"],
    },
    
    "data_ai_ml": {
        "machinelearning": ["machine learning", "ml"],
        "deeplearning": ["deep learning"],
        "nlp": ["nlp", "natural language processing"],
        "tensorflow": ["tensorflow"],
        "pytorch": ["pytorch"],
        "pandas": ["pandas"],
        "numpy": ["numpy"],
        "sklearn": ["scikit-learn", "sklearn"],
    },
    
    "soft_skills": {
        "communication": ["communication", "verbal communication"],
        "teamwork": ["teamwork", "collaboration"],
        "leadership": ["leadership"],
        "problem_solving": ["problem solving"],
        "critical_thinking": ["critical thinking"],
        "time_management": ["time management"],
    }
}


def flatten_skill_dict() -> Dict[str, str]:
    """
    Flatten SKILL_CATEGORIES into {variant: canonical} mapping.
    
    Returns:
        Dictionary mapping skill variants to canonical names
    """
    flat = {}
    for category, skills in SKILL_CATEGORIES.items():
        for canonical, variants in skills.items():
            for variant in variants:
                flat[variant.lower()] = canonical.lower()
    return flat


class SkillMatcher:
    """Main skill extraction and matching engine."""
    
    def __init__(self):
        """Initialize matcher with skill dictionary and helpers."""
        self.skill_dict = flatten_skill_dict()
        self.synonym_matcher = SynonymMatcher()
        self.normalizer = SkillNormalizer()
        self.all_skills = set(self.skill_dict.values())
    
    def extract_skills(self, text: str, use_fuzzy: bool = True) -> Set[str]:
        """
        Extract skills from text using multiple strategies:
        1. Exact regex match on known variants
        2. Fuzzy matching on tokens (if enabled)
        3. Synonym normalization
        
        Args:
            text: Input text to extract skills from
            use_fuzzy: Enable fuzzy matching for variations
            
        Returns:
            Set of canonical skill names
        """
        if not text:
            return set()
        
        text_lower = text.lower()
        found_skills = set()
        
        # Strategy 1: Exact regex matches on known variants
        for variant, canonical in self.skill_dict.items():
            pattern = rf"\b{re.escape(variant)}\b"
            if re.search(pattern, text_lower):
                found_skills.add(canonical)
        
        # Strategy 2: Fuzzy matching on tokenized text
        if use_fuzzy:
            tokens = tokenize(text)
            variants_list = list(self.skill_dict.keys())
            
            for token in tokens:
                if token not in self.skill_dict:
                    matches = fuzzy_match(token, variants_list, threshold=0.82)
                    if matches:
                        best_match = matches[0][0]
                        canonical = self.skill_dict.get(best_match)
                        if canonical:
                            found_skills.add(canonical)
        
        return found_skills
    
    def match_skills(
        self, 
        resume_text: str, 
        job_text: str
    ) -> Dict:
        """
        Match resume skills against job description skills.
        Returns matched, missing, and partial matches.
        
        Args:
            resume_text: Resume content
            job_text: Job description content
            
        Returns:
            Dictionary with matched, missing, and partial skills
        """
        resume_skills = self.extract_skills(resume_text)
        job_skills = self.extract_skills(job_text)
        
        if not job_skills:
            return {
                "matched_skills": [],
                "missing_skills": [],
                "partial_match_skills": [],
                "resume_skills": sorted(resume_skills),
                "job_skills": [],
            }
        
        matched = resume_skills & job_skills
        missing = job_skills - resume_skills
        
        # Check for partial matches (fuzzy match on missing skills)
        partial_match_skills = self._find_partial_matches(
            missing, 
            resume_skills, 
            threshold=0.75
        )
        
        return {
            "matched_skills": sorted(matched),
            "missing_skills": sorted(missing - partial_match_skills),
            "partial_match_skills": sorted(partial_match_skills),
            "resume_skills": sorted(resume_skills),
            "job_skills": sorted(job_skills),
        }
    
    def _find_partial_matches(
        self, 
        missing_skills: Set[str], 
        resume_skills: Set[str], 
        threshold: float = 0.75
    ) -> Set[str]:
        """
        Find skills that partially match missing skills.
        Example: resume has "react" but job wants "reactjs"
        
        Args:
            missing_skills: Skills required but not found exactly
            resume_skills: Skills found in resume
            threshold: Similarity threshold
            
        Returns:
            Set of partially matched skills
        """
        partial_matches = set()
        
        for missing in missing_skills:
            for resume_skill in resume_skills:
                similarity = string_similarity(missing, resume_skill)
                if threshold <= similarity < 1.0:
                    partial_matches.add(missing)
        
        return partial_matches
    
    def get_skill_category(self, skill: str) -> str | None:
        """
        Get category of a skill.
        
        Args:
            skill: Skill name
            
        Returns:
            Category name or None
        """
        skill_lower = skill.lower()
        
        for category, skills in SKILL_CATEGORIES.items():
            if skill_lower in skills:
                return category.replace("_", " ").title()
        
        return None
    
    def suggest_related_skills(self, skill: str, count: int = 3) -> List[str]:
        """
        Suggest related skills for a given skill.
        
        Args:
            skill: Skill name
            count: Number of suggestions
            
        Returns:
            List of related skill suggestions
        """
        category = self.get_skill_category(skill)
        if not category:
            return []
        
        # Find all skills in same category
        category_key = category.lower().replace(" ", "_")
        if category_key not in SKILL_CATEGORIES:
            return []
        
        category_skills = list(SKILL_CATEGORIES[category_key].keys())
        
        # Sort by similarity to input skill
        similar = sorted(
            category_skills,
            key=lambda s: string_similarity(skill, s),
            reverse=True
        )
        
        return similar[1:count+1]  # Exclude the skill itself
