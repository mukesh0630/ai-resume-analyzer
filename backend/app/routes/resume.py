from fastapi import APIRouter, HTTPException
import os
import uuid

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


# The Upload endpoint requires `python-multipart` at import-time when using
# `UploadFile` in the signature. To keep the app importable in environments
# without that dependency, only define the real handler when `multipart` is
# available. Otherwise expose a clear 503 response.
try:
    import multipart  # type: ignore
    from fastapi import UploadFile, File
    from backend.app.services.resume_parser import (
        extract_text_from_pdf,
        extract_text_from_docx,
        merge_preview_and_full,
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
            raise HTTPException(status_code=422, detail="Unsupported file format")

        os.remove(temp_filename)

        # merge preview/full if any (parser helper may handle previews)
        full_text = merge_preview_and_full(text)

        # normalize and enforce minimum length
        if not full_text or len(full_text.strip()) < 200:
            raise HTTPException(status_code=422, detail="Resume parsing failed or text too short (<200 chars)")

        # always return a single key `extracted_text`
        return {"extracted_text": full_text}
except Exception:
    @router.post("/upload")
    async def upload_resume_unavailable():
        raise HTTPException(status_code=503, detail="python-multipart is not installed on the server; resume upload unavailable")