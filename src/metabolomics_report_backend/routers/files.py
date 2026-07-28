from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from metabolomics_report_backend.config import OUTPUTS_DIR, UPLOADS_DIR

router = APIRouter()


@router.get("/{session_id}/{filename}")
async def get_upload_file(session_id: str, filename: str) -> FileResponse:
    path = UPLOADS_DIR / session_id / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(str(path))


@router.get("/outputs/{session_id}/{filename}")
async def get_output_file(session_id: str, filename: str) -> FileResponse:
    path = OUTPUTS_DIR / session_id / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(str(path))
