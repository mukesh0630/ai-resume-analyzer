"""
Similarity and fuzzy matching utilities.
Handles string similarity, synonym matching, and close matches.
"""

from difflib import SequenceMatcher
from typing import List, Tuple, Dict, Set
import re


def string_similarity(str1: str, str2: str) -> float:
    """
    Calculate similarity ratio between two strings (0-1).
    
    Args:
        str1: First string
        str2: Second string
        
    Returns:
        Similarity score (0.0 to 1.0)
    """
    str1 = str1.lower().strip()
    str2 = str2.lower().strip()
    
    if str1 == str2:
        return 1.0
    
    return SequenceMatcher(None, str1, str2).ratio()


def fuzzy_match(text: str, targets: List[str], threshold: float = 0.80) -> List[Tuple[str, float]]:
    """
    Find fuzzy matches of text against a list of targets.
    
    Args:
        text: Text to match
        targets: List of target strings
        threshold: Minimum similarity score (0-1)
        
    Returns:
        List of (target, similarity_score) tuples sorted by score descending
    """
    text_lower = text.lower().strip()
    
    matches = [
        (target, string_similarity(text_lower, target.lower()))
        for target in targets
        if string_similarity(text_lower, target.lower()) >= threshold
    ]
    
    return sorted(matches, key=lambda x: x[1], reverse=True)


def find_close_match(text: str, targets: List[str], threshold: float = 0.80) -> str | None:
    """
    Find single best match from targets.
    
    Args:
        text: Text to match
        targets: List of target strings
        threshold: Minimum similarity score
        
    Returns:
        Best matching target or None
    """
    matches = fuzzy_match(text, targets, threshold)
    return matches[0][0] if matches else None


class SynonymMatcher:
    """Handles skill synonym matching."""
    
    def __init__(self):
        """Initialize with common tech skill synonyms."""
        self.synonyms: Dict[str, Set[str]] = {
            # Programming Languages
            "javascript": {"js", "javascript", "ecmascript"},
            "typescript": {"ts", "typescript"},
            "python": {"py", "python"},
            "cpp": {"c++", "cpp"},
            "csharp": {"c#", "csharp"},
            
            # Frontend
            "react": {"react", "reactjs", "react.js"},
            "angular": {"angular", "ng", "angularjs"},
            "vue": {"vue", "vuejs", "vue.js"},
            "nextjs": {"next", "nextjs", "next.js"},
            
            # Backend
            "nodejs": {"node", "nodejs", "node.js"},
            "django": {"django", "drf", "django rest"},
            "fastapi": {"fastapi", "fast api"},
            "spring": {"spring", "springboot", "spring boot"},
            
            # Databases
            "mongodb": {"mongo", "mongodb"},
            "postgresql": {"postgres", "postgresql", "psql"},
            "mysql": {"mysql"},
            "firebase": {"firebase", "firestore"},
            
            # Cloud/DevOps
            "aws": {"aws", "amazon web services"},
            "gcp": {"gcp", "google cloud"},
            "azure": {"azure", "ms azure"},
            "kubernetes": {"k8s", "kubernetes"},
            
            # Version Control
            "git": {"git", "github", "gitlab"},
            
            # ML/AI
            "tensorflow": {"tensorflow", "tf"},
            "pytorch": {"pytorch", "torch"},
            "machinelearning": {"ml", "machine learning"},
            
            # Soft Skills
            "communication": {"communication", "interpersonal"},
            "teamwork": {"teamwork", "collaboration", "team player"},
            "leadership": {"leadership", "managing"},
        }
    
    def get_canonical_form(self, text: str) -> str | None:
        """
        Convert text to canonical skill name if it's a known synonym.
        
        Args:
            text: Skill name (potentially a synonym)
            
        Returns:
            Canonical form or None
        """
        text_lower = text.lower().strip()
        
        for canonical, syns in self.synonyms.items():
            if text_lower in syns:
                return canonical
        
        return None
    
    def is_synonym(self, text: str, target_skill: str) -> bool:
        """
        Check if text is a synonym of target_skill.
        
        Args:
            text: Text to check
            target_skill: Target skill name
            
        Returns:
            True if text is a synonym of target_skill
        """
        text_lower = text.lower().strip()
        target_lower = target_skill.lower().strip()
        
        if target_lower in self.synonyms:
            return text_lower in self.synonyms[target_lower]
        
        return False
    
    def find_all_synonyms(self, skill: str) -> Set[str]:
        """
        Get all known synonyms for a skill.
        
        Args:
            skill: Skill name
            
        Returns:
            Set of all synonyms including the skill itself
        """
        skill_lower = skill.lower().strip()
        
        for canonical, syns in self.synonyms.items():
            if skill_lower in syns or skill_lower == canonical:
                return syns | {canonical}
        
        return {skill_lower}


class SkillNormalizer:
    """Normalize and standardize skill names."""
    
    def __init__(self):
        """Initialize with common skill variations."""
        self.synonym_matcher = SynonymMatcher()
    
    def normalize(self, text: str) -> str | None:
        """
        Normalize skill text to canonical form.
        
        Args:
            text: Raw skill text
            
        Returns:
            Normalized skill name or None
        """
        text_clean = text.lower().strip()
        
        # Remove common suffixes
        for suffix in [" framework", " library", " tool", " language"]:
            text_clean = text_clean.replace(suffix, "")
        
        # Check synonyms
        canonical = self.synonym_matcher.get_canonical_form(text_clean)
        if canonical:
            return canonical
        
        return text_clean
