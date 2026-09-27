import copy
import hashlib
import json
import subprocess
from pathlib import Path

base = Path('docs/brand-textures/2026-09-27-material-rollout')
batch = json.loads((base / 'inventory.json').read_text())
pilots = json.loads(Path('docs/brand-textures/2026-09-27-material-coverage/inventory.json').read_text())
descriptions = {
    'coffee': ('Porcelain turning arcs and fine nested grooves spread across a softly embossed paper field.', '陶瓷旋纹与细密弧线铺展于浅浮雕纸面。'),
    'matrix': ('Nested routing channels and small contact impressions form a finely worked geometric paper field.', '细密布线槽与接点压痕构成遍布纸面的几何纹理。'),
    'geekhub': ('Fine book-cloth grain and gently curved binding folds flow across the paper surface.', '细腻书布纤维与柔和装订褶纹铺满纸面。'),
    'dogfight': ('Brushed machining grain and tapered seam impressions recall the craft of an aircraft surface.', '拉丝加工纹与收束接缝压痕呼应飞机表面的工艺。'),
    'pew-game': ('Flowing walnut grain and partial machining arcs recall a crafted arcade control surface.', '流动胡桃木纹与局部加工弧纹呼应街机操控台的质感。'),
    'showtime': ('Satin film grain, diagonal cue ridges and paired perforation impressions flow across the paper.', '缎面胶片肌理、斜向标记压纹与成对齿孔痕迹铺展于纸面。'),
    'infospace': ('Divider channels and compressed paper fibers form an interwoven field of shallow impressions.', '分隔槽与压缩纸纤维交织为连续的浅压纹。'),
    'signoff-now': ('Rounded roller ridges, knurled grain and registration marks recall a mechanical counter.', '圆润滚轮压纹、细密滚花与定位痕迹呼应机械计数器。'),
    'unseal': ('Open latch-contact curves and softly parting seams spread through finely grained paper.', '开放的锁扣接触弧纹与微微分离的接缝铺展于细腻纸面。'),
    'flow': ('Soft keypress wells and nested switch-guide grooves form an irregular tactile paper field.', '柔和按压凹纹与细密导向槽在纸面错落分布。'),
    'arena': ('Interacting timing arcs and subtle walnut grain recall the measured rhythm of a chess clock.', '交错计时弧纹与细微胡桃木纹呼应棋钟的节奏。'),
    'dotty': ('Staggered ceramic contours, satin grain and shallow grout channels form a quiet geometric field.', '错落陶瓷轮廓、缎面细纹与浅接缝构成柔和几何底纹。'),
    'basalt': ('Stepped stone joinery and fine marble grain become shallow construction traces in paper.', '层叠石材榫接与细腻大理石肌理化为纸面浅浮雕。'),
    'echo': ('Incomplete survey arcs, small measurement notches and woven grain recall a pocket compass.', '不完整测量弧线、细小刻槽与织物肌理呼应袖珍罗盘。'),
    'deca': ('Open rotary-contact curves and finely ribbed routing impressions recall a desk telephone.', '开放旋转接触弧纹与细密肋纹通道呼应桌面电话。'),
    'runner': ('Partial timing rings, radial ticks and brushed grain form a softly worked paper surface.', '局部计时环、径向刻纹与拉丝细节构成柔和纸面底纹。'),
    'ipsafe': ('Parallel connector channels and strain-relief ridges form a continuous field of connection traces.', '平行连接槽与柔性护套肋纹构成连续的接触纹理。'),
    'dreamro': ('Leather-tooling curves, chevron seams and hammered grain recall handcrafted adventure equipment.', '皮革压花曲线、人字接缝与锤纹呼应手工冒险装备。'),
    'pi-agent-policy': ('Locating recesses, open contact channels and short return grooves recall an instrument service mat.', '定位凹纹、开放接触槽与短回路压纹呼应仪器检修垫。'),
    'diorama-journey': ('Stepped model-board contours, construction arcs and compressed fibers recall miniature scene making.', '层叠模型板轮廓、构造弧纹与压缩纤维呼应微缩场景制作。'),
    'zeppelin': ('Elongated hull-machining traces and fine docking arcs form a shallow engineered paper field.', '长条舰体加工纹与细密对接弧线构成纸面浅浮雕。'),
}
rows = copy.deepcopy(pilots['projects'] + batch['projects'])
for row in rows:
    en, zh = descriptions[row['id']]
    row['design'].update({'name': {'en': row['experiment']['name'], 'zh': row['design']['name']['zh']}, 'description': {'en': en, 'zh': zh}, 'motif': row['experiment']['motif'], 'rationale': 'Use the owner-approved full-square paper palette, fine material detail and shallow relief. Banner presentation uses a separate left-edge opacity gradient; preserve unmasked whole-canvas specimens and original icon bytes.'})
output = {**batch, 'scope': 'Twenty-one active material project-page texture updates, including six exact-byte owner-approved pilots and 36 delegated inspections.', 'siteBaseline': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(), 'tokenSource': {'path': 'src/styles/base.css', 'sha256': hashlib.sha256(Path('src/styles/base.css').read_bytes()).hexdigest()}, 'authorizationRecord': str(base / 'authorization.json'), 'projects': rows}
(base / 'export-inventory.json').write_text(json.dumps(output, ensure_ascii=False, indent='\t') + '\n')
print('Prepared export inventory for 21 project pages.')
