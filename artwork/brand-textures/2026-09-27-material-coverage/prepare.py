import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

base = Path('docs/brand-textures/2026-09-27-material-coverage')
assert not (base / 'inventory.json').exists(), 'Preserve the existing experiment'
previous = json.loads(Path('docs/brand-textures/2026-09-27-materials/inventory.json').read_text())
candidates = json.loads(Path('docs/brand-textures/2026-09-27-materials/candidates.json').read_text())['candidates']
directions = {
    'coffee': ('Porcelain turning field', 'Curved material', 'A flowing field of open porcelain throwing-ring arcs, soft glaze-ripple bands and finely nested circular turning grooves. Their changing radii and directions suggest ceramic craft through shallow surface impressions. Delicate pressed paper fibers occupy the broad spaces between grooves. Use many overlapping incomplete arc families with varied scale and orientation, no complete cups, saucers, beans, stains or separate objects.'),
    'matrix': ('Routing-grain field', 'Geometric material', 'A flowing field of shallow rounded right-angle routing channels, finely nested micromilled furrows and occasional tiny square contact depressions. Use branching stepped turns of varied scale and direction, with subtle crosshatching and satin material grain between grooves. Route groups softly interweave across the surface. No disconnected square panels, large empty polygon faces, checkerboard, regular grid, circuit-board object, chips, neon, glowing lines or literal diagram.'),
    'geekhub': ('Book-cloth field', 'Woven material', 'A flowing field of fine book-cloth weave, softly undulating binding-gutter folds and close parallel compressed page-edge ridges. Interweave several shallow broad curved fold families of varied orientation with rich textile micrograin throughout their faces. This is a cloth-and-paper craft impression in one flat substrate. No book, newspaper, printed letters, detached pages, separate ribbons, draped cloth objects or deep folds.'),
}
composition = '''FULL-SQUARE DISTRIBUTION IS THE PRIMARY REQUIREMENT: The worked texture extends across nearly the ENTIRE SQUARE, from left to right and top to bottom, including upper-left, upper-right, lower-left, lower-right AND the middle. Give the left half comparable visual weight to the right half. Use 9-13 overlapping medium-sized material regions with irregular rhythms, variations of scale and gentle connections. Their combined envelope spans about 90-95 percent of both width and height. The actual sculpted, textured regions occupy roughly 65-75 percent of the canvas; the remaining calm paper appears as small irregular breathing spaces distributed throughout. Keep only a slim 3-5 percent outer margin. No broad empty left field, empty half, isolated right-hand cluster, central blank hole, border arrangement or one narrow vertical stripe. This is a complete square specimen of a distributed material field, not a banner with a text area. Texture must be clearly present in every quadrant and near every corner. Do not enlarge one motif into a giant object; distribute medium-scale richly worked motifs over the whole area.

SERIES STYLE: One uninterrupted fine matte paper substrate. All motifs are very shallow embossed/debossed impressions directly IN this paper, with broad gently modeled tonal faces, rounded soft lips and rich coherent microdetail. Structural grooves 4-8 native pixels wide remain readable at 300px display; 1-3px grain gives finely worked detail inside every region. The greater coverage comes from distribution across the square, not harder shadows, greater extrusion, more saturation or a new base material. Gentle diffuse light from upper left. Elegant, soft, tactile, low-to-medium tonal contrast. No hard outlines, dark vignette, dramatic spotlights, gloss, floating objects, detached slabs, noisy grunge or flat schematic line art. All apparent porcelain, circuit or cloth qualities are surface detail in the SAME paper palette.

'''
rows = []
for id, (title, category, motif) in directions.items():
    row = next(r for r in previous['projects'] if r['id'] == id).copy()
    row['study'] = f'artwork/brands/{id}/texture-studies/2026-09-27-flare-coverage-01'
    row['experiment'] = {'name': title, 'category': category, 'motif': motif}
    row['previousCandidates'] = {c['theme']: c for c in candidates if c['id'] == id}
    study = Path(row['study'])
    study.mkdir(parents=True, exist_ok=False)
    (study / 'brief.md').write_text(f'''# {title}

Existing identity: {row['subject']}.
Product: {row['productEvidence']['purpose']['en']}

{motif}

The owner rejected the previous right-only coverage and requested three
experiments before rollout. This {category.lower()} example tests distribution
across all four quadrants and the middle, with comparable left/right weight.
Preserve paper colors, shallow relief and finely worked material detail.
Generate one light and one dark native square for exact-byte owner review.
Original icons, other projects, catalogue integration and publication are outside
this experiment. Source provenance and prior candidate hashes are in inventory.
''')
    row['prompts'] = {}
    for theme in ['light', 'dark']:
        palette = ('LIGHT: warm ivory paper #f0f0e9 / #f8f8f2. Worked regions have muted pale sage body #bbc2ae to #d3d7c7, with restrained #9ba58d recesses and soft highlights. Fresh, light overall; never brown wood, silver metal or a differently colored base.' if theme == 'light' else 'DARK: pine-charcoal paper #1e2824 / #27332c. Worked regions have muted sage-gray body #3b483a to #56634d, with soft tonal highlights. Fine grooves and internal grain remain visible across all four quadrants. Never black clipping, white outlines, glossy metal or dramatic shadow.')
        prompt = f'''Generate one complete native 1024 x 1024 square decorative background texture for {row['title']}: {title}, {theme} theme. The texture must visually inhabit the full square.

PROJECT MATERIAL:
{motif}

{composition}{palette}

Strictly physical-material traces. No plants, leaves, flowers, feathers, animals, literal product, icon, UI, readable text, letters, numbers, watermark, frame or centered emblem. Straight-down orthographic continuous surface only. No need for seamless tiling: deliver one complete square canvas. Match the same full-square distribution, motif scale, fine detail and restrained relief in both themes.
'''
        run = study / theme
        run.mkdir()
        path = run / 'prompt.txt'
        path.write_text(prompt)
        row['prompts'][theme] = {'path': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
    rows.append(row)
inventory = {
    'schemaVersion': 1,
    'recordedAt': datetime.now(timezone.utc).isoformat(),
    'scope': 'Three full-square material coverage experiments, six light/dark originals.',
    'ownerFeedback': 'The material textures only cover the right side. Expand coverage to inhabit the square like the botanical series. Test three projects and wait for owner confirmation before rollout.',
    'authorization': {'generation': True, 'projectIds': list(directions), 'ownerAcceptance': 'pending', 'rollout': False, 'catalogueIntegration': False, 'iconReplacement': False, 'publication': False},
    'model': 'gpt-image-2.5-flare',
    'nativeSize': [1024, 1024],
    'coverageTarget': {'envelopeWidthAndHeight': '90-95%', 'workedArea': '65-75%', 'distribution': 'All four quadrants and middle; comparable left/right weight; scattered breathing spaces, no empty half.'},
    'references': {'light': '/textures/frogie/v1.0.0/texture-light.webp', 'dark': '/textures/raven/v1.0.1/texture-dark.webp', 'use': 'Palette, microdetail and relief references; latest owner instruction controls full-square coverage.'},
    'projects': rows,
}
(base / 'inventory.json').write_text(json.dumps(inventory, indent='\t') + '\n')
print('Prepared three projects and six full-square coverage prompts.')
