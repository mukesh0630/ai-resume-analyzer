"""
Similarity and fuzzy matching utilities for skill extraction.
Provides fuzzy string matching, synonym mapping, and skill normalization.
"""

from typing import List, Tuple
import re


class SynonymMatcher:
    """
    Handles synonym mapping for common skill variations.
    Example: JS → JavaScript, React.js → React
    """
    
    SYNONYMS = {
        "js": "javascript",
        "ts": "typescript",
        "py": "python",
        "k8s": "kubernetes",
        "react.js": "react",
        "reactjs": "react",
        "vue.js": "vue",
        "vuejs": "vue",
        "next.js": "nextjs",
        "node.js": "nodejs",
        "c++": "cpp",
        "c#": "csharp",
        "postgresql": "postgres",
        "mongodb": "mongo",
        "machine learning": "ml",
        "artificial intelligence": "ai",
        "natural language processing": "nlp",
        "amazon web services": "aws",
        "google cloud platform": "gcp",
    }
    
    def normalize(self, text: str) -> str:
        """
        Normalize text using synonym mapping.
        
        Args:
            text: Input text to normalize
            
        Returns:
            Normalized text
        """
        text_lower = text.lower().strip()
        return self.SYNONYMS.get(text_lower, text_lower)
    
    def get_canonical(self, text: str) -> str:
        """
        Get canonical form of a skill.
        
        Args:
            text: Skill name
            
        Returns:
            Canonical skill name
        """
        return self.normalize(text)


class SkillNormalizer:
    """
    Normalizes skill strings for comparison.
    Handles case, whitespace, and special characters.
    """
    
    @staticmethod
    def normalize(text: str) -> str:
        """
        Normalize skill text for comparison.
        
        Args:
            text: Input text
            
        Returns:
            Normalized text
        """
        if not text:
            return ""
        
        # Lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = " ".join(text.split())
        
        # Remove special characters except alphanumeric, spaces, and common punctuation
        text = re.sub(r"[^\w\s\.\-\+\#]", "", text)
        
        return text.strip()
    
    @staticmethod
    def tokenize(text: str) -> List[str]:
        """
        Tokenize text into normalized words.
        
        Args:
            text: Input text
            
        Returns:
            List of normalized tokens
        """
        normalized = SkillNormalizer.normalize(text)
        return [t for t in normalized.split() if len(t) > 1]


def levenshtein_distance(s1: str, s2: str) -> int:
    """
    Calculate Levenshtein distance between two strings.
    
    Args:
        s1: First string
        s2: Second string
        
    Returns:
        Edit distance between strings
    """
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            # Cost of insertions, deletions, or substitutions
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]


def string_similarity(s1: str, s2: str) -> float:
    """
    Calculate similarity between two strings (0.0 to 1.0).
    Uses normalized Levenshtein distance.
    
    Args:
        s1: First string
        s2: Second string
        
    Returns:
        Similarity score (1.0 = identical, 0.0 = completely different)
    """
    if not s1 or not s2:
        return 0.0
    
    # Normalize strings
    normalizer = SkillNormalizer()
    s1_norm = normalizer.normalize(s1)
    s2_norm = normalizer.normalize(s2)
    
    if s1_norm == s2_norm:
        return 1.0
    
    # Calculate Levenshtein distance
    distance = levenshtein_distance(s1_norm, s2_norm)
    max_len = max(len(s1_norm), len(s2_norm))
    
    if max_len == 0:
        return 0.0
    
    # Convert distance to similarity (0-1 range)
    similarity = 1.0 - (distance / max_len)
    
    return max(0.0, min(1.0, similarity))


def fuzzy_match(
    query: str, 
    candidates: List[str], 
    threshold: float = 0.8
) -> List[Tuple[str, float]]:
    """
    Find fuzzy matches for a query string in a list of candidates.
    
    Args:
        query: String to match
        candidates: List of candidate strings
        threshold: Minimum similarity score (0.0-1.0)
        
    Returns:
        List of (candidate, score) tuples sorted by score descending
    """
    if not query or not candidates:
        return []
    
    matches = []
    
    for candidate in candidates:
        similarity = string_similarity(query, candidate)
        if similarity >= threshold:
            matches.append((candidate, similarity))
    
    # Sort by similarity descending
    matches.sort(key=lambda x: x[1], reverse=True)
    
    return matches


def contains_substring_fuzzy(text: str, query: str, threshold: float = 0.85) -> bool:
    """
    Check if text contains query as a fuzzy substring.
    
    Args:
        text: Text to search in
        query: Query string
        threshold: Similarity threshold
        
    Returns:
        True if fuzzy match found
    """
    if not text or not query:
        return False
    
    text_lower = text.lower()
    query_lower = query.lower()
    
    # Exact match
    if query_lower in text_lower:
        return True
    
    # Fuzzy match on tokens
    normalizer = SkillNormalizer()
    text_tokens = normalizer.tokenize(text)
    query_tokens = normalizer.tokenize(query)
    
    for text_token in text_tokens:
        for query_token in query_tokens:
            if string_similarity(text_token, query_token) >= threshold:
                return True
    
    return False
