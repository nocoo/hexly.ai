from pathlib import Path
from collections import Counter
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

RUN = Path('/Users/nocoo/workspace/personal/hexly.ai/artwork/logo-family/basalt/2026-09-08-01')
review = json.loads((RUN / 'raw-review.json').read_text())
if review['status'] != 'approved':
    raise ValueError('Exact-byte raw acceptance is required before preparation.')
out = RUN / 'preparation'
out.mkdir(exist_ok=True)
raw = Image.open(RUN / 'raw/generated.png').convert('RGB')
rgb = np.asarray(raw)
border = np.concatenate([rgb[:8].reshape(-1,3),rgb[-8:].reshape(-1,3),rgb[:,:8].reshape(-1,3),rgb[:,-8:].reshape(-1,3)])
mode = [int(v) for v in Counter(map(tuple,border.tolist())).most_common(1)[0][0]]
font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 21)
records = []
board = Image.new('RGB',(1800,650),(28,31,34))
for panel, threshold in enumerate([240,244,247]):
    near = (rgb.min(2) >= threshold) & (np.ptp(rgb,axis=2) <= 18)
    labels, count = ndimage.label(near, np.ones((3,3),dtype=bool))
    outer = set(int(x) for x in np.unique(np.concatenate([labels[0],labels[-1],labels[:,0],labels[:,-1]])) if x)
    background = np.isin(labels, list(outer))
    foreground = ~background
    mask = Image.fromarray((foreground*255).astype('uint8'))
    mask.save(out / f'matte-candidate-{threshold}.png')
    preview = rgb.copy()
    preview[background] = [24,27,32]
    debug = Image.fromarray(preview)
    draw = ImageDraw.Draw(debug)
    pockets = []
    sizes = np.bincount(labels.ravel())
    for label in np.argsort(sizes[1:])[::-1]+1:
        if int(label) in outer or sizes[label] < 30:
            continue
        yy,xx = np.where(labels == label)
        x0,x1,y0,y1 = int(xx.min()),int(xx.max()),int(yy.min()),int(yy.max())
        cropped = labels[y0:y1+1,x0:x1+1] == label
        distance = ndimage.distance_transform_edt(np.pad(cropped,1))
        iy,ix = np.unravel_index(distance.argmax(),distance.shape)
        seed = [int(ix+x0-1),int(iy+y0-1)]
        pockets.append({'label':int(label),'pixels':int(sizes[label]),'bounds':[x0,y0,x1,y1],'seed':seed})
        if sizes[label] >= 120:
            draw.rectangle([x0,y0,x1,y1],outline=(238,63,155),width=3)
            draw.text((x0,max(0,y0-26)),str(label),fill=(238,63,155),font=font)
    yy,xx = np.where(foreground)
    fg_labels,fg_count = ndimage.label(foreground,np.ones((3,3),dtype=bool))
    fg_sizes = np.bincount(fg_labels.ravel())
    components=[]
    for label in np.argsort(fg_sizes[1:])[::-1]+1:
        if fg_sizes[label] > 1000:
            continue
        cy,cx = np.where(fg_labels == label)
        components.append({'label':int(label),'pixels':int(fg_sizes[label]),'bounds':[int(cx.min()),int(cy.min()),int(cx.max()),int(cy.max())]})
    record={'sourceSha256':review['imageSha256'],'modalBorderRgb':mode,'minimumChannel':threshold,'maximumChroma':18,'nativeBounds':[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())],'foregroundPixels':int(foreground.sum()),'unclassifiedInteriorWhites':pockets,'smallForegroundComponents':components,'note':'Preparation candidates only. Protect opaque marble, railings and highlights. Inspect enclosed whites before considering a seed.'}
    (out / f'matte-candidate-{threshold}.json').write_text(json.dumps(record,indent='\t')+'\n')
    debug.save(out / f'matte-regions-{threshold}.png')
    board.paste(debug.resize((600,600),Image.Resampling.LANCZOS),(panel*600,50))
    ImageDraw.Draw(board).text((panel*600+20,15),f'Exterior threshold {threshold}',font=font,fill='white')
    records.append(record)
    print(json.dumps({'threshold':threshold,'modalBorderRgb':mode,'foregroundPixels':int(foreground.sum()),'nativeBounds':record['nativeBounds'],'pockets':pockets[:28],'smallComponents':components[:15]}))
board.save(out / 'matte-contact-sheet.png')
raw.crop((0,1200,2048,2048)).save(out / 'raw-marble-closeup.png')
print('Saved exterior-mask candidates and the untouched lower-material crop.')
