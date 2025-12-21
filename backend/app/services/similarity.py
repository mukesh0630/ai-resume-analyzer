from difflib import SequenceMatcher

def similarity_score(a: str, b: str) -> float:
    return round(SequenceMatcher(None, a, b).ratio() * 100, 2)
