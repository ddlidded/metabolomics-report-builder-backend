import uuid
from pathlib import Path

from fastapi import APIRouter, File, Query, UploadFile
from fastapi.responses import JSONResponse

from metabolomics_report_backend.config import UPLOADS_DIR
from metabolomics_report_backend.models import PlotItem

router = APIRouter()


def _sanitize(name: str) -> str:
    keep = set(".-_")
    return "".join(c if c.isalnum() or c in keep else "_" for c in name).strip()


@router.post("/images")
async def upload_images(
    files: list[UploadFile] = File(...),
    session_id: str | None = Query(default=None),
    section: str = Query(default="Other"),
) -> JSONResponse:
    """Upload plot images and return a list of PlotItem records."""
    session = session_id or uuid.uuid4().hex
    session_dir = UPLOADS_DIR / session
    session_dir.mkdir(parents=True, exist_ok=True)

    plots: list[PlotItem] = []
    for idx, file in enumerate(files, start=1):
        original = file.filename or "image.png"
        name = _sanitize(Path(original).stem)
        ext = Path(original).suffix.lower() or ".png"
        stored_name = f"{uuid.uuid4().hex[:8]}_{name}{ext}"
        dest = session_dir / stored_name
        data = await file.read()
        with open(dest, "wb") as f:
            f.write(data)

        plot_id = f"img_{uuid.uuid4().hex[:12]}"
        plots.append(
            PlotItem(
                id=plot_id,
                order=idx,
                title=name.replace("_", " ").title() or "Figure",
                file_name=stored_name,
                page_mode="SINGLE_PAGE",
                section=section,  # type: ignore[arg-type]
                selected=False,
            )
        )

    return JSONResponse(
        {"session_id": session, "plots": [p.model_dump() for p in plots]}
    )
