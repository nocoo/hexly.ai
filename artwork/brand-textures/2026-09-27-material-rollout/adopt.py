import json
import subprocess
import sys
from pathlib import Path

rows = json.loads(Path(sys.argv[1]).read_text())
for row in rows:
    path = Path(f"src/data/projects/{row['id']}.json")
    current = json.loads(path.read_text())
    baseline = subprocess.check_output(['git', 'show', f'5008c6fe:{path}'], text=True)
    expected = json.loads(baseline)
    assert {k: v for k, v in current.items() if k != 'brandTexture'} == {k: v for k, v in expected.items() if k != 'brandTexture'}
    encoded = json.dumps(row['brandTexture'], ensure_ascii=False, indent='\t')
    encoded = '\n'.join(('\t' + line) if index else line for index, line in enumerate(encoded.splitlines()))
    field = '\t"brandTexture": ' + encoded
    if 'brandTexture' in expected:
        start = baseline.index('\t"brandTexture": ')
        tail = baseline[start:]
        value_start = tail.index('{')
        _, length = json.JSONDecoder().raw_decode(tail[value_start:])
        updated = baseline[:start] + field + tail[value_start + length:]
    else:
        updated = baseline.rstrip()[:-1].rstrip() + ',\n' + field + '\n}\n'
    assert json.loads(updated) == {**current, 'brandTexture': row['brandTexture']}
    path.write_text(updated)
print(f"Adopted {len(rows)} reviewed texture packs with unchanged identity metadata.")
