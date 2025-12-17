from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file.file)
    else:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported")

    return {
        "filename": file.filename,
        "text_length": len(text),
        "extracted_text_preview": text[:500]
    }
