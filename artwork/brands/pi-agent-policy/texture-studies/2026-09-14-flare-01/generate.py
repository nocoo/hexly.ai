#!/usr/bin/env python3
"""Run the unchanged Workflow helper and archive its sanitized HTTP receipt."""

import base64
from datetime import datetime, timezone
import hashlib
import io
import json
from pathlib import Path
import runpy
import struct
import sys
import time
import urllib.request


def sha(data):
    return hashlib.sha256(data).hexdigest()


def now():
    return datetime.now(timezone.utc).isoformat()


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent="\t") + "\n")


study = Path(__file__).resolve().parent
if len(sys.argv) != 2 or sys.argv[1] not in ("light", "dark"):
    sys.exit("Usage: generate.py light|dark; each treatment permits one request.")
run = study / sys.argv[1]
output = run / "raw.png"
if any((run / name).exists() for name in ("request.json", "response.json", "raw.png")):
    sys.exit("This request already exists. Preserve it; use a fresh study for a retry.")

helper = study.parents[4].parent / "workflow/agents/skills/agi-image-generation/scripts/generate.py"
generation = runpy.run_path(str(helper))["generate_image"]
native_open = urllib.request.urlopen
started = time.monotonic()


def record_open(request, **kwargs):
    # Call the actual skill helper's unchanged request; do not archive its headers.
    payload = json.loads(request.data)
    save(run / "request.json", {
        "startedAt": now(),
        "provider": "Azure OpenAI",
        "endpointPath": "/openai/v1/images/generations",
        "method": request.get_method(),
        "parameters": {key: value for key, value in payload.items() if key != "prompt"},
        "promptFile": "prompt.txt",
        "promptSha256": sha(payload["prompt"].encode()),
        "referenceImages": [],
        "helper": "workflow/agents/skills/agi-image-generation/scripts/generate.py",
        "helperSha256": sha(helper.read_bytes()),
        "helperModified": False,
        "modelSelection": "Owner explicitly selected Flare for decorative backgrounds.",
    })
    with native_open(request, **kwargs) as response:
        body_bytes = response.read()
        request_id = response.headers.get("x-request-id") or response.headers.get("apim-request-id")
        status = response.status
    body = json.loads(body_bytes)
    outputs = []
    for item in body.get("data", []):
        image = base64.b64decode(item["b64_json"], validate=True)
        if image[:8] != b"\x89PNG\r\n\x1a\n":
            raise ValueError("Expected a native PNG response.")
        width, height = struct.unpack(">II", image[16:24])
        outputs.append({
            "path": "raw.png", "bytes": len(image), "sha256": sha(image),
            "width": width, "height": height, "rawResponseBytesPreserved": True,
        })
    save(run / "response.json", {
        "status": "succeeded", "httpStatus": status, "requestId": request_id,
        "finishedAt": now(), "elapsedSeconds": round(time.monotonic() - started, 2),
        "response": {**{k: v for k, v in body.items() if k != "data"},
                     "data": [{k: v for k, v in item.items() if k != "b64_json"}
                              for item in body.get("data", [])]},
        "outputs": outputs,
    })
    return io.BytesIO(body_bytes)


urllib.request.urlopen = record_open
try:
    generation(run.joinpath("prompt.txt").read_text(), str(output),
               model="gpt-image-2.5-flare", size="1024x1024", quality="high")
finally:
    urllib.request.urlopen = native_open

receipt = json.loads(run.joinpath("response.json").read_text())
assert len(receipt["outputs"]) == 1
assert sha(output.read_bytes()) == receipt["outputs"][0]["sha256"]
save(run / "raw-review.json", {
    "status": "pending", "imageSha256": sha(output.read_bytes()),
    "recordedAt": now(), "ownerReviewedExactBytes": False,
    "scope": "Decorative background only; approved identity remains unchanged.",
    "nextStep": "Show the untouched PNG; record exact-byte review before derivatives or catalogue integration.",
})
