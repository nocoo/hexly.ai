import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

base = Path('docs/brand-textures/2026-09-27-material-rollout')
previous = json.loads(Path('docs/brand-textures/2026-09-27-materials/inventory.json').read_text())
old_candidates = json.loads(Path('docs/brand-textures/2026-09-27-materials/candidates.json').read_text())['candidates']
pilot = json.loads(Path('docs/brand-textures/2026-09-27-material-coverage/candidates.json').read_text())['candidates']
directions = {
    'dogfight': ('Brushed flight-panel grain', 'A distributed field of tapered chamfered machining traces, softly interlocking seam channels and closely nested brushed-alloy furrows. Vary their banking directions and widths across the paper. Each broad face carries coherent fine directional scoring. No detached panels, metal plates, aircraft silhouette, rivet diagram or literal machine.'),
    'pew-game': ('Arcade walnut grain', 'A distributed field of flowing walnut end-grain contours, partial brass-machining arcs and sparse shallow round contact impressions. Let fine nested grain bend through varied radii, with occasional open knot-like curves and quiet satin tooth. All walnut and brass qualities are tonal relief in paper, never brown timber, wood planks, a joystick, buttons or an arcade console.'),
    'showtime': ('Satin film-cue grain', 'A distributed field of broad satin-emulsion grain bands, softly beveled diagonal cue ridges and irregular small paired oblong sprocket depressions. Curving bands change direction and interweave through finely striated faces. No detached film strips, reels, slate, clapperboard, typography, production labels, black-and-white stripes or literal props.'),
    'infospace': ('Pressed divider grain', 'A distributed field of shallow open L-shaped divider channels and gently stepped paper-compression contours. Rich nested fiber ridges and close stacked-edge scoring fill the broad softly modeled spaces between channels. Mix rounded corners and offset directions without large empty polygon faces. No tray, detached sheets, separate rectangular plates, interface windows, checkerboard or regular grid.'),
    'signoff-now': ('Counter roller grain', 'A distributed field of softly curving roller-impression bands, close rounded knurl ridges, short grouped tally-like grooves and narrow recessed registration slots. Combine varying rolling directions with fine satin-enamel tooth throughout the broad faces. No digits, display, counter body, complete dial, printed tally symbols or detached roller objects.'),
    'unseal': ('Open latch-contact grain', 'A distributed field of nested curved latch-contact impressions and softly parting seam channels, with small open gaps placed irregularly between groove families. Rounded lips contain fine satin-enamel tooth and tightly spaced machining striations. Suggest release through interrupted contours only. No padlock, keyhole, key, shackle silhouette, device or separate metal piece.'),
    'flow': ('Soft keypress grain', 'A distributed field of softly dished keypress impressions joined by shallow curved switch-guide channels. Vary rounded-square contours in scale and orientation; closely nested compression ridges and satin ceramic-like tooth cover their broad faces. Make an irregular connected material field rather than rows of identical squares. No keyboard, detached keycaps, tile grid, Chinese characters, letters or printed marks.'),
    'arena': ('Paired timing-grain field', 'A distributed field of interacting incomplete timing arcs, rounded radial notches and softly flowing walnut-grain bands. Multiple offset arc families turn in different directions and overlap through fine nested grooves; avoid one central paired emblem. Translate the chess-clock craft into tonal paper relief. No clock body, clock hands, numbers, chess pieces or brown wood background.'),
    'dotty': ('Satin ceramic grain', 'A distributed field of staggered soft-square ceramic compression contours and gently intersecting grout channels. Fine nested bevel ridges and satin-glaze micrograin work the broad faces; nearby tonal values alternate irregularly. Join regions through shallow continuous substrate, not separate tiles. No hard checkerboard, equal regular grid, black-and-white contrast, cube, detached block or bare polygon face.'),
    'basalt': ('Stone joinery grain', 'A distributed field of shallow architectural ledge impressions, gently stepped dougong-like joinery channels and close flowing Hanbaiyu marble micrograin. Rounded construction traces change direction and interlock organically; restrained short chisel ridges enrich broad faces. No building, tower, roof silhouette, architectural illustration, detached masonry, colored stone or ornate emblem.'),
    'echo': ('Survey-arc grain', 'A distributed field of incomplete survey arcs with rounded shallow rims, small paired radial measurement notches and fine woven instrument-cloth tooth. Vary arc centers and radii over the surface; richly nested concentric scoring fills their wide bands. No compass object, needle, cardinal letters, map, coordinates, complete circular dial or central emblem.'),
    'deca': ('Rotary cord-contact grain', 'A distributed field of shallow open helical cord-contact impressions, curved switchboard-routing tracks and sparse recessed round indexing wells. Fine nested ribbing and satin grain connect multiple turning directions within a single substrate. No telephone, handset, complete rotary dial, digits, cable prop, loose wire or coils lying above the surface.'),
    'runner': ('Timing-ring grain', 'A distributed field of overlapping partial timing-ring bands with finely nested circular machining grooves, short shallow radial ticks and occasional small stopping gaps. Vary centers and radii, keep the brushed instrument grain visible across broad rounded faces. No watch body, hands, digits, single giant circle, central emblem or racing imagery.'),
    'ipsafe': ('Connector-channel grain', 'A distributed field of gently bending parallel cable-channel impressions, rounded ribbed strain-relief scoring and sparse paired connector-contact recesses. Several channel families change direction and interweave across finely grained broad faces. No network tester, plug, cable prop, LEDs, numbers, literal circuit diagram or full grid.'),
    'dreamro': ('Equipment tooling grain', 'A distributed field of asymmetric leather-tooling sweeps, shallow interlocking chevron seams and restrained hammered-alloy micrograin. Vary the curved tooling directions, use fine nested seams and gently modeled broad faces pressed into the same paper. No shield silhouette, weapons, character, heraldic symbol, fantasy runes, detached armor or metallic gold palette.'),
    'pi-agent-policy': ('Service-mat contact grain', 'A distributed field of rounded locating recesses, paired open contact channels and short return grooves worked into a fine service-mat grain. Interweave irregular stepped routes and soft corners with closely nested compression ridges across broad textured faces. One tiny muted terracotta inset may mark a return, below one percent of area. No device, button prop, circuitry diagram, uniform grid or central reset symbol.'),
    'diorama-journey': ('Model-board contour grain', 'A distributed field of gently stepped model-board relief bands, incomplete arch-construction grooves and small paired registration notches. Rich compressed fiber ridges and finely nested contour lines connect varied shallow curves across broad faces, recalling miniature construction and chapter progression. No island, building, archway object, lantern, landscape, detached model parts or perspective scene.'),
    'zeppelin': ('Hull-machining grain', 'A distributed field of elongated chamfered hull-machining traces, fine nested inset seams, open docking-alignment arcs and short satin-milled ribs. Change the orientation of broad scored regions and connect them through a continuous shallow substrate. No spacecraft silhouette, separate armor plates, vessel, yellow stripes, stars, galaxy, central emblem or perspective scene.'),
}
assert len(directions) == 18
current = [json.loads(path.read_text()) for path in Path('src/data/projects').glob('*.json') if path.name != 'index.json']
assert set(directions) | {'coffee', 'matrix', 'geekhub'} == {p['id'] for p in current if isinstance(p, dict) and p.get('family', {}).get('series') == 'material' and not p['archived']}
styles = {}
for theme in ['light', 'dark']:
    template = Path(f'artwork/brands/coffee/texture-studies/2026-09-27-flare-coverage-01/{theme}/prompt.txt').read_text()
    styles[theme] = 'FULL-SQUARE' + template.split('FULL-SQUARE', 1)[1]
    styles[theme] = styles[theme].replace('All apparent porcelain, circuit or cloth qualities', 'All apparent material qualities')
rows = []
for id, (name, motif) in directions.items():
    row = next(r for r in previous['projects'] if r['id'] == id).copy()
    assert hashlib.sha256(Path(f'src/data/projects/{id}.json').read_bytes()).hexdigest() == row['sourceMetadataSha256']
    row['study'] = f'artwork/brands/{id}/texture-studies/2026-09-27-flare-full-square-01'
    row['experiment'] = {'name': name, 'motif': motif}
    row['previousCandidates'] = {c['theme']: c for c in old_candidates if c['id'] == id}
    study = Path(row['study'])
    study.mkdir(parents=True, exist_ok=False)
    (study / 'brief.md').write_text(f'''# {name}

Existing identity: {row['subject']}.
Product: {row['productEvidence']['purpose']['en']}

{motif}

Follow the accepted Coffee, Matrix and GeekHub full-square coverage pilots:
the whole square contains fine shallow material relief in the shared paper
palette. Keep small distributed breathing spaces instead of an empty left half.
Generate light and dark native 1024-square canvases with Flare. Preserve the
original icon and all prior texture bytes. Banner presentation uses a separate
left-edge alpha mask; do not bake a fade into the specimen or raw PNG.
New outputs await owner review. Icon replacement and publication are separate.
''')
    row['prompts'] = {}
    for theme in ['light', 'dark']:
        run = study / theme
        run.mkdir()
        path = run / 'prompt.txt'
        path.write_text(f"Generate one complete native 1024 x 1024 square decorative background texture for {row['title']}: {name}, {theme} theme. The texture must visually inhabit the full square.\n\nPROJECT MATERIAL:\n{motif}\n\n{styles[theme]}")
        row['prompts'][theme] = {'path': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
    rows.append(row)
inventory = {'schemaVersion': 1, 'recordedAt': datetime.now(timezone.utc).isoformat(),
    'scope': 'Eighteen remaining active material identities, 36 full-square light/dark candidates; reuse six accepted pilot images.',
    'ownerInstruction': '可以，可以做其他的，注意，这个图在左侧你可能需要一点半透明渐变遮罩，不然作为banner右侧背景，于左侧衔接可能过于突兀。',
    'authorization': {'generation': True, 'projectIds': list(directions), 'pilotExactByteAcceptance': True, 'newOwnerAcceptance': 'pending', 'bannerMaskPreview': True, 'iconReplacement': False, 'publication': False},
    'model': 'gpt-image-2.5-flare', 'nativeSize': [1024, 1024],
    'bannerTreatment': 'Keep original PNG unchanged. Apply a separate alpha gradient at the left edge of the right-aligned square background layer. Text and icons stay opaque.',
    'acceptedPilots': [{'id': c['id'], 'theme': c['theme'], 'run': c['run'], 'sha256': c['sha256']} for c in pilot],
    'projects': rows}
(base / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent='\t') + '\n')
print('Prepared 18 remaining projects and 36 full-square prompts.')
