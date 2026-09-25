from pathlib import Path
import json,runpy,time
api=runpy.run_path('.agents/skills/hexly-brand-textures/scripts/generate.py')
rows=json.loads(Path('artwork/brands/bird-onboarding-2026-09-25/inventory.json').read_text())['projects']
for row in rows:
 for theme in ['light','dark']:
  started=time.monotonic()
  code=api['generate_one'](row,theme,1)
  if code: raise SystemExit(code)
  time.sleep(max(0,35-(time.monotonic()-started)))
