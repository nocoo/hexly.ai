"""Outline one catalogue project's actual site font and measure its own motif.

uv run --with fonttools==4.60.1 --with brotli==1.1.0 python artwork/brands/tools/outline.py <project-id> <brand-version>
Frozen historical tools and committed versions remain untouched.
"""

import hashlib
import html
import json
import subprocess
import re
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.svgLib.path import parse_path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

font_path = Path("node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2")
font = instantiateVariableFont(TTFont(font_path), {"wght": 600}, inplace=False)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
units = font["head"].unitsPerEm
scale = 140 / units
tracking = -units / 23
if len(sys.argv) != 3 or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", sys.argv[1]) or not re.fullmatch(r"\d+\.\d+\.\d+", sys.argv[2]):
    raise SystemExit("Usage: outline.py <project-id> <brand-version>")
project_id, version = sys.argv[1:]
if project_id not in json.loads(Path("src/data/projects/index.json").read_text()):
    raise SystemExit("Project must be in the current catalogue")
project = json.loads(Path(f"src/data/projects/{project_id}.json").read_text())
if project["archived"]:
    raise SystemExit("Cannot publish a new kit for an archived project")


def union(bounds):
    return [min(b[0] for b in bounds), min(b[1] for b in bounds),
            max(b[2] for b in bounds), max(b[3] for b in bounds)]


for project in [project]:
    root = Path(f'artwork/brands/{project_id}/v{version}')
    if subprocess.run(["git", "cat-file", "-e", f"HEAD:{root}/wordmark.svg"],
                      stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
        raise SystemExit(f"Committed version is immutable: {root}")
    recipe = json.loads((root / "recipe.json").read_text())
    if recipe["project"] != project_id or recipe["brandVersion"] != version:
        raise SystemExit("Recipe must match the requested project and version")
    title = recipe["typography"]["title"]
    paths, bounds, advance = [], [], 0
    for letter in title:
        if ord(letter) not in cmap:
            raise ValueError(f"Actual Space Grotesk font is missing {letter!r}; no substitution")
        glyph = glyphs[cmap[ord(letter)]]
        pen, measure = SVGPathPen(glyphs), BoundsPen(glyphs)
        glyph.draw(pen)
        glyph.draw(measure)
        if measure.bounds:
            x0, y0, x1, y1 = measure.bounds
            bounds.append((x0 + advance, y0, x1 + advance, y1))
            paths.append(f'<path transform="translate({advance:.4f} 0)" d="{pen.getCommands()}"/>')
        advance += glyph.width + tracking
    x0, y0, x1, y1 = union(bounds)
    width, height = round((x1 - x0) * scale + 32, 3), round((y1 - y0) * scale + 32, 3)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
           f'<title>{html.escape(title)} wordmark</title>'
           '<desc>Unmodified Space Grotesk 600 glyph outlines, SIL OFL 1.1. Full glyph bounds include descenders. Hexly campaign typography; not a replacement product UI font.</desc>'
           f'<g fill="#30372e" transform="translate({16 - x0 * scale:.4f} {16 + y1 * scale:.4f}) scale({scale:.6f} {-scale:.6f})">'
           + "".join(paths) + '</g></svg>\n')
    (root / "wordmark.svg").write_text(svg)
    recipe["typography"].update({"fontSha256": hashlib.sha256(font_path.read_bytes()).hexdigest(),
                               "width": width, "height": height,
                               "glyphBoundsUnits": [x0, y0, x1, y1], "canvasPaddingPx": 16})
    path_bounds = []
    for layer in recipe["pattern"]["layers"]:
        pen = BoundsPen(None)
        parse_path(layer["d"], pen)
        if pen.bounds:
            path_bounds.append(pen.bounds)
    x0, y0, x1, y1 = union(path_bounds)
    pattern_scale = 432 / max(x1 - x0, y1 - y0)
    recipe["pattern"]["bounds"] = [x0, y0, x1, y1]
    recipe["pattern"]["transform"] = {
        "scale": pattern_scale,
        "x": 256 - (x0 + x1) / 2 * pattern_scale,
        "y": 256 - (y0 + y1) / 2 * pattern_scale,
        "method": "Uniformly fit complete motif linework into 432px, leaving a transparent 40px tile perimeter. No clipped paths or recolored project artwork.",
    }
    (root / "recipe.json").write_text(json.dumps(recipe, ensure_ascii=False, indent="\t") + "\n")
print(f"Outlined {project_id} v{version} and measured its motif with the real site font.")
