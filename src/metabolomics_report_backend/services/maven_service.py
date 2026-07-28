import io
from pathlib import Path

import pandas as pd


def _normalize(col: str) -> str:
    return col.strip().lower().replace("_", " ")


def _find_column(df: pd.DataFrame, aliases: list[str]) -> str | None:
    normalized_aliases = {_normalize(a) for a in aliases}
    for col in df.columns:
        if _normalize(str(col)) in normalized_aliases:
            return col
    return None


def build_maven_csv(content: bytes, output_path: Path) -> Path:
    """Convert a metabolite CSV to El-MAVEN knowns-list format.

    Recognizes common column aliases and fills missing fields with blanks.
    """
    df = pd.read_csv(io.BytesIO(content))
    if df.empty:
        raise ValueError("Empty CSV file")

    name_col = (
        _find_column(df, ["compound name", "name", "metabolite", "metabolite name", "compound"])
        or df.columns[0]
    )
    mz_col = _find_column(df, [
        "mz", "m/z", "m/z (neutral mass)", "mass", "mz (neutral)", "neutral mass"
    ])
    rt_col = _find_column(df, [
        "retention time", "rt", "retention time (min)", "rt_min", "rt (min)"
    ])
    adduct_col = _find_column(df, ["adduct", "adduct type", "adducts"])
    formula_col = _find_column(df, ["formula", "chemical formula", "mol formula"])
    inchi_col = _find_column(df, ["inchi", "inchi key", "inchikey"])

    out = pd.DataFrame({
        "Compound Name": df[name_col].astype(str),
        "m/z (neutral mass)": df[mz_col].astype(str) if mz_col else "",
        "Retention Time (min)": df[rt_col].astype(str) if rt_col else "",
        "Adduct Type": df[adduct_col].astype(str) if adduct_col else "",
        "Chemical Formula": df[formula_col].astype(str) if formula_col else "",
        "InChI Key": df[inchi_col].astype(str) if inchi_col else "",
    })

    out.to_csv(output_path, index=False)
    return output_path
