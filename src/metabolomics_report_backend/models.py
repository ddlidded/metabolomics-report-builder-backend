from typing import Literal, Optional
from pydantic import BaseModel, Field


class PlotItem(BaseModel):
    id: str
    order: int
    title: str
    file_name: str
    page_mode: Literal["SINGLE_PAGE", "COMBINED_GRID"] = "SINGLE_PAGE"
    section: Literal[
        "Summary / Global",
        "Heatmap",
        "PCA / PLSDA",
        "Volcano",
        "Individual Bar Plots",
        "Other",
    ] = "Other"
    selected: bool = False


class ReportSettings(BaseModel):
    title: str = "Untargeted Metabolomics Study"
    header_label: str = "METABOLOMICS CORE"
    footer_text: str = "University Metabolomics Core — Confidential"
    orientation: Literal["Portrait", "Landscape"] = "Portrait"
    image_fit: Literal["contain", "cover", "stretch"] = "contain"
    header_color: str = "#1E1B4B"
    background_color: str = "#FFFFFF"
    card_border_color: str = "#E2E8F0"


class PlotSettings(BaseModel):
    y_axis_label: str = "Peak Area"
    group1_color: str = "#2563EB"
    group2_color: str = "#17A398"
    point_color: str = "#1E1B4B"
    show_p_value: bool = True
    run_anova: bool = True
    font_size_mode: str = "Auto"
    rotation_mode: str = "Auto"


class SectionLayout(BaseModel):
    summary_per_page: int = 1
    heatmap_per_page: int = 1
    pca_per_page: int = 2
    volcano_per_page: int = 2
    bar_plots_per_page: int = 9
    other_per_page: int = 4


class SpacingSettings(BaseModel):
    margin_inches: float = 0.5
    header_height_inches: float = 0.6
    footer_height_inches: float = 0.4
    card_gap_inches: float = 0.15
    image_padding_inches: float = 0.05
    header_title_font: str = "Inter"
    header_subtitle_font: str = "Inter"
    image_title_font: str = "Inter"
    footer_font: str = "DM Mono"


class CoverSettings(BaseModel):
    include_cover: bool = True
    cover_design: str = "modern-purple"
    project_title: str = "Untargeted Metabolomics Study"
    report_type: str = "Metabolomics · LC-MS/MS"
    cover_subtitle: str = "Plasma samples — Positive mode"
    prepared_for: str = "Dr. Jane Smith"
    prepared_by: str = "University Metabolomics Core"
    generated_date: str = "May 30, 2026"
    primary_comparison: str = "WT vs KO"
    sample_summary: str = "36 samples across 4 groups. Normalized peak area data, quality-filtered."
    analysis_tags: str = "Lipidomics, RPLC, ESI+, Orbitrap"
    cover_footer: str = "Confidential — Internal Report"
    logo_brand_text: str = "University Metabolomics Core"
    key_visualizations: str = "PCA, Volcano, Heatmap, Bar Plots"
    lc_method: str = "RPLC C18"
    polarity: str = "Positive"
    ms_system: str = "Orbitrap Exploris 480"
    scan_range: str = "67–1000 m/z"
    resolution: str = "60,000 FWHM"
    total_samples: str = "36"
    num_groups: str = "4"
    qc_samples: str = "6"
    pooled_qc: str = "Yes"
    report_mode: str = "Normalized"
    mass_accuracy: str = "<5 ppm"
    cover_primary_color: str = "#1E1B4B"
    cover_secondary_color: str = "#312e81"
    cover_accent_color: str = "#17A398"
    cover_accent2_color: str = "#FFB703"
    cover_bg_color: str = "#F8F9FC"
    cover_ink_color: str = "#17172A"
    cover_muted_color: str = "#64748B"


class ExportSettings(BaseModel):
    export_maven_csv: bool = False
    export_stats_csv: bool = True
    show_section_breaks: bool = True
    show_header: bool = True
    show_footer: bool = True
    add_page_numbers: bool = True
    show_extra_titles: bool = True
    use_file_names_if_blank: bool = True


class FullReportRequest(BaseModel):
    plots: list[PlotItem]
    report_settings: ReportSettings = Field(default_factory=ReportSettings)
    plot_settings: PlotSettings = Field(default_factory=PlotSettings)
    layout: SectionLayout = Field(default_factory=SectionLayout)
    spacing: SpacingSettings = Field(default_factory=SpacingSettings)
    cover: CoverSettings = Field(default_factory=CoverSettings)
    export: ExportSettings = Field(default_factory=ExportSettings)


class GroupInfo(BaseModel):
    name: str
    count: int
    is_qc: bool


class CsvDetectResponse(BaseModel):
    file_name: str
    metabolites: int
    samples: int
    groups: list[GroupInfo]


class GeneratedPlot(BaseModel):
    plot: PlotItem
    image_url: str
    stats: dict


class PlotGenerationResponse(BaseModel):
    plots: list[PlotItem]
    images: list[str]


class ExportResult(BaseModel):
    pdf_url: str
    stats_csv_url: Optional[str] = None
    maven_csv_url: Optional[str] = None
