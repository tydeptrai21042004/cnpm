# s3mrs-backend/app/routes/docs_routes.py
from flask import Blueprint, jsonify, render_template_string

bp = Blueprint("docs", __name__)

_HTML = """
<!doctype html>
<title>S3‑MRS API</title>
<h1>S3‑MRS Back‑end (v1)</h1>
<p>Welcome — this server powers the Smart‑Study‑Space Reservation System.</p>

<h2>Key endpoints</h2>
<ul>
  <li><code>POST /api/auth/register</code> &nbsp;– create new user</li>
  <li><code>POST /api/auth/login</code> &nbsp;– JWT login</li>
  <li><code>GET  /api/rooms</code> &nbsp;– list or filter study rooms</li>
  <li><code>POST /api/bookings</code> &nbsp;– make a reservation</li>
  <li><code>GET  /api/bookings/mine</code> &nbsp;– my reservations</li>
  <li><code>GET  /api/admin/users</code> &nbsp;– list users <em>(admin)</em></li>
</ul>

<p>See <code>README.md</code> for full details.</p>
"""

@bp.get("/")
def docs_home():
    """Return a friendly HTML index instead of 404."""
    return render_template_string(_HTML)
