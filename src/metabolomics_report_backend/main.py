import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from metabolomics_report_backend.config import DATA_DIR, OUTPUTS_DIR, UPLOADS_DIR
from metabolomics_report_backend.routers import csv_router, export_router, plots_router, uploads_router

app = FastAPI(
    title="Metabolomics PDF Report Builder API",
    description="Backend for the Metabolomics Center PDF Report Builder",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads_router, prefix="/api/v1/uploads", tags=["uploads"])
app.include_router(csv_router, prefix="/api/v1/csv", tags=["csv"])
app.include_router(plots_router, prefix="/api/v1/plots", tags=["plots"])
app.include_router(export_router, prefix="/api/v1/export", tags=["export"])

if OUTPUTS_DIR.exists():
    app.mount("/files/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")
if UPLOADS_DIR.exists():
    app.mount("/files/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Serve the built Vite frontend in production. Mount last so API routes take precedence.
repo_root = Path(__file__).resolve().parents[2]
frontend_dist = repo_root / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")


@app.get("/api/v1/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


def main() -> None:
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("metabolomics_report_backend.main:app", host="0.0.0.0", port=port, reload=True)


if __name__ == "__main__":
    main()
