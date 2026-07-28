import math
import uuid
from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

from metabolomics_report_backend.config import OUTPUTS_DIR, UPLOADS_DIR
from metabolomics_report_backend.models import (
    CoverSettings,
    ExportSettings,
    PlotItem,
    ReportSettings,
    SectionLayout,
    SpacingSettings,
)


SECTION_ORDER = [
    "Summary / Global",
    "Heatmap",
    "PCA / PLSDA",
    "Volcano",
    "Individual Bar Plots",
    "Other",
]


def _hex_to_color(hex_color: str) -> colors.Color:
    h = hex_color.lstrip("#")
    return colors.Color(
        int(h[0:2], 16) / 255,
        int(h[2:4], 16) / 255,
        int(h[4:6], 16) / 255,
    )


def _resolve_image_path(filename: str, session_id: str) -> Path | None:
    candidates = [
        UPLOADS_DIR / session_id / filename,
        OUTPUTS_DIR / session_id / "plots" / filename,
        OUTPUTS_DIR / session_id / filename,
    ]
    for cand in candidates:
        if cand.exists():
            return cand
    return None


def _draw_image(
    c: canvas.Canvas,
    img_path: Path,
    x: float,
    y: float,
    width: float,
    height: float,
    fit_mode: str,
    padding: float,
):
    try:
        img = Image.open(img_path)
    except Exception:
        return
    ix, iy = img.size
    if ix == 0 or iy == 0:
        return
    px, py = x + padding, y + padding
    pw, ph = width - 2 * padding, height - 2 * padding
    if pw <= 0 or ph <= 0:
        return
    ratio_x = pw / ix
    ratio_y = ph / iy
    if fit_mode == "contain":
        scale = min(ratio_x, ratio_y)
    elif fit_mode == "cover":
        scale = max(ratio_x, ratio_y)
    else:  # stretch
        scale = 1.0
    sw, sh = ix * scale, iy * scale
    if fit_mode in {"contain", "stretch"}:
        dx = px + (pw - sw) / 2
        dy = py + (ph - sh) / 2
    else:
        dx = px + (pw - sw) / 2
        dy = py + (ph - sh) / 2
    c.drawImage(str(img_path), dx, dy, width=sw, height=sh, preserveAspectRatio=True)


def _draw_header(c: canvas.Canvas, page_size: tuple[float, float], settings: ReportSettings, spacing: SpacingSettings):
    w, h = page_size
    header_h = spacing.header_height_inches * inch
    color = _hex_to_color(settings.header_color)
    c.setFillColor(color)
    c.rect(0, h - header_h, w, header_h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(spacing.margin_inches * inch, h - header_h / 2 + 3, settings.title)
    c.setFont("Helvetica", 8)
    label_width = c.stringWidth(settings.header_label, "Helvetica", 8)
    c.drawRightString(w - spacing.margin_inches * inch, h - header_h / 2 + 3, settings.header_label)


def _draw_footer(c: canvas.Canvas, page: int, total: int, page_size: tuple[float, float], settings: ReportSettings, spacing: SpacingSettings, export: ExportSettings):
    w, h = page_size
    footer_h = spacing.footer_height_inches * inch
    c.setFillColor(_hex_to_color(settings.background_color))
    c.rect(0, 0, w, footer_h, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#64748B"))
    c.setFont("Helvetica", 7)
    c.drawString(spacing.margin_inches * inch, footer_h / 2 - 3, settings.footer_text)
    page_text = f"{page} / {total}" if export.add_page_numbers else ""
    c.drawRightString(w - spacing.margin_inches * inch, footer_h / 2 - 3, page_text)


def _new_page(c: canvas.Canvas, page_size: tuple[float, float], settings: ReportSettings, spacing: SpacingSettings):
    w, h = page_size
    c.setFillColor(_hex_to_color(settings.background_color))
    c.rect(0, 0, w, h, fill=1, stroke=0)


def _draw_cover(c: canvas.Canvas, page_size: tuple[float, float], cover: CoverSettings, spacing: SpacingSettings):
    w, h = page_size
    primary = _hex_to_color(cover.cover_primary_color)
    bg = _hex_to_color(cover.cover_bg_color)
    ink = _hex_to_color(cover.cover_ink_color)
    accent = _hex_to_color(cover.cover_accent_color)

    c.setFillColor(bg)
    c.rect(0, 0, w, h, fill=1, stroke=0)

    if cover.cover_design in {"modern-purple", "editorial-dark"}:
        c.setFillColor(primary)
        c.rect(0, h / 2, w, h / 2, fill=1, stroke=0)

    # Title block
    c.setFillColor(colors.white if cover.cover_design in {"modern-purple", "editorial-dark"} else ink)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(spacing.margin_inches * inch, h - 1.5 * inch, cover.project_title)
    c.setFont("Helvetica", 12)
    c.drawString(spacing.margin_inches * inch, h - 2.0 * inch, cover.report_type)
    c.setFont("Helvetica", 10)
    c.drawString(spacing.margin_inches * inch, h - 2.5 * inch, cover.cover_subtitle)

    # Metadata strip
    meta_y = h / 2 - 0.75 * inch
    c.setFillColor(ink)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(spacing.margin_inches * inch, meta_y, "Prepared For")
    c.setFont("Helvetica", 10)
    c.drawString(spacing.margin_inches * inch, meta_y - 0.25 * inch, cover.prepared_for)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(3 * inch, meta_y, "Prepared By")
    c.setFont("Helvetica", 10)
    c.drawString(3 * inch, meta_y - 0.25 * inch, cover.prepared_by)

    # Instrument metadata
    meta_items = [
        ("LC Method", cover.lc_method),
        ("Polarity", cover.polarity),
        ("MS System", cover.ms_system),
        ("Scan Range", cover.scan_range),
        ("Resolution", cover.resolution),
        ("Total Samples", cover.total_samples),
        ("Groups", cover.num_groups),
        ("QC Samples", cover.qc_samples),
    ]
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(primary)
    c.drawString(spacing.margin_inches * inch, meta_y - 1.0 * inch, "Instrument Metadata")
    c.setFont("Helvetica", 8)
    c.setFillColor(ink)
    for i, (label, value) in enumerate(meta_items):
        row = i // 2
        col = i % 2
        x = spacing.margin_inches * inch + col * 3 * inch
        y = meta_y - 1.4 * inch - row * 0.25 * inch
        c.drawString(x, y, f"{label}: {value}")

    # Footer line
    c.setStrokeColor(accent)
    c.setLineWidth(2)
    c.line(spacing.margin_inches * inch, 0.75 * inch, w - spacing.margin_inches * inch, 0.75 * inch)
    c.setFont("Helvetica", 8)
    c.setFillColor(ink)
    c.drawString(spacing.margin_inches * inch, 0.5 * inch, cover.cover_footer)


def _draw_section_break(c: canvas.Canvas, page_size: tuple[float, float], section: str, settings: ReportSettings, spacing: SpacingSettings):
    w, h = page_size
    primary = _hex_to_color(settings.header_color)
    c.setFillColor(primary)
    c.rect(spacing.margin_inches * inch, h / 2 - 0.5 * inch, w - 2 * spacing.margin_inches * inch, 1 * inch, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(w / 2, h / 2 - 0.15 * inch, section)


def _per_page_grid(per_page: int) -> tuple[int, int]:
    cols = math.ceil(math.sqrt(per_page))
    rows = math.ceil(per_page / cols)
    return cols, rows


def _draw_figures(
    c: canvas.Canvas,
    page_size: tuple[float, float],
    plots: list[PlotItem],
    report: ReportSettings,
    spacing: SpacingSettings,
    layout: SectionLayout,
    section: str,
    session_id: str,
    export: ExportSettings,
) -> None:
    w, h = page_size
    margin = spacing.margin_inches * inch
    header_h = spacing.header_height_inches * inch if export.show_header else 0
    footer_h = spacing.footer_height_inches * inch if export.show_footer else 0
    content_top = h - margin - header_h
    content_bottom = margin + footer_h
    content_h = content_top - content_bottom
    content_w = w - 2 * margin

    per_page = {
        "Summary / Global": layout.summary_per_page,
        "Heatmap": layout.heatmap_per_page,
        "PCA / PLSDA": layout.pca_per_page,
        "Volcano": layout.volcano_per_page,
        "Individual Bar Plots": layout.bar_plots_per_page,
        "Other": layout.other_per_page,
    }.get(section, 1)

    page_plots = []
    for plot in plots:
        if plot.section != section:
            continue
        page_plots.append(plot)
        if plot.page_mode == "SINGLE_PAGE" or len(page_plots) >= per_page:
            _draw_page_plots(c, page_size, page_plots, report, spacing, section, session_id, content_w, content_h, content_bottom, header_h, per_page, export)
            page_plots = []
    if page_plots:
        _draw_page_plots(c, page_size, page_plots, report, spacing, section, session_id, content_w, content_h, content_bottom, header_h, per_page, export)


def _draw_page_plots(
    c: canvas.Canvas,
    page_size: tuple[float, float],
    plots: list[PlotItem],
    report: ReportSettings,
    spacing: SpacingSettings,
    section: str,
    session_id: str,
    content_w: float,
    content_h: float,
    content_bottom: float,
    header_h: float,
    per_page: int,
    export: ExportSettings,
) -> None:
    w, h = page_size
    margin = spacing.margin_inches * inch
    gap = spacing.card_gap_inches * inch
    padding = spacing.image_padding_inches * inch

    c.showPage()
    _new_page(c, page_size, report, spacing)
    if export.show_header:
        _draw_header(c, page_size, report, spacing)

    single = all(p.page_mode == "SINGLE_PAGE" for p in plots)
    if single:
        # One plot centered on the page
        plot = plots[0]
        title = plot.title or (plot.file_name.replace("_", " ") if report.use_file_names_if_blank and plot.file_name else "")
        c.setFillColor(_hex_to_color("#17172A"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(margin, h - margin - header_h - 0.2 * inch, title)
        card_h = content_h - 0.5 * inch
        _draw_card(c, margin, content_bottom, content_w, card_h, report.card_border_color)
        img_path = _resolve_image_path(plot.file_name, session_id)
        if img_path:
            _draw_image(c, img_path, margin, content_bottom, content_w, card_h, report.image_fit, padding)
    else:
        # Grid layout
        cols, rows = _per_page_grid(per_page)
        cell_w = (content_w - gap * (cols - 1)) / cols
        cell_h = (content_h - gap * (rows - 1) - 0.3 * inch) / rows
        title_h = 0.25 * inch
        for i, plot in enumerate(plots):
            col = i % cols
            row = i // cols
            x = margin + col * (cell_w + gap)
            y = content_bottom + (rows - 1 - row) * (cell_h + gap)
            title = plot.title or (plot.file_name.replace("_", " ") if report.use_file_names_if_blank and plot.file_name else "")
            c.setFillColor(_hex_to_color("#17172A"))
            c.setFont("Helvetica-Bold", 8)
            c.drawString(x, y + cell_h + 0.05 * inch, title)
            _draw_card(c, x, y, cell_w, cell_h - title_h, report.card_border_color)
            img_path = _resolve_image_path(plot.file_name, session_id)
            if img_path:
                _draw_image(c, img_path, x, y, cell_w, cell_h - title_h, report.image_fit, padding)


def _draw_card(c: canvas.Canvas, x: float, y: float, w: float, h: float, border_color: str):
    c.setFillColor(colors.white)
    c.setStrokeColor(_hex_to_color(border_color))
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)


def generate_pdf(
    plots: list[PlotItem],
    report: ReportSettings,
    spacing: SpacingSettings,
    layout: SectionLayout,
    cover: CoverSettings,
    export: ExportSettings,
    session_id: str,
) -> Path:
    """Generate a PDF report and return its file path."""
    output_dir = OUTPUTS_DIR / session_id
    output_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = output_dir / f"metabolomics_report_{uuid.uuid4().hex[:8]}.pdf"

    page_size = landscape(letter) if report.orientation == "Landscape" else letter
    c = canvas.Canvas(str(pdf_path), pagesize=page_size)

    _new_page(c, page_size, report, spacing)

    if cover.include_cover:
        _draw_cover(c, page_size, cover, spacing)
        c.showPage()

    for section in SECTION_ORDER:
        section_plots = [p for p in plots if p.section == section]
        if not section_plots:
            continue
        if export.show_section_breaks:
            c.showPage()
            _new_page(c, page_size, report, spacing)
            _draw_section_break(c, page_size, section, report, spacing)
        _draw_figures(c, page_size, section_plots, report, spacing, layout, section, session_id, export)

    # Render pages and add footer/page numbers
    c.save()
    _add_footers(pdf_path, page_size, report, spacing, export)
    return pdf_path


def _add_footers(pdf_path: Path, page_size: tuple[float, float], report: ReportSettings, spacing: SpacingSettings, export: ExportSettings):
    """Post-process to add footer and page numbers on each page."""
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(pdf_path))
    writer = PdfWriter()
    total = len(reader.pages)

    for i, page in enumerate(reader.pages, start=1):
        overlay = _footer_overlay(page_size, i, total, report, spacing, export)
        page.merge_page(overlay)
        writer.add_page(page)

    with open(pdf_path, "wb") as f:
        writer.write(f)


def _footer_overlay(page_size, page, total, report, spacing, export):
    """Create a single-page PDF with footer/page number to merge."""
    from io import BytesIO
    from reportlab.pdfgen import canvas as c2

    buf = BytesIO()
    c = c2.Canvas(buf, pagesize=page_size)
    _draw_footer(c, page, total, page_size, report, spacing, export)
    c.save()
    from pypdf import PdfReader
    buf.seek(0)
    return PdfReader(buf).pages[0]
