import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

base = Path('docs/icon-texture-rollout/2026-09-27')
projects = {id: json.loads(Path(f'src/data/projects/{id}.json').read_text()) for id in json.loads(Path('src/data/projects/index.json').read_text())}
roots = set()
for file in json.loads(Path('docs/assets/inventory.json').read_text())['files']:
    path = file.get('path', '')
    if path.startswith('/textures/'):
        parts = path.split('/')
        id = parts[2]
        if id in projects and not projects[id]['archived']:
            root = '/'.join(parts[:4])
            if root != projects[id]['brandTexture']['root']:
                roots.add((id, root))
batch = {'projects': [{'id': id, 'previousTexture': {'root': root}, 'root': projects[id]['brandTexture']['root']} for id, root in sorted(roots)]}
inventory = json.loads(Path('docs/assets/inventory.json').read_text())['files']
by_source = {file['source']: file for file in inventory}
receipts = {}
for line in Path('docs/assets/publication.jsonl').read_text().splitlines():
    receipt = json.loads(line)
    receipts[(receipt['key'], receipt['sha256'])] = receipt['verifiedAt']
keys = {}
for file in inventory:
    keys.setdefault(file['key'], []).append(file)
targets = {}
packages = []
embedded = json.loads(Path('docs/brand-textures/2026-09-27-material-rollout/retirement-plan.json').read_text())['embeddedIdentityKitDependencies']

def add_source(source, reason):
    path = Path(source)
    old = by_source.get(source)
    if not path.is_file() and not old:
        return
    actual = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else old['sha256']
    if old:
        assert actual == old['sha256'], f'Changed historical bytes: {source}'
    targets[source] = {'source': source, 'sha256': actual, 'bytes': path.stat().st_size if path.is_file() else old['bytes'], 'key': old['key'] if old else None, 'reason': reason}

for candidate in json.loads(Path('docs/brand-textures/2026-09-27-material-rollout/retirement-plan.json').read_text())['localCandidates']:
    add_source(candidate['source'], candidate['reason'])

for row in batch['projects']:
    previous = row.get('previousTexture')
    if previous:
        root = previous['root']
        assert root.startswith(f"/textures/{row['id']}/") and root != row['root']
        directory = Path('public' + root)
        for file in inventory:
            if file['source'].startswith(str(directory) + '/'):
                add_source(file['source'], 'Superseded independent texture pack')
        if directory.exists():
            for path in directory.rglob('*'):
                if path.is_file():
                    add_source(str(path), 'Superseded independent texture pack')
        manifest = directory / 'manifest.json'
        if manifest.is_file():
            for generation in json.loads(manifest.read_text())['generations']:
                source = generation['source'] + '/raw.png'
                assert f"/{row['id']}/texture-studies/" in source
                add_source(source, 'Raw source of superseded independent texture pack')
        references = subprocess.run(['rg', '-l', '-F', '--', root, 'src', 'public', 'tests', 'docs/profiles'], text=True, capture_output=True)
        assert references.returncode in (0, 1), references.stderr
        outside = [p for p in references.stdout.splitlines() if not p.startswith(str(directory) + '/')]
        packages.append({'id': row['id'], 'oldRoot': root, 'replacementRoot': row['root'], 'currentReferencesOutsideRetiredPack': outside})
    else:
        embedded.append({'id': row['id'], 'kitRoot': row['existingKit']['root'], 'reason': 'Texture is embedded in a still-retained identity kit with its own manifest/review references. Do not delete the identity kit or its referenced files as an independent texture package.'})
    old_study = Path(f"artwork/brands/{row['id']}/texture-studies/2026-09-27-flare-materials-01")
    for path in old_study.glob('*/raw.png'):
        add_source(str(path), 'Superseded right-only material experiment')

remote = []
for key in sorted({row['key'] for row in targets.values() if row['key']}):
    aliases = keys[key]
    outside = [file['source'] for file in aliases if file['source'] not in targets]
    remote.append({'key': key, 'sha256': aliases[0]['sha256'], 'bytes': aliases[0]['bytes'], 'sourceAliases': [file['source'] for file in aliases], 'remainingAliases': outside, 'sharedReferenceBlocksDeletion': bool(outside), 'lastPublicationReceipt': receipts.get((key, aliases[0]['sha256']))})

result = {'recordedAt': datetime.now(timezone.utc).isoformat(), 'mode': 'read-only retirement inventory; no local or remote deletion', 'authorization': str(base / 'authorization.json'), 'requiredBeforeDeletion': ['Every replacement pack passes exact-byte checks and is published.', 'The live catalogue selects the replacement version and browser/CDN checks pass.', 'Remove old active inventory/routes and document references together; keep tombstone receipts.', 'Recheck the exact key/hash allowlist and all aliases immediately before deletion.', 'Never delete a shared key with a remaining reference or a retained identity-kit dependency.'], 'independentPackages': packages, 'embeddedIdentityKitDependencies': embedded, 'localCandidates': list(targets.values()), 'remoteCandidates': remote, 'summary': {'independentPackages': len(packages), 'localFiles': len(targets), 'localLogicalBytes': sum(t['bytes'] for t in targets.values()), 'remoteKeys': len(remote), 'remoteInventoriedBytes': sum(r['bytes'] for r in remote), 'sharedKeysBlocked': sum(r['sharedReferenceBlocksDeletion'] for r in remote), 'deletedFiles': 0, 'deletedKeys': 0}}
result['summary']['remoteBytesWithPublicationReceipts'] = sum(r['bytes'] for r in remote if r['lastPublicationReceipt'])
result['summary']['remoteKeysWithoutPublicationReceipts'] = sum(r['lastPublicationReceipt'] is None for r in remote)
(base / 'retirement-plan.json').write_text(json.dumps(result, ensure_ascii=False, indent='\t') + '\n')
print(json.dumps(result['summary']))
