# Metabolomics Center PDF Report Builder — Backend

A Python [FastAPI](https://fastapi.tiangolo.com/) backend for the **Metabolomics Center PDF Report Builder**.

It supports the workflows exposed by the React frontend:

- **Image uploads** — store plot images and return `PlotItem` records.
- **CSV import** — detect sample groups, QC groups, and metabolites.
- **Bar plot generation** — generate per-metabolite bar plots from normalized peak-area CSVs with group means, standard deviations, p-values, and ANOVA.
- **PDF report export** — assemble single-page and combined-grid figure pages with cover page, section breaks, headers/footers, and page numbers.
- **Statistics CSV export** — per-metabolite means/SDs, fold changes, t-tests, ANOVA, and significance stars.
- **Maven knowns-list CSV export** — El-MAVEN-compatible compound list with auto-detected columns.

## Tech Stack

- Python 3.10+
- FastAPI + Uvicorn
- Pandas / NumPy / SciPy
- Matplotlib
- ReportLab + pypdf
- Pillow

## Quick Start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

uvicorn metabolomics_report_backend.main:app --reload
```

The API will be available at `http://localhost:8000`. Open `/docs` for interactive API documentation.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/uploads/images` | Upload figure images |
| `POST` | `/api/v1/csv/detect` | Detect groups and metabolites in a CSV |
| `POST` | `/api/v1/csv/generate` | Generate bar plots from selected groups |
| `POST` | `/api/v1/export/report` | Export the final PDF report |
| `POST` | `/api/v1/export/stats` | Export generated statistics CSV |
| `POST` | `/api/v1/export/maven` | Export Maven knowns-list CSV |

## Running Tests

```bash
pytest tests -q
```

## Notes

- Generated files are written to `/tmp/metabolomics_report_data` by default. Set `MRB_DATA_DIR` to change the data directory.
- Fonts fall back to ReportLab's Helvetica; the frontend uses Inter/DM Mono but those are UI-only.
