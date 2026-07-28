import uuid
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats

from metabolomics_report_backend.config import OUTPUTS_DIR
from metabolomics_report_backend.models import PlotSettings


def _rotation_from_mode(mode: str, num_groups: int, max_label_len: int) -> int:
    if mode != "Auto" and mode.isdigit():
        return int(mode)
    if max_label_len > 10 or num_groups > 8:
        return 60
    if num_groups > 4 or max_label_len > 6:
        return 45
    return 0


def _font_size_from_mode(mode: str, num_groups: int) -> int:
    if mode != "Auto" and mode.isdigit():
        return int(mode)
    if num_groups > 8:
        return 8
    if num_groups > 4:
        return 10
    return 12


def _sig_stars(p: float) -> str:
    if p < 0.001:
        return "***"
    if p < 0.01:
        return "**"
    if p < 0.05:
        return "*"
    return "ns"


def _hex_to_rgb(hex_color: str) -> tuple[float, float, float]:
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))


def generate_bar_plot(
    metabolite: str,
    group_stats: dict[str, dict],
    group_values: dict[str, pd.Series],
    settings: PlotSettings,
    output_dir: Path,
    session_id: str,
) -> tuple[Path, dict]:
    """Generate a single bar plot image and return its path plus statistics."""
    groups = sorted(group_stats.keys())
    if not groups:
        raise ValueError("No groups provided for plotting")
    means = [group_stats[g]["mean"] for g in groups]
    stds = [group_stats[g]["std"] for g in groups]

    rotation = _rotation_from_mode(
        settings.rotation_mode, len(groups), max(len(g) for g in groups)
    )
    font_size = _font_size_from_mode(settings.font_size_mode, len(groups))

    base_colors = [
        _hex_to_rgb(settings.group1_color),
        _hex_to_rgb(settings.group2_color),
        _hex_to_rgb(settings.point_color),
        (0.2, 0.4, 0.6),
        (0.6, 0.2, 0.4),
        (0.4, 0.6, 0.2),
    ]
    colors = [base_colors[i % len(base_colors)] for i in range(len(groups))]

    fig, ax = plt.subplots(figsize=(5, 4), dpi=150)
    x = np.arange(len(groups))
    bars = ax.bar(x, means, yerr=stds, capsize=4, color=colors, edgecolor="white", linewidth=0.8)

    p_value = None
    stars = ""
    f_stat = None
    if len(groups) == 2:
        g1_vals = pd.to_numeric(group_values[groups[0]], errors="coerce").dropna()
        g2_vals = pd.to_numeric(group_values[groups[1]], errors="coerce").dropna()
        if len(g1_vals) > 1 and len(g2_vals) > 1:
            _, p_value = stats.ttest_ind(g1_vals, g2_vals, equal_var=False)
        fold_change = (
            means[1] / means[0]
            if means[0] and not np.isnan(means[0]) and means[0] != 0
            else np.nan
        )
        stats_record = {
            "fold_change": float(fold_change) if not np.isnan(fold_change) else None,
            "p_value": float(p_value) if p_value is not None else None,
            "significance": _sig_stars(p_value) if p_value is not None else "",
        }
    else:
        arrays = [
            pd.to_numeric(group_values[g], errors="coerce").dropna().values
            for g in groups
        ]
        arrays = [a for a in arrays if len(a) > 0]
        if settings.run_anova and len(arrays) >= 2:
            f_stat, p_value = stats.f_oneway(*arrays)
        stats_record = {
            "anova_f": float(f_stat) if f_stat is not None else None,
            "p_value": float(p_value) if p_value is not None else None,
            "significance": _sig_stars(p_value) if p_value is not None else "",
        }

    if settings.show_p_value and p_value is not None:
        y_top = max(means) + max(stds) if any(not np.isnan(m) for m in means) else 0
        ax.text(
            x[len(groups) // 2],
            y_top * 1.05,
            f"p = {p_value:.3g}{_sig_stars(p_value)}",
            ha="center",
            va="bottom",
            fontsize=font_size,
            color="#17172A",
        )

    ax.set_xticks(x)
    ax.set_xticklabels(groups, rotation=rotation, ha="right", fontsize=font_size)
    ax.set_ylabel(settings.y_axis_label, fontsize=font_size + 1)
    ax.set_title(metabolite, fontsize=font_size + 2, fontweight="bold", color="#17172A")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(axis="y", labelsize=font_size)
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    plt.tight_layout()

    plot_dir = output_dir / session_id / "plots"
    plot_dir.mkdir(parents=True, exist_ok=True)
    filename = f"barplot_{metabolite.lower().replace(' ', '_').replace('-', '_')}_{uuid.uuid4().hex[:6]}.png"
    path = plot_dir / filename
    fig.savefig(path, facecolor="white", bbox_inches="tight")
    plt.close(fig)

    return path, stats_record
