import re




def clean_text(text: str) -> str:
    """
    Normalize whitespace, newlines, bullets
    """
    text = text.replace("\t", " ")
    text = re.sub(r"\n+", "\n", text)
    text = re.sub(r"[•●▪]", "-", text)
    text = re.sub(r" +", " ", text)
    return text.strip()


def merge_preview_and_full(text: str) -> str:
    # In some parsers there might be preview markers or truncated text.
    # This helper normalizes whitespace and returns the cleaned full text.
    if not text:
        return ""
    t = clean_text(text)
    # remove repeated short previews like '...'
    t = t.replace("...", " ")
    t = "\n".join(line.strip() for line in t.splitlines() if line.strip())
    return t


def extract_text_from_pdf(file_path: str) -> str:
    try:
        import PyPDF2
    except Exception as e:
        raise RuntimeError("PyPDF2 is required for PDF parsing") from e

    text = ""

    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    return clean_text(text)


def extract_text_from_docx(file_path: str) -> str:
    try:
        from docx import Document
    except Exception as e:
        raise RuntimeError("python-docx is required for DOCX parsing") from e

    doc = Document(file_path)
    text = []

    for para in doc.paragraphs:
        if para.text.strip():
            text.append(para.text)

    return clean_text("\n".join(text))