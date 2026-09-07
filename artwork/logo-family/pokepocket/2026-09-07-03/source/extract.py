"""Extract the supplied illustration; preserve source JPEG and native resolution."""
from pathlib import Path
import hashlib,json,shutil
import numpy as np
from PIL import Image,ImageDraw
from scipy import ndimage

ROOT=Path('/Users/nocoo/workspace/personal/hexly.ai')
RUN=ROOT/'artwork/logo-family/pokepocket/2026-09-07-03'
if RUN.exists():raise SystemExit('This source adaptation already exists; use a new study.')
(RUN/'source').mkdir(parents=True)
(RUN/'verification').mkdir()
shutil.copy2('/Users/nocoo/Downloads/pokepocket.jpg',RUN/'source/reference.jpg')
shutil.copy2(__file__,RUN/'source/extract.py')
raw=Image.open(RUN/'source/reference.jpg').convert('RGB');raw.save(RUN/'source/decoded.png')
a=np.asarray(raw).astype(float);red,green,blue=np.moveaxis(a,-1,0)
possible=(a.min(2)>90)&(red-green>=-8)&(red-green<45)&(green-blue>=-8)&(green-blue<35)&(red-blue<65)
labels,n=ndimage.label(possible,np.ones((3,3),bool))
border_ids=np.unique(np.concatenate([labels[0],labels[:,0],labels[:,-1]]));border_ids=border_ids[border_ids>0]
background=np.isin(labels,border_ids)
foreground=~background
inside=ndimage.distance_transform_edt(foreground)
outside=ndimage.distance_transform_edt(background)
core=inside>=3;clear=outside>=4
_,fi=ndimage.distance_transform_edt(~core,return_indices=True)
_,bi=ndimage.distance_transform_edt(~clear,return_indices=True)
band=((inside>0)&(inside<3))|((outside>0)&(outside<=2))
y,x=np.where(band);f=a[fi[0,y,x],fi[1,y,x]];b=a[bi[0,y,x],bi[1,y,x]];o=a[y,x]
vector=f-b;energy=(vector**2).sum(1)
alpha=np.clip(((o-b)*vector).sum(1)/np.maximum(energy,1),0,1)
residual=np.sqrt(((o-(alpha[:,None]*f+(1-alpha[:,None])*b))**2).sum(1))
valid=(energy>300)&(residual<24)
opacity=foreground.astype(float);opacity[y[valid],x[valid]]=alpha[valid]
opacity[opacity<.02]=0;opacity[opacity>.985]=1
rgba=np.concatenate([a.copy(),np.round(opacity*255)[:,:,None]],axis=2)
soft=valid&(alpha>.02)&(alpha<.985)
unmatted=np.clip((o[soft]-(1-alpha[soft,None])*b[soft])/alpha[soft,None],0,255)
rgba[y[soft],x[soft],:3]=unmatted
rgba[opacity==0,:3]=0
output=Image.fromarray(np.round(rgba).astype('uint8'),'RGBA');output.save(RUN/'source/extracted.png')
Image.fromarray(np.round(opacity*255).astype('uint8'),'L').save(RUN/'source/alpha-mask.png')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent='\t')+'\n')
record={'kind':'reference-adaptation','generationCalls':0,'artwork':{'path':'source/extracted.png','sha256':digest(RUN/'source/extracted.png'),'width':960,'height':960},'reference':{'path':'source/reference.jpg','sha256':digest(RUN/'source/reference.jpg'),'width':960,'height':960,'ownerPath':'~/Downloads/pokepocket.jpg'},'derivation':{'script':'source/extract.py','scriptSha256':digest(RUN/'source/extract.py'),'decoded':'source/decoded.png','mask':'source/alpha-mask.png','method':'Exterior-connected beige segmentation from top and side edges; dark ink contours protect ivory clothing and skin. A narrow local color-line matte restores antialiased black outlines. No generative redrawing or invented detail.','nativeSize':[960,960],'opaquePixelsUnchanged':int(((opacity==1)&np.all(rgba[:,:,:3]==a,axis=2)).sum()),'softEdgePixels':int(((opacity>0)&(opacity<1)).sum())},'earlierGenerationAttempts':[{'study':'2026-09-07-01','result':'moderation_blocked; no output image'},{'study':'2026-09-07-02','result':'moderation_blocked; no output image'}]}
save(RUN/'source.json',record)
old=RUN.parent/'2026-09-07-02'
for file in ['authorization.json','sources.json']:
 shutil.copy2(old/file,RUN/file)
save(RUN/'references.json',{'references':[{'path':'source/reference.jpg','sha256':digest(RUN/'source/reference.jpg'),'role':'Owner-selected character illustration, retained and extracted at its native 960 × 960 resolution.'},{'path':'../../references/ref01.jpeg','role':'Tactile tonal field and offset portrait framing.'},{'path':'../../references/ref02.jpeg','role':'Related background relief and controlled contrast.'}]})
settings=json.loads((old/'presentation.json').read_text());settings.update({'sourceMode':'prepared-transparent','exportSizes':[2048,1024,960,512,256,128,64,48,32,24,16],'upscaledExportSizes':[2048,1024],'framing':{'scale':.88,'offsetAt2048':[0,123],'intentionalEdges':['bottom: jacket and lower forearm continue naturally through the viewfinder'],'note':'Uniform 0.88 placement keeps the original animal-free character pose and lower-frame body entry. The cap, complete raised ball and fingers are inset; no internal circular mask or stretched anatomy. Native art is 960 px; 1024/2048 exports are declared upscales.'}})
settings['shadows']=[{'color':[59,22,28],'opacity':.22,'blurAt2048':42,'offsetAt2048':[14,24]}]
save(RUN/'presentation.json',settings)
brief='''# PokePocket illustration adaptation

Use the exact owner-supplied 960 × 960 JPEG as the character source: red cap, ivory brim, backward glance and raised red-and-white ball. Keep its original drawing and natural pose. Extract the beige field, inset the complete character uniformly, and let the lower jacket and forearm continue naturally through the bottom viewfinder. No new facial drawing, neck extension or circular bust mask.

Compose a warm vermilion field with Pocket orbits: offset interrupted ball orbits and short curved seams. Preserve the ivory clothing, skin and eyes; keep a transparent foreground for favicons and small headers. Background, grain and contact shadow are separate.

The earlier two Azure generation attempts returned moderation_blocked and no image. The owner waived intermediate review for the remaining-project batch. After an optional design question received no answer during independent work, the agent proceeded with its recommended reference-extraction route. This study makes zero new model requests and does not claim a generated portrait. The native source is 960 × 960; 1024 and 2048 PNGs are explicit resampling exports, not new native detail.
'''
(RUN/'brief.md').write_text(brief);(RUN/'brief.txt').write_text(brief)
sspath=ROOT/'artwork/logo-family/audits/2026-09-07-objects/specs.json';ss=json.loads(sspath.read_text());spec=next(s for s in ss if s['id']=='pokepocket');spec.update({'study':'2026-09-07-03','mode':'reference-adaptation','width':960,'generationCalls':2});save(sspath,ss)
plate=Image.new('RGB',(1440,1000),'#eeece7');d=ImageDraw.Draw(plate)
for i,color in enumerate(['#f6f5ef','#17211d','#af4b4a']):
 bg=Image.new('RGBA',output.size,color);bg.alpha_composite(output);bg.thumbnail((470,470));plate.paste(bg.convert('RGB'),(480*i,35));d.text((480*i+10,10),color,fill='#202020')
raw.crop((140,325,440,610)).save(RUN/'verification/hair-source-crop.png')
output.crop((140,325,440,610)).save(RUN/'verification/hair-extracted-crop.png')
plate.save(RUN/'verification/extraction-inspection.jpg')
print('Prepared native 960 px extraction; no model request. Inspect before finishing.')
