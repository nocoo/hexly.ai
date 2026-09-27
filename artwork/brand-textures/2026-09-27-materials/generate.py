import argparse
import http.client
import json
from pathlib import Path
import runpy
import ssl
import time
import urllib.request
import urllib.error


parser = argparse.ArgumentParser()
parser.add_argument('--attempt', type=int, required=True)
parser.add_argument('--project', action='append')
parser.add_argument('--theme', choices=['light', 'dark'])
parser.add_argument('--generate', action='store_true')
parser.add_argument('--probe', action='store_true')
args = parser.parse_args()
assert args.attempt > 0
runner = runpy.run_path('.agents/skills/hexly-brand-textures/scripts/generate.py')
batch_path = Path('docs/brand-textures/2026-09-27-materials/inventory.json')
batch = json.loads(batch_path.read_text())
native_connection = http.client.HTTPSConnection
connection_log = Path('.video-work/material-textures/connection-probe.json')


class HandshakeConnection(native_connection):
    def connect(self):
        for attempt in range(1, 6):
            try:
                super().connect()
                return
            except (ssl.SSLEOFError, ConnectionResetError) as error:
                # HTTPSConnection.connect has not sent the image HTTP request.
                if self.sock is not None:
                    self.sock.close()
                    self.sock = None
                events = json.loads(connection_log.read_text()) if connection_log.exists() else []
                events.append({"phase": "connect-before-http-request", "error": type(error).__name__,
                               "attempt": attempt, "paidRequestRetried": False, "at": runner["now"]()})
                runner["save"](connection_log, events)
                if attempt == 5:
                    raise
                time.sleep(2)


class HandshakeHandler(urllib.request.HTTPSHandler):
    def https_open(self, request):
        return self.do_open(HandshakeConnection, request, context=self._context)


urllib.request.install_opener(urllib.request.build_opener(HandshakeHandler()))
if args.probe:
    import os
    try:
        urllib.request.urlopen(os.environ['AZURE_OPENAI_ENDPOINT'].rstrip('/') + '/models', timeout=15)
    except urllib.error.HTTPError as error:
        print('Unauthenticated connectivity status:', error.code)
        raise SystemExit(0 if error.code == 401 else 1)
    raise SystemExit('Unexpected unauthenticated response')
tasks = []
for row in batch['projects']:
    if args.project and row['id'] not in args.project:
        continue
    assert not json.loads(Path(f"src/data/projects/{row['id']}.json").read_text())['archived']
    for theme in ([args.theme] if args.theme else ['light', 'dark']):
        study = Path(row['study'])
        reviews = list(study.glob(f'{theme}*/raw-review.json'))
        if any(json.loads(p.read_text())['status'] != 'rejected' for p in reviews):
            continue
        run = study / (theme if args.attempt == 1 else f'{theme}-attempt-{args.attempt:02d}')
        if (run / 'request.json').exists():
            continue
        tasks.append((row, theme, run))
if args.project:
    assert set(args.project) <= {row['id'] for row in batch['projects']}
print(json.dumps({'attempt': args.attempt, 'tasks': [{'id': row['id'], 'theme': theme} for row, theme, _ in tasks]}), flush=True)
if not args.generate:
    raise SystemExit(0)
events_path = batch_path.with_name('generation-events.json')
events = json.loads(events_path.read_text()) if events_path.exists() else []
events.append({'event': 'explicit-generation-attempt', 'attempt': args.attempt, 'recordedAt': runner['now'](),
               'adapter': str(Path(__file__)), 'adapterSha256': runner['sha'](Path(__file__).read_bytes()),
               'transportSource': 'artwork/brand-textures/2026-09-27-birds/resume.py',
               'policy': 'At most five reconnects inside TLS connect before HTTP is sent. No retry after sending starts. Preserve every prior attempt. Stop scheduling on authorization/rate limits or two consecutive incomplete outcomes.',
               'tasks': [{'id': row['id'], 'theme': theme} for row, theme, _ in tasks]})
runner['save'](events_path, events)
next_start = 0
failures = 0
for row, theme, run in tasks:
    run.mkdir(exist_ok=True)
    if not (run / 'prompt.txt').exists():
        (run / 'prompt.txt').write_bytes((Path(row['study']) / theme / 'prompt.txt').read_bytes())
    time.sleep(max(0, next_start - time.monotonic()))
    next_start = time.monotonic() + 35
    connection_log = run / 'connection-events.json'
    code = runner['generate_one'](row, theme, args.attempt)
    failures = failures + 1 if code else 0
    if code in (3, 4) or failures >= 2:
        raise SystemExit(code or 2)
