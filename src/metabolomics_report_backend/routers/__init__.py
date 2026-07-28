from .uploads import router as uploads_router
from .csv import router as csv_router
from .plots import router as plots_router
from .export import router as export_router
from .files import router as files_router

__all__ = [
    "uploads_router",
    "csv_router",
    "plots_router",
    "export_router",
    "files_router",
]
