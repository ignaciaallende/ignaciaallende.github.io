#!/usr/bin/env python3
"""
A stand-in for the Cloudflare Worker, for testing the survey on your own machine.

src/index.js is the real thing and the source of truth; this file copies its rules so the
survey can be tested without a Cloudflare account, a REDCap token, or an internet connection.
It never talks to REDCap. Keep the two in step if you change the rules.

    python3 worker/mock_server.py                 # accepts uploads, reports success
    FORCE_STATUS=500 python3 worker/mock_server.py  # always fails, to test the failure screen

Received uploads are printed and saved under worker/received/ so you can check what the
survey actually sent.
"""

import json
import os
import re
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

PORT = int(os.environ.get("PORT", "8787"))
FORCE_STATUS = int(os.environ["FORCE_STATUS"]) if os.environ.get("FORCE_STATUS") else None
RECEIVED_DIR = Path(__file__).parent / "received"

ALLOWED_ORIGINS = [
    "https://ignaciaallende.github.io",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
LANGS = ["en", "de", "no"]
PID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
SESSION_PATTERN = re.compile(r"^[A-Za-z0-9]{1,40}$")
MAX_BODY_BYTES = 2 * 1024 * 1024


def validate(body):
    if not isinstance(body, dict):
        return "invalid_body"
    if body.get("kind") not in ("trials", "withdraw"):
        return "invalid_kind"
    pid = body.get("pid")
    if not isinstance(pid, str) or not PID_PATTERN.match(pid):
        return "invalid_pid"
    if body.get("lang") not in LANGS:
        return "invalid_lang"
    session = body.get("sessionId")
    if not isinstance(session, str) or not SESSION_PATTERN.match(session):
        return "invalid_session"
    if body.get("summary") is not None and not isinstance(body.get("summary"), dict):
        return "invalid_summary"
    if body["kind"] == "trials":
        csv = body.get("csv")
        if not isinstance(csv, str) or not csv:
            return "missing_csv"
    if body["kind"] == "withdraw":
        if (body.get("summary") or {}).get("withdraw_choice") not in ("yes", "no"):
            return "invalid_withdraw"
    return None


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        origin = self.headers.get("Origin")
        if not origin or origin not in ALLOWED_ORIGINS:
            return None
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
            "Vary": "Origin",
        }

    def _send(self, payload, status, cors):
        raw = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        for key, value in (cors or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self):
        cors = self._cors()
        if not cors:
            self.send_response(403)
            self.end_headers()
            return
        self.send_response(204)
        for key, value in cors.items():
            self.send_header(key, value)
        self.end_headers()

    def do_GET(self):
        self._send({"error": "method_not_allowed"}, 405, self._cors() or {})

    def do_POST(self):
        cors = self._cors()
        if not cors:
            self._send({"error": "origin_not_allowed"}, 403, {})
            return
        if self.path != "/iat":
            self._send({"error": "not_found"}, 404, cors)
            return

        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_BODY_BYTES:
            self._send({"error": "too_large"}, 413, cors)
            return

        raw = self.rfile.read(length)
        try:
            body = json.loads(raw)
        except ValueError:
            self._send({"error": "invalid_json"}, 400, cors)
            return

        problem = validate(body)
        if problem:
            print("  rejected: %s" % problem, flush=True)
            self._send({"error": problem}, 400, cors)
            return

        if FORCE_STATUS:
            print("  forcing HTTP %d" % FORCE_STATUS, flush=True)
            self._send({"error": "forced_failure"}, FORCE_STATUS, cors)
            return

        RECEIVED_DIR.mkdir(exist_ok=True)
        name = "%s_%s_%s.json" % (body["kind"], body["pid"], body["sessionId"])
        (RECEIVED_DIR / name).write_text(json.dumps(body, indent=2))

        rows = body.get("csv", "").count("\n")
        print(
            "  accepted %s  pid=%s lang=%s  csv_rows=%s  summary=%s"
            % (body["kind"], body["pid"], body["lang"], rows, json.dumps(body.get("summary") or {})),
            flush=True,
        )
        self._send({"ok": True, "dryRun": True, "kind": body["kind"]}, 200, cors)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.command, self.path))


if __name__ == "__main__":
    note = " (FORCING HTTP %d)" % FORCE_STATUS if FORCE_STATUS else ""
    print("Mock REDCap bridge on http://127.0.0.1:%d/iat%s" % (PORT, note), flush=True)
    HTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
