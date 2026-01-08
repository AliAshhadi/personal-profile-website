import json
from io import BytesIO

from flask import Flask, jsonify, render_template, request, send_file

from app.icon_store import add_icon, delete_icon, get_icons
from app.export_service import generate_export_archive
from app.xlsx_utils import build_template_workbook, parse_workbook

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/icons")
def list_icons():
    return jsonify({"icons": get_icons()})


@app.post("/api/icons")
def create_icon():
    data = request.get_json(silent=True, force=True) or {}
    name = (data.get("name") or "").strip()
    svg = (data.get("svg") or "").strip()
    if not name or not svg:
        return jsonify({"error": "نام و SVG الزامی است."}), 400
    icons, key = add_icon(name, svg)
    return jsonify({"icons": icons, "key": key})


@app.delete("/api/icons/<key>")
def remove_icon(key):
    icons = delete_icon(key)
    return jsonify({"icons": icons})


@app.post("/api/template")
def download_template():
    """
    Generate a dynamic XLSX template based on current rows.
    """
    data = request.get_json(silent=True, force=True) or {}
    rows = data.get("rows", [])
    template_bytes = build_template_workbook(rows)
    return send_file(
        BytesIO(template_bytes),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="sample.xlsx",
    )


@app.post("/api/import")
def import_xlsx():
    """
    Parse an uploaded XLSX file and map columns to the provided row config.
    """
    if "file" not in request.files:
        return jsonify({"error": "فایل اکسل ارسال نشده است."}), 400

    rows_raw = request.form.get("rows")
    try:
        rows = json.loads(rows_raw) if rows_raw else []
    except json.JSONDecodeError:
        return jsonify({"error": "ساختار ردیف‌ها نامعتبر است."}), 400

    file = request.files["file"]
    people, warnings = parse_workbook(file.stream, rows)
    return jsonify({"people": people, "warnings": warnings})


@app.post("/api/export")
def export_profiles():
    """
    Generate export bundle (single or batch) based on provided payload and uploaded assets.
    """
    payload_raw = request.form.get("payload")
    if not payload_raw:
        return jsonify({"error": "payload ارسال نشده است."}), 400
    try:
        payload = json.loads(payload_raw)
    except json.JSONDecodeError:
        return jsonify({"error": "payload نامعتبر است."}), 400

    profile_file = request.files.get("profile")
    font_file = request.files.get("font")
    image_files = request.files.getlist("images")
    zip_bytes, warnings = generate_export_archive(payload, profile_file, image_files, font_file)
    response = send_file(
        BytesIO(zip_bytes),
        mimetype="application/zip",
        as_attachment=True,
        download_name="export.zip",
    )
    if warnings:
        response.headers["X-Export-Warnings"] = json.dumps(warnings, ensure_ascii=False)
    return response


if __name__ == "__main__":
    app.run(debug=True)
