import json
import uuid
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from metabolomics_report_backend.config import OUTPUTS_DIR
from metabolomics_report_backend.models import CsvDetectResponse, GroupInfo, PlotItem, PlotSettings
from metabolomics_report_backend.services.csv_service import parse_csv_for_detection, parse_csv_for_generation
from metabolomics_report_backend.services.plot_service import generate_bar_plot

router = APIRouter()


@router.post("/detect", response_model=CsvDetectResponse)
async def detect_csv(file: UploadFile = File(...)) -> CsvDetectResponse:
    content = await file.read()
    try:
        info = parse_csv_for_detection(content)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"CSV parse error: {exc}") from exc

    return CsvDetectResponse(
        file_name=file.filename or "uploaded.csv",
        metabolites=info["metabolites"],
        samples=info["samples"],
        groups=[GroupInfo(**g) for g in info["groups"]],
    )


@router.post("/generate")
async def generate_from_csv(
    file: UploadFile = File(...),
    selected_groups: list[str] = Form(default_factory=list),
    plot_settings_json: str = Form(default="{}"),
    session_id: str | None = Form(default=None),
) -> JSONResponse:
    content = await file.read()
    if not selected_groups:
        raise HTTPException(status_code=400, detail="At least one group must be selected")

    try:
        settings = PlotSettings.model_validate_json(plot_settings_json)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid plot settings: {exc}") from exc

    session = session_id or uuid.uuid4().hex
    try:
        df, group_map = parse_csv_for_generation(content, selected_groups)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"CSV parse error: {exc}") from exc

    session_output = OUTPUTS_DIR / session
    session_output.mkdir(parents=True, exist_ok=True)

    plots: list[dict] = []
    image_urls: list[str] = []
    for idx, metabolite in enumerate(df.index, start=1):
        values = df.loc[metabolite]
        group_stats: dict[str, dict] = {}
        group_values: dict[str, pd.Series] = {}
        for group in sorted(set(group_map.values())):
            cols = [c for c, g in group_map.items() if g == group]
            vals = pd.to_numeric(values[cols], errors="coerce").dropna()
            group_stats[group] = {
                "mean": float(vals.mean()) if not vals.empty else 0.0,
                "std": float(vals.std(ddof=1)) if len(vals) > 1 else 0.0,
                "n": int(len(vals)),
            }
            group_values[group] = vals

        path, stats = generate_bar_plot(
            metabolite, group_stats, group_values, settings, OUTPUTS_DIR, session
        )
        filename = path.name
        image_url = f"/files/outputs/{session}/plots/{filename}"
        plots.append(
            PlotItem(
                id=f"csv_{uuid.uuid4().hex[:12]}",
                order=idx,
                title=metabolite,
                file_name=filename,
                page_mode="COMBINED_GRID",
                section="Individual Bar Plots",
                selected=False,
            ).model_dump()
        )
        image_urls.append(image_url)

    return JSONResponse({"session_id": session, "plots": plots, "image_urls": image_urls})
