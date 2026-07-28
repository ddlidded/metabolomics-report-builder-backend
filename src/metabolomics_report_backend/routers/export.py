import json
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from metabolomics_report_backend.config import OUTPUTS_DIR
from metabolomics_report_backend.models import FullReportRequest
from metabolomics_report_backend.services.csv_service import parse_csv_for_generation
from metabolomics_report_backend.services.maven_service import build_maven_csv
from metabolomics_report_backend.services.pdf_service import generate_pdf
from metabolomics_report_backend.services.stats_service import build_stats_csv

router = APIRouter()


@router.post("/report")
async def export_report(
    request_json: str = Form(...),
    session_id: str | None = Form(default=None),
) -> JSONResponse:
    try:
        request = FullReportRequest.model_validate_json(request_json)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid request: {exc}") from exc

    session = session_id or uuid.uuid4().hex
    try:
        pdf_path = generate_pdf(
            plots=request.plots,
            report=request.report_settings,
            spacing=request.spacing,
            layout=request.layout,
            cover=request.cover,
            export=request.export,
            session_id=session,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {exc}") from exc

    return JSONResponse(
        {
            "session_id": session,
            "pdf_url": f"/files/outputs/{session}/{pdf_path.name}",
        }
    )


@router.post("/stats")
async def export_stats(
    file: UploadFile = File(...),
    selected_groups: list[str] = Form(default_factory=list),
    run_anova: bool = Form(default=True),
    session_id: str | None = Form(default=None),
) -> FileResponse:
    content = await file.read()
    if not selected_groups:
        raise HTTPException(status_code=400, detail="At least one group must be selected")

    session = session_id or uuid.uuid4().hex
    try:
        df, group_map = parse_csv_for_generation(content, selected_groups)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"CSV parse error: {exc}") from exc

    out_dir = OUTPUTS_DIR / session
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "generated_statistics.csv"
    build_stats_csv(df, group_map, run_anova, out_path)
    return FileResponse(str(out_path), media_type="text/csv", filename="generated_statistics.csv")


@router.post("/maven")
async def export_maven(
    file: UploadFile = File(...),
    session_id: str | None = Form(default=None),
) -> FileResponse:
    content = await file.read()
    session = session_id or uuid.uuid4().hex
    out_dir = OUTPUTS_DIR / session
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "maven_knowns_list.csv"
    try:
        build_maven_csv(content, out_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Maven CSV error: {exc}") from exc
    return FileResponse(str(out_path), media_type="text/csv", filename="maven_knowns_list.csv")
