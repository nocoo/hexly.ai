#!/usr/bin/env python3
"""Run the unchanged Workflow GPT Image helper with durable, sanitized receipts.

No automatic paid retries. Existing attempts are preserved; a new attempt must
be selected explicitly after inspecting the failed/unknown outcome.
"""
import argparse
import base64
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import redirect_stdout, redirect_stderr
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path
import runpy
import struct
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request


def sha(value):
    return hashlib.sha256(value).hexdigest()


def now():
    return datetime.now(timezone.utc).isoformat()


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent="\t") + "\n")


def generate_one(row, theme, attempt):
    repo = Path.cwd()
    study = repo / row["study"]
    run = study / (theme if attempt == 1 else f"{theme}-attempt-{attempt:02d}")
    run.mkdir(parents=True, exist_ok=True)
    output = run / "raw.png"
    if any((run / name).exists() for name in ("request.json", "response.json", "raw.png")):
        print(f"Preserved existing attempt: {row['id']}/{run.name}")
        return 0 if output.exists() and (run / "raw-review.json").exists() else 2
    prompt = (study / theme / "prompt.txt").read_text()
    if attempt > 1:
        (run / "prompt.txt").write_text(prompt)
    helper = repo.parent / "workflow/agents/skills/agi-image-generation/scripts/generate.py"
    if not helper.is_file():
        raise SystemExit("The actual Workflow helper is required; no substitute API.")
    helper_revision = subprocess.check_output(
        ["git", "-C", str(repo.parent / "workflow"), "log", "-1", "--format=%H", "--", "agents/skills/agi-image-generation/scripts/generate.py"],
        text=True).strip()
    generation = runpy.run_path(str(helper))["generate_image"]
    native_open = urllib.request.urlopen
    started = time.monotonic()

    def record_open(request, **kwargs):
        payload = json.loads(request.data)
        save(run / "request.json", {
            "startedAt": now(), "provider": "Azure OpenAI",
            "endpointPath": "/openai/v1/images/generations", "method": request.get_method(),
            "parameters": {k: v for k, v in payload.items() if k != "prompt"},
            "promptFile": "prompt.txt", "promptSha256": sha(payload["prompt"].encode()),
            "referenceImages": [], "attempt": attempt,
            "helper": "workflow/agents/skills/agi-image-generation/scripts/generate.py",
            "helperRevision": helper_revision, "helperSha256": sha(helper.read_bytes()),
            "helperModified": False,
            "recorder": ".agents/skills/hexly-brand-textures/scripts/generate.py",
            "recorderSha256": sha(Path(__file__).read_bytes()),
            "modelSelection": "Owner selected Flare for decorative surfaces and delegated this complete catalogue rollout; primary identity generation is out of scope.",
        })
        try:
            with native_open(request, **kwargs) as response:
                body_bytes = response.read()
                request_id = response.headers.get("x-request-id") or response.headers.get("apim-request-id")
                status = response.status
        except urllib.error.HTTPError as error:
            try:
                detail = json.loads(error.read()).get("error", {})
            except (ValueError, AttributeError):
                detail = {}
            message = str(detail.get("message", ""))
            for variable in ("AZURE_OPENAI_API_KEY", "AZURE_OPENAI_ENDPOINT"):
                if os.environ.get(variable):
                    message = message.replace(os.environ[variable], "[redacted configuration]")
            save(run / "response.json", {
                "status": "http-error", "httpStatus": error.code,
                "requestId": error.headers.get("x-request-id") or error.headers.get("apim-request-id"),
                "retryAfter": error.headers.get("retry-after"),
                "providerErrorCode": detail.get("code"),
                "providerMessage": message[:600],
                "finishedAt": now(), "elapsedSeconds": round(time.monotonic() - started, 2),
                "outputs": [], "automaticRetry": False,
                "note": "Only sanitized diagnostic fields are retained. Authentication headers are omitted. No image received; provider billing outcome is not asserted.",
            })
            raise
        body = json.loads(body_bytes)
        outputs = []
        for item in body.get("data", []):
            raw = base64.b64decode(item["b64_json"], validate=True)
            if raw[:8] != b"\x89PNG\r\n\x1a\n":
                raise ValueError("Expected native PNG bytes")
            width, height = struct.unpack(">II", raw[16:24])
            outputs.append({"path": "raw.png", "bytes": len(raw), "sha256": sha(raw),
                            "width": width, "height": height, "rawResponseBytesPreserved": True})
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
        # The actual helper runs unchanged; its error body is not printed or archived.
        with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
            generation(prompt, str(output), model="gpt-image-2.5-flare", size="1024x1024", quality="high")
        receipt = json.loads((run / "response.json").read_text())
        assert len(receipt["outputs"]) == 1
        assert sha(output.read_bytes()) == receipt["outputs"][0]["sha256"]
        assert (receipt["outputs"][0]["width"], receipt["outputs"][0]["height"]) == (1024, 1024)
        save(run / "raw-review.json", {
            "status": "pending", "imageSha256": sha(output.read_bytes()), "recordedAt": now(),
            "ownerReviewedExactBytes": False, "scope": "Hexly campaign decoration only; original Logo unchanged.",
            "nextStep": "Agent must inspect the complete raw canvas under the owner's delegated acceptance before derivatives or integration.",
        })
        print(f"Generated {row['id']}/{run.name} in {time.monotonic()-started:.1f}s", flush=True)
        return 0
    except (Exception, SystemExit) as error:
        if not (run / "response.json").exists():
            save(run / "response.json", {
                "status": "unknown-outcome", "errorType": type(error).__name__,
                "finishedAt": now(), "elapsedSeconds": round(time.monotonic() - started, 2),
                "outputs": [], "automaticRetry": False,
                "note": "No verified output was saved. The request may have reached the provider; preserve this attempt and inspect before a separately recorded retry.",
            })
        receipt = json.loads((run / "response.json").read_text())
        print(f"Uncompleted {row['id']}/{run.name}: {receipt['status']} HTTP {receipt.get('httpStatus', 'unknown')}; no retry", flush=True)
        return 3 if receipt.get("httpStatus") in (401, 403) else 4 if receipt.get("httpStatus") == 429 else 2
    finally:
        urllib.request.urlopen = native_open


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", required=True)
    parser.add_argument("--project", action="append")
    parser.add_argument("--theme", choices=["light", "dark"])
    parser.add_argument("--attempt", type=int, choices=[1, 2], default=1)
    parser.add_argument("--jobs", type=int, choices=range(1, 5), default=4)
    parser.add_argument("--interval", type=float, default=18, help="Minimum seconds between request starts")
    parser.add_argument("--failed-only", action="store_true", help="An explicit later attempt only for themes without a successful earlier output")
    parser.add_argument("--generate", action="store_true", help="Make the authorized paid requests; otherwise list only")
    parser.add_argument("--one", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    data = json.loads(Path(args.inventory).read_text())
    rows = [r for r in data["projects"] if r["action"] == "generate" and (not args.project or r["id"] in args.project)]
    if args.project and set(args.project) != {r["id"] for r in rows}:
        parser.error("Unknown or excluded project; inspect the inventory")
    themes = [args.theme] if args.theme else ["light", "dark"]
    if args.interval < 0:
        parser.error("Request interval cannot be negative")
    tasks = [(row, theme) for row in rows for theme in themes]
    if args.failed_only:
        if args.attempt != 2:
            parser.error("--failed-only requires the explicit second attempt")
        tasks = [(row, theme) for row, theme in tasks
                 if json.loads((Path(row["study"]) / theme / "response.json").read_text())["status"] != "succeeded"]
    if not args.generate:
        print(json.dumps({"model": "gpt-image-2.5-flare", "projects": [r["id"] for r in rows],
                          "themes": themes, "attempt": args.attempt, "maximumRequests": len(tasks)}, indent=2))
        return
    if not os.environ.get("AZURE_OPENAI_API_KEY") or not os.environ.get("AZURE_OPENAI_ENDPOINT"):
        parser.error("Load Workflow credentials with direnv; never put them in arguments")
    if args.one:
        if len(rows) != 1 or len(themes) != 1:
            parser.error("One request requires one project and one theme")
        sys.exit(generate_one(rows[0], themes[0], args.attempt))
    stopped = threading.Event()
    pacing = threading.Lock()
    next_start = [0.0]
    stop_reason = [None]

    def task(row, theme):
        with pacing:
            while time.monotonic() < next_start[0]:
                if stopped.wait(min(1, next_start[0] - time.monotonic())):
                    return stop_reason[0] or 2
            if stopped.is_set():
                return stop_reason[0] or 2
            next_start[0] = time.monotonic() + args.interval
        command = [sys.executable, str(Path(__file__).resolve()), "--inventory", args.inventory,
                   "--project", row["id"], "--theme", theme, "--attempt", str(args.attempt), "--generate", "--one"]
        result = subprocess.run(command, capture_output=True, text=True)
        print(result.stdout.strip(), flush=True)
        if result.returncode in (3, 4):
            stop_reason[0] = result.returncode
            stopped.set()
        return result.returncode

    codes = []
    with ThreadPoolExecutor(max_workers=args.jobs) as pool:
        futures = [pool.submit(task, row, theme) for row, theme in tasks]
        for future in as_completed(futures):
            codes.append(future.result())
    print(json.dumps({"requestsScheduled": len(codes), "completedOrPreserved": codes.count(0),
                      "uncompleted": sum(code != 0 for code in codes), "authorizationStop": stop_reason[0] == 3,
                      "rateLimitStop": stop_reason[0] == 4}))
    sys.exit(1 if any(codes) else 0)


if __name__ == "__main__":
    main()
