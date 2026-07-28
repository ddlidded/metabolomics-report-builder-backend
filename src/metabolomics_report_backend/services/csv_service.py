import io
import re
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd


def _is_numeric_series(values: pd.Series) -> bool:
    try:
        pd.to_numeric(values, errors="raise")
        return True
    except (ValueError, TypeError):
        return False


def _is_group_row(row: pd.Series) -> bool:
    """Heuristic: a row of group labels is non-numeric and has repeated values."""
    if row.isna().all():
        return False
    non_empty = row.dropna().astype(str).str.strip()
    non_empty = non_empty[non_empty != ""]
    if len(non_empty) < 2:
        return False
    if _is_numeric_series(non_empty):
        return False
    # At least one repeated label and no sample-name-like long strings with digits?
    counts = Counter(non_empty.tolist())
    return max(counts.values(), default=0) >= 2


def _detect_groups_from_sample_names(sample_names: list[str]) -> list[str]:
    """Derive group names from sample identifiers by stripping the trailing numeric replicate token."""
    groups = []
    for s in sample_names:
        name = s.strip()
        # Remove a trailing _<digits> replicate suffix (e.g. Treated_WT_1 -> Treated_WT)
        no_replicate = re.sub(r"_\d+$", "", name)
        if no_replicate == name:
            # Fall back to stripping trailing digits
            no_replicate = re.sub(r"\d+$", "", name).strip(" -")
        groups.append(no_replicate)
    return groups


def _is_qc_group(name: str) -> bool:
    lower = name.lower()
    return any(q in lower for q in ["qc", "blank", "pool", "media", "ctl", "control"])


def parse_csv_for_detection(content: bytes) -> dict:
    """Return metabolite count, sample count, and detected groups from a CSV."""
    text = content.decode("utf-8", errors="replace")
    lines = text.splitlines()

    if not lines:
        raise ValueError("Empty CSV file")

    # Peek at the first few rows to decide header structure
    try:
        preview = pd.read_csv(io.StringIO("\n".join(lines[:5])), header=None)
    except pd.errors.EmptyDataError as exc:
        raise ValueError("Could not parse CSV header") from exc

    first_cell = str(preview.iloc[0, 0]).strip().lower() if preview.shape[1] > 0 else ""

    if first_cell in {"name", "metabolite", "compound", ""} and preview.shape[0] >= 2:
        sample_names = preview.iloc[0, 1:].astype(str).tolist()
        group_row = preview.iloc[1, 1:].astype(str).tolist()
        if _is_group_row(preview.iloc[1, 1:]):
            # Two header rows: row 0 sample names, row 1 group labels
            df = pd.read_csv(
                io.StringIO(text),
                header=[0, 1],
                index_col=0,
            )
            # Flatten multi-index columns to sample names, keep groups
            # df.columns level 0 = sample names, level 1 = groups
            sample_names = [str(c[0]) for c in df.columns]
            group_labels = [str(c[1]) for c in df.columns]
        else:
            # Single header row, first cell is a label column
            df = pd.read_csv(io.StringIO(text), index_col=0)
            sample_names = [str(c) for c in df.columns]
            group_labels = _detect_groups_from_sample_names(sample_names)
    else:
        df = pd.read_csv(io.StringIO(text), index_col=0)
        sample_names = [str(c) for c in df.columns]
        group_labels = _detect_groups_from_sample_names(sample_names)

    metabolites = df.index.tolist()
    counts = Counter(group_labels)
    groups = []
    for name, count in sorted(counts.items(), key=lambda x: x[1], reverse=True):
        groups.append({"name": name, "count": count, "is_qc": _is_qc_group(name)})

    return {
        "metabolites": len(metabolites),
        "samples": len(sample_names),
        "groups": groups,
        "sample_names": sample_names,
        "group_labels": group_labels,
        "metabolite_names": metabolites,
    }


def parse_csv_for_generation(content: bytes, selected_groups: list[str]) -> pd.DataFrame:
    """Parse CSV and return a tidy DataFrame with columns: metabolite, group, sample, value."""
    text = content.decode("utf-8", errors="replace")
    lines = text.splitlines()
    if not lines:
        raise ValueError("Empty CSV file")

    preview = pd.read_csv(io.StringIO("\n".join(lines[:5])), header=None)
    first_cell = str(preview.iloc[0, 0]).strip().lower() if preview.shape[1] > 0 else ""

    if first_cell in {"name", "metabolite", "compound", ""} and preview.shape[0] >= 2:
        sample_names = preview.iloc[0, 1:].astype(str).tolist()
        if _is_group_row(preview.iloc[1, 1:]):
            df = pd.read_csv(io.StringIO(text), header=[0, 1], index_col=0)
            sample_names = [str(c[0]) for c in df.columns]
            group_labels = [str(c[1]) for c in df.columns]
            df.columns = sample_names
            # Add group row manually
            df.loc["__group__"] = group_labels
        else:
            df = pd.read_csv(io.StringIO(text), index_col=0)
            sample_names = [str(c) for c in df.columns]
            group_labels = _detect_groups_from_sample_names(sample_names)
            df.loc["__group__"] = group_labels
    else:
        df = pd.read_csv(io.StringIO(text), index_col=0)
        sample_names = [str(c) for c in df.columns]
        group_labels = _detect_groups_from_sample_names(sample_names)
        df.loc["__group__"] = group_labels

    # Filter columns by selected groups
    selected_set = set(selected_groups)
    keep_cols = [s for s, g in zip(sample_names, group_labels) if g in selected_set]
    df = df[keep_cols]

    # Drop the temporary group row and ensure numeric
    numeric_df = df.drop("__group__", errors="ignore").apply(pd.to_numeric, errors="coerce")
    numeric_df.index.name = "metabolite"

    # Add group mapping for remaining columns
    group_map = {}
    for s, g in zip(sample_names, group_labels):
        if g in selected_set:
            group_map[s] = g

    return numeric_df, group_map


def compute_group_stats(df: pd.DataFrame, group_map: dict[str, str]) -> pd.DataFrame:
    """Compute per-metabolite statistics for each selected group."""
    records = []
    groups = sorted(set(group_map.values()))
    for metabolite in df.index:
        row = df.loc[metabolite]
        record = {"Metabolite": metabolite}
        group_values = {}
        for group in groups:
            cols = [c for c, g in group_map.items() if g == group]
            vals = pd.to_numeric(row[cols], errors="coerce").dropna()
            group_values[group] = vals
            record[f"{group}_mean"] = vals.mean() if not vals.empty else np.nan
            record[f"{group}_std"] = vals.std(ddof=1) if len(vals) > 1 else 0.0
            record[f"{group}_n"] = len(vals)
        records.append(record)
    return pd.DataFrame(records)
