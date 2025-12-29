from fastapi import APIRouter, UploadFile, File
import os
import uuid
from backend.app.services.resume_parser import (
    extract_text_from_pdf,
    extract_text_from_docx
)

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()
    temp_filename = f"temp_{uuid.uuid4()}.{ext}"

    with open(temp_filename, "wb") as f:
        f.write(await file.read())

    if ext == "pdf":
        text = extract_text_from_pdf(temp_filename)
    elif ext in ["docx", "doc"]:
        text = extract_text_from_docx(temp_filename)
    else:
        os.remove(temp_filename)
        return {"error": "Unsupported file format"}

    os.remove(temp_filename)

    return {
        "filename": file.filename,
        "text_length": len(text),
        "extracted_text": text
    }
