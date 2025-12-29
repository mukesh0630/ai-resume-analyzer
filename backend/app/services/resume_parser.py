import PyPDF2
from docx import Document
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


def extract_text_from_pdf(file_path: str) -> str:
    text = ""

    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    return clean_text(text)


def extract_text_from_docx(file_path: str) -> str:
    doc = Document(file_path)
    text = []

    for para in doc.paragraphs:
        if para.text.strip():
            text.append(para.text)

    return clean_text("\n".join(text))
