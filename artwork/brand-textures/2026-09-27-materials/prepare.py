import hashlib
import json
from pathlib import Path
import subprocess


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent='\t') + '\n')


directory = Path('artwork/brand-textures/2026-09-27-materials')
destination = Path('docs/brand-textures/2026-09-27-materials/inventory.json')
assert not destination.exists(), 'Preserve the existing batch'
directions = json.loads((directory / 'directions.json').read_text())
projects = [json.loads(Path(f'src/data/projects/{id}.json').read_text()) for id in json.loads(Path('src/data/projects/index.json').read_text())]
assert {r[0] for r in directions} == {p['id'] for p in projects if p.get('family', {}).get('series') == 'material' and not p['archived']}
rows = []
for id, name_en, name_zh, motif in directions:
    p = next(p for p in projects if p['id'] == id)
    source = Path(f'src/data/projects/{id}.json')
    original = Path('public' + p['logo']['original'])
    assert sha(original.read_bytes()) == p['logo']['sha256']
    pixels = subprocess.check_output(['node', '--input-type=module', '-e', "import sharp from 'sharp';process.stdout.write(await sharp(process.argv[1]).ensureAlpha().raw().toBuffer());", str(original)])
    previous = p.get('brandTexture')
    version = '1.0.0'
    if previous:
        major, minor, patch = map(int, previous['version'].split('.'))
        version = f'{major}.{minor}.{patch + 1}'
    study = f'artwork/brands/{id}/texture-studies/2026-09-27-flare-materials-01'
    assert not Path(study).exists()
    kit = p.get('brandKit')
    row = {'id': id, 'title': p['title'], 'archived': False, 'action': 'generate', 'study': study,
           'version': version, 'root': f'/textures/{id}/v{version}',
           'sourceMetadataSha256': sha(source.read_bytes()), 'subject': p['family']['foreground']['subject']['en'],
           'officialProjectIdentity': {'path': p['logo']['original'], 'sha256': sha(original.read_bytes()), 'rgbaSha256': sha(pixels), 'source': p['logo']['sourceUrl'], 'bytes': original.stat().st_size, 'width': p['logo']['width'], 'height': p['logo']['height'], 'kind': p['logo']['kind']},
           'existingKit': {'root': kit['root'], 'version': kit['version'], 'manifestSha256': sha(Path('public' + kit['root'] + '/manifest.json').read_bytes())} if kit else None,
           'previousTexture': previous,
           'design': {'identityType': 'material', 'language': 'product-material', 'name': {'en': name_en, 'zh': name_zh}, 'motif': motif,
                      'description': {'en': motif, 'zh': name_zh + '：主体相关的加工痕迹化为纸面浅浮雕，统一右侧占比、细节尺度和浅深色调。'},
                      'rationale': 'Translate the recorded physical icon and product interaction into shallow material impressions. Match the accepted botanical series in paper palette, scale, density, relief depth, lighting and negative space. Do not include botanical motifs or redraw the icon.'},
           'productEvidence': {'source': str(source), 'purpose': p.get('overview', {}).get('goal', p['description']), 'inspectedRevision': p['source']['repositoryRevision']}}
    rows.append(row)
    for theme in ['light', 'dark']:
        palette = ('Warm matte paper #f0f0e9 and ivory #f8f8f2; substantial relief in pale sage-paper neutrals, with delicate shadows around #bcc2b3 and soft highlights. Keep the complete canvas clearly light and fresh.' if theme == 'light' else 'Deep pine-charcoal matte paper #1e2824 and #27332c; broad relief in muted sage-charcoal around #465547, with restrained gray-green grazing highlights. Keep the complete canvas dark and calm, while all major impressions stay legible. No glowing lines, metallic glare or inverted light-paper appearance.')
        prompt = f'''Create one complete native 1024 x 1024 square decorative background texture for Hexly.ai. This is the {theme} variant of "{name_en}" for {p['title']}. It must belong to one coordinated family of exquisitely tactile paper-relief backgrounds.

PROJECT-SPECIFIC SURFACE LANGUAGE:
{motif}

SHARED SERIES STYLE: One uninterrupted fine matte paper substrate fills the square. Render the project's physical-material traces as very shallow embossed and debossed paper relief, with broad softly modeled surfaces, rounded groove lips, believable micrograin and gentle occlusion. These are impressions IN the continuous substrate, never separate objects laid ON it. All apparent wood, ceramic, alloy, cloth or enamel qualities must remain subtle surface detail inside the same paper palette. No realistic brown wood, bright metal, glossy plastic or differently colored base material. No flat SVG strokes, schematic illustration or stock technical wallpaper.

{theme.upper()} PALETTE: {palette}
The hex codes are color targets, never text in the image. At most one tiny muted terracotta accent may appear only where the project brief explicitly calls for it, under one percent of the canvas. Otherwise the entire palette stays tonal. Preserve the separate existing icon's own colors by NOT drawing the icon here.

MATCHED COMPOSITION AND COVERAGE: Use five to seven substantial, irregularly spaced relief regions in a loose asymmetric sweep on the right and lower-right. The active textured group occupies about 30-40 percent of the canvas. Keep the left 55 percent mostly calm, continuous paper. Do not fill the whole image with a grid, repeated pattern, small symbols or uniform grooves. Several tiny secondary impressions may connect the main regions, but avoid scattered confetti. The group spans most of the right-hand height without forming a border, frame, rectangle, badge or central emblem. Keep EVERY major contour and groove endpoint fully inside the canvas, with a continuous 8-10 percent blank outer margin. Only fine base paper grain reaches the four edges. No texture region may be cut off at an image edge.

MATCHED FINENESS AND DEPTH: Major ridges, machining arcs, channels and contour lips are about 4-10 native pixels wide so they remain visible at 280-320 CSS pixels. Broad tonal relief is the main subject; a handful of hairlines cannot substitute for it. Use medium-low contrast, rich but orderly small-scale detail and very shallow soft shadow. Light comes gently from the upper-left. No hard black outlines, deep extrusion, dramatic spotlight, heavy vignette, grunge, glitter, busy stippling or noisy particles. Maintain this same density, depth, scale, lighting and placement in both theme variants.

No plants, leaves, flowers, feathers, animals or decorative organic cutouts. No literal product, icon, device, tool, UI, readable text, letters, numbers, signature, watermark, border or second focal object. Orthographic straight-down view of a continuous surface only. Deliver the intended full square directly. It will be proportionally contained as one complete canvas, never cropped, stretched, mirrored or tiled.
'''
        path = Path(study) / theme / 'prompt.txt'
        path.parent.mkdir(parents=True)
        path.write_text(prompt)
    Path(study, 'brief.md').write_text(f"# {p['title']} — {name_en}\n\nIdentity: {row['subject']}\n\nProduct: {p['description']['en']}\n\n{motif}\n\n{row['design']['rationale']}\n\nSource: {source}; revision {row['productEvidence']['inspectedRevision']}.\n\nThis batch is for owner review. Generate separate light/dark native originals and preserve all attempts. Agent inspection may reject a candidate, but owner acceptance is still pending. Do not export production derivatives, integrate catalogue textures, replace icons, upload or publish.\n")
save(destination, {'schemaVersion': 1, 'recordedAt': '2026-09-27', 'siteBaseline': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(),
                   'scope': 'All 21 non-archived material identities; generate 42 texture candidates for owner review only.',
                   'authorization': {'ownerRequest': '先把其余拟物系列的纹理补上，风格、占比、精细程度和色彩与叶片系列统一；先 review，然后再进行全部页面 icon 背景替换。', 'generation': True, 'acceptance': 'owner-review-pending', 'catalogueIntegration': False, 'iconReplacement': False, 'publication': False},
                   'nextPhase': {'requiresOwnerReview': True, 'regenerateIcon': False, 'background': 'Use the generated light texture behind the unchanged icon.', 'layers': ['light base', 'botanical or material texture', 'existing icon'], 'mask': 'An iOS continuous-corner icon contour, not a simple rounded rectangle.', 'scopeToConfirmAtImplementation': 'Page icons and App icon adoption targets.'},
                   'model': 'gpt-image-2.5-flare', 'plannedRequests': 42, 'nativeSize': [1024, 1024], 'tokenSource': 'src/styles/base.css', 'originalIdentityRecolored': False, 'productUIChanged': False,
                   'excludedArchived': ['hermes-on-herdr'], 'projects': rows})
print(f'Prepared {len(rows)} projects / {len(rows) * 2} owner-review candidates')
