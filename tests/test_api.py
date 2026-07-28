import io
import json
from pathlib import Path

import pandas as pd
from fastapi.testclient import TestClient

from metabolomics_report_backend.main import app

client = TestClient(app)


def _make_csv() -> bytes:
    samples = [f"{g}_{i}" for g in ["WT", "KO", "Vehicle", "QC_Pool"] for i in range(1, 4)]
    df = pd.DataFrame({"Name": ["Glutamine", "Citric Acid"]})
    for s in samples:
        df[s] = [1000.0, 500.0]
    buf = io.StringIO()
    df.to_csv(buf, index=False)
    return buf.getvalue().encode()


def test_csv_detect():
    response = client.post(
        "/api/v1/csv/detect", files={"file": ("test.csv", _make_csv(), "text/csv")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["metabolites"] == 2
    assert any(g["name"] == "WT" for g in data["groups"])
    assert any(g["name"] == "QC_Pool" and g["is_qc"] for g in data["groups"])


def test_csv_generate():
    response = client.post(
        "/api/v1/csv/generate",
        files={"file": ("test.csv", _make_csv(), "text/csv")},
        data={
            "selected_groups": ["WT", "KO", "Vehicle"],
            "plot_settings_json": json.dumps({
                "y_axis_label": "Peak Area",
                "group1_color": "#2563EB",
                "group2_color": "#17A398",
                "point_color": "#1E1B4B",
                "show_p_value": True,
                "run_anova": True,
                "font_size_mode": "Auto",
                "rotation_mode": "Auto",
            }),
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data["plots"]) == 2
    assert data["plots"][0]["section"] == "Individual Bar Plots"


def test_upload_image():
    from PIL import Image
    buf = io.BytesIO()
    Image.new("RGB", (50, 50), color="red").save(buf, format="PNG")
    buf.seek(0)
    response = client.post(
        "/api/v1/uploads/images",
        files={"files": ("red.png", buf.read(), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["plots"]) == 1
