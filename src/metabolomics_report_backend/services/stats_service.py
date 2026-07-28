from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

from metabolomics_report_backend.services.csv_service import compute_group_stats


def build_stats_csv(
    df: pd.DataFrame,
    group_map: dict[str, str],
    run_anova: bool,
    output_path: Path,
) -> Path:
    """Build a statistics CSV from a metabolite x sample DataFrame."""
    groups = sorted(set(group_map.values()))
    rows = []
    for metabolite in df.index:
        values = df.loc[metabolite]
        record: dict = {"Metabolite Name": metabolite}
        group_arrays = []
        for group in groups:
            cols = [c for c, g in group_map.items() if g == group]
            vals = pd.to_numeric(values[cols], errors="coerce").dropna()
            group_arrays.append(vals)
            record[f"{group} Mean"] = round(vals.mean(), 4) if not vals.empty else np.nan
            record[f"{group} SD"] = round(vals.std(ddof=1), 4) if len(vals) > 1 else 0.0

        if len(groups) == 2:
            g1, g2 = group_arrays[0], group_arrays[1]
            if len(g1) > 1 and len(g2) > 1:
                _, p = stats.ttest_ind(g1, g2, equal_var=False)
            else:
                p = np.nan
            m1 = record[f"{groups[0]} Mean"]
            m2 = record[f"{groups[1]} Mean"]
            record["Fold Change"] = round(m2 / m1, 4) if m1 and not np.isnan(m1) and m1 != 0 else np.nan
            record["p-value (t-test)"] = p if not np.isnan(p) else ""
            record["ANOVA F-statistic"] = ""
            record["ANOVA p-value"] = ""
        elif len(groups) > 2:
            arrays = [a for a in group_arrays if len(a) > 0]
            if run_anova and len(arrays) >= 2:
                f, p = stats.f_oneway(*arrays)
            else:
                f, p = np.nan, np.nan
            record["Fold Change"] = ""
            record["p-value (t-test)"] = ""
            record["ANOVA F-statistic"] = f if not np.isnan(f) else ""
            record["ANOVA p-value"] = p if not np.isnan(p) else ""
        else:
            record["Fold Change"] = ""
            record["p-value (t-test)"] = ""
            record["ANOVA F-statistic"] = ""
            record["ANOVA p-value"] = ""

        p_for_stars = record.get("p-value (t-test)", "") or record.get("ANOVA p-value", "")
        try:
            p_float = float(p_for_stars)
        except (ValueError, TypeError):
            p_float = np.nan
        record["Significance Stars"] = _sig_stars(p_float)
        rows.append(record)

    stats_df = pd.DataFrame(rows)
    stats_df.to_csv(output_path, index=False)
    return output_path


def _sig_stars(p: float) -> str:
    if np.isnan(p):
        return ""
    if p < 0.001:
        return "***"
    if p < 0.01:
        return "**"
    if p < 0.05:
        return "*"
    return "ns"
