from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from scipy.spatial import ConvexHull

RUN = Path('/Users/nocoo/workspace/personal/hexly.ai/artwork/logo-family/basalt/2026-09-08-01')
rgb = np.asarray(Image.open(RUN / 'raw/generated.png').convert('RGB'))
mask = np.asarray(Image.open(RUN / 'preparation/matte-candidate-247.png').convert('L')) > 0
labels, count = ndimage.label(mask, np.ones((3,3),dtype=bool))
sizes = np.bincount(labels.ravel())
main = int(np.argmax(sizes[1:]) + 1)
yy,xx = np.where((labels == main) & (np.indices(mask.shape)[0] >= 1425) & (np.indices(mask.shape)[0] <= 1540) & (np.indices(mask.shape)[1] >= 83) & (np.indices(mask.shape)[1] <= 223))
points = np.column_stack([xx,yy])
hull = points[ConvexHull(points).vertices].astype(float)
center = hull.mean(axis=0)
hull += (center-hull)/np.maximum(1,np.linalg.norm(center-hull,axis=1))[:,None]*1.5
polygon = [[round(float(x),2),round(float(y),2)] for x,y in hull]
settings = json.loads((RUN.parent / '2026-09-07-02/presentation.json').read_text())
settings['original'] = '../../../../public/logos/originals/basalt-family-2026-09-07-02-01.png'
settings['framing'] = {
    'scale': .8,
    'offsetAt2048': [6,-28],
    'intentionalEdges': [],
    'minimumClearanceAt2048': 128,
    'note': 'Uniformly inset the complete new tower to a comparable icon mass to the previous selected tower. Preserve every roof tip, finial and marble corner; no selective scaling, cropping or synthetic continuation.'
}
settings['matte'] = {
    'minimumChannel': 247,
    'maximumChroma': 18,
    'backgroundRgb': [251,252,252],
    'edgeBand': 4,
    'interiorDistance': 6,
    'searchRadius': 12,
    'minimumColorAlignment': .98,
    'maximumMatteEnergy': 500,
    'minimumComponentPixels': 100,
    'foregroundRegionsAt2048': [{'name': 'Opaque left Hanbaiyu slab highlight', 'points': polygon}],
    'backgroundSeedsAt2048': [[414,1331],[419,1338],[1633,1332]],
    'calibrationNote': 'The actual matte is near-white (251,252,252). Exterior threshold 240 cut connected physical marble highlights; 247 preserves the right foundation ledge, while a measured inset polygon protects the solid left marble plane. Unmatte only the four-pixel contour band against the sampled matte.',
    'foregroundProtectionReason': 'The bright left marble bevel is physical stone. The local hull comes from surrounding connected stone pixels in native rectangle [83,1425,223,1540], inset by 1.5 pixels; it closes only the white-material leak, without recoloring or adding a drawn contour.',
    'backgroundSeedReason': 'Three small patches show the white exterior through the two rear-balustrade openings. Front rail gaps reveal physical floor or masonry; lattice-window interiors, marble planes and metal highlights stay opaque.',
    'componentCleanupReason': 'All sub-100-pixel connected regions are inspected pale fringe/edge-rendering residue, including marks along the native canvas border. Preserve the continuous tower and its connected ornaments.'
}
(RUN / 'presentation.json').write_text(json.dumps(settings,ensure_ascii=False,indent='\t')+'\n')
preview = Image.fromarray(rgb.copy())
draw = ImageDraw.Draw(preview)
draw.polygon([tuple(p) for p in polygon],outline='#e649a9',width=2)
preview.crop((60,1390,280,1580)).resize((880,760)).save(RUN / 'preparation/marble-protection-region.png')
removed=[]
for label in range(1,count+1):
    if sizes[label]>=100:
        continue
    y,x=np.where(labels==label)
    samples=rgb[y,x]
    removed.append({'pixels':int(sizes[label]),'bounds':[int(x.min()),int(y.min()),int(x.max()),int(y.max())],'minimumRgb':samples.min(axis=0).tolist(),'maximumRgb':samples.max(axis=0).tolist()})
(RUN / 'preparation/component-candidates.json').write_text(json.dumps({'sourceSha256':json.loads((RUN/'raw-review.json').read_text())['imageSha256'],'components':removed,'totalPixels':sum(r['pixels'] for r in removed)},indent='\t')+'\n')
print(json.dumps({'protection':polygon,'isolatedComponents':len(removed),'isolatedPixels':sum(r['pixels'] for r in removed),'darkestComponentChannel':min(min(r['minimumRgb']) for r in removed)}))
