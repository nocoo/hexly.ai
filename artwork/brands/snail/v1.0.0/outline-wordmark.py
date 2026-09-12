"""Outline the site's exact Space Grotesk 600 glyphs; no font substitution.

Run from the hexly.ai root:
uv run --with fonttools==4.60.1 --with brotli==1.1.0 python artwork/brands/snail/v1.0.0/outline-wordmark.py
"""

from pathlib import Path
import subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

root = Path(__file__).parent
relative_root = root.resolve().relative_to(Path.cwd().resolve())
if subprocess.run(
    ["git", "cat-file", "-e", f"HEAD:{relative_root}/wordmark.svg"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
).returncode == 0:
    raise SystemExit("This wordmark version is committed. Create a new version.")
font = TTFont("node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2")
font = instantiateVariableFont(font, {"wght": 600}, inplace=False)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
units = font["head"].unitsPerEm
scale = 108 / units
tracking = -units / 23  # The site's -1px tracking at 23px, without changing glyphs.
advance = 0
paths = []
for letter in "Snail":
    name = cmap[ord(letter)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    paths.append(f'<path transform="translate({advance:.4f} 0)" d="{pen.getCommands()}"/>')
    advance += glyphs[name].width + tracking
width = round((advance - tracking) * scale + 32, 3)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="132" viewBox="0 0 {width} 132">\n'
    '  <title>Snail wordmark</title>\n'
    '  <desc>Unmodified Space Grotesk glyph outlines, weight 600. SIL Open Font License 1.1.</desc>\n'
    f'  <g fill="#30372e" transform="translate(16 104) scale({scale} {-scale})">\n'
    + "\n".join(f"    {path}" for path in paths)
    + '\n  </g>\n</svg>\n'
)
(root / "wordmark.svg").write_text(svg)
print(f"Outlined Snail in Space Grotesk 600: {width} × 132 SVG")
