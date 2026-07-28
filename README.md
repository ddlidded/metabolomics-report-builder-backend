# Metabolomics Center PDF Report Builder

A full-stack web application for building PDF reports from metabolomics figures and normalized peak-area CSVs. The backend is a Python [FastAPI](https://fastapi.tiangolo.com/) service and the frontend is a [Vite](https://vitejs.dev/) + React 18 + TypeScript + Tailwind CSS app.

It supports the full workflow from the Figma design:

- **Image uploads** — store plot images and return `PlotItem` records.
- **CSV import** — detect sample groups, QC groups, and metabolites from a `Name` × samples table.
- **Bar plot generation** — generate per-metabolite bar plots from selected groups with means, standard deviations, p-values, and ANOVA.
- **PDF report export** — assemble single-page and combined-grid figure pages with a cover page, section breaks, headers/footers, and page numbers.
- **Statistics CSV export** — per-metabolite means/SDs, fold changes, t-tests, ANOVA, and significance stars.
- **Maven knowns-list CSV export** — El-MAVEN-compatible compound list.

## Tech Stack

- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pandas, NumPy, SciPy, Matplotlib, ReportLab, pypdf, Pillow
- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS v4, Radix UI, lucide-react, recharts, sonner, motion

## Repository Layout

```
.
├── pyproject.toml
├── src/metabolomics_report_backend/      # FastAPI backend
│   ├── main.py
│   ├── models.py
│   ├── routers/
│   └── services/
├── tests/
└── frontend/                           # Vite React frontend
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── api/client.ts               # snake↔camel API adapter
        └── app/
```

## Backend Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt  # or: pip install -e ".[dev]"

# Run the development server
uvicorn metabolomics_report_backend.main:app --reload
```

The API will be available at `http://localhost:8000` and the interactive docs at `/docs`.

## Frontend Setup

```bash
cd frontend
npm install

# Development server with API proxy
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/api/v1` and `/files` to `http://localhost:8000`.

## Production Build

Build the frontend into `frontend/dist`, then run the backend. FastAPI serves the built static files at `/` while the API stays at `/api/v1`.

```bash
cd frontend
npm run build
cd ..
uvicorn metabolomics_report_backend.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000` for the app and `http://localhost:8000/docs` for the API docs.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/uploads/images` | Upload figure images |
| `POST` | `/api/v1/csv/detect` | Detect groups and metabolites in a CSV |
| `POST` | `/api/v1/csv/generate` | Generate bar plots from selected groups |
| `POST` | `/api/v1/export/report` | Export the final PDF report |
| `POST` | `/api/v1/export/stats` | Export generated statistics CSV |
| `POST` | `/api/v1/export/maven` | Export Maven knowns-list CSV |
| `GET`  | `/api/v1/health` | Health check |

## Running Tests

```bash
# Backend tests
PYTHONPATH=src pytest tests -q

# Frontend type check
npm run typecheck

# Frontend build
npm run build
```

## Notes

- Generated files are written to `/tmp/metabolomics_report_data` by default. Set `MRB_DATA_DIR` to change the data directory.
- The frontend API client maps `camelCase` UI types to the backend's `snake_case` Pydantic models and back.
- Fonts fall back to ReportLab's Helvetica in generated PDFs; the frontend uses Inter/DM Mono for the UI.
