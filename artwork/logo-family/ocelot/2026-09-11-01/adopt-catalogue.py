"""Capture the published Ocelot source and prepare its targeted catalogue addition."""
import hashlib
import html
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

site = Path(__file__).resolve().parents[4]
study = Path(__file__).resolve().parent
source = Path(sys.argv[1]).resolve()
profile = site.parent / "nocoo"
relative_study = study.relative_to(site).as_posix()
run = "2026-09-11-01"
finishing = "03"
intake = "b2d89fd134464ab2812a08e6e46703c7cdddd44d"
description = "Read-only Obsidian reader for public and private GitHub vaults"
owner_approval = "可以，继续，去ocelot按规范替换logo，readme等，写入gh profile，继续做我们的页面发版z+1"


def command(*args, cwd=site):
    return subprocess.check_output(args, cwd=cwd).decode().strip()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent="\t") + "\n")


revision = command("git", "rev-parse", "HEAD", cwd=source)
profile_revision = command("git", "rev-parse", "HEAD", cwd=profile)
command("git", "merge-base", "--is-ancestor", revision, "origin/main", cwd=source)
command("git", "merge-base", "--is-ancestor", profile_revision, "origin/main", cwd=profile)
metadata = json.loads(command("gh", "repo", "view", "nocoo/ocelot", "--json", "description,homepageUrl,isArchived,isPrivate,isFork,defaultBranchRef,stargazerCount,url"))
assert metadata["description"] == "🐆 " + description
assert not metadata["homepageUrl"]
assert not metadata["isArchived"] and not metadata["isFork"] and not metadata["isPrivate"]
stats = json.loads(command("gh", "api", "graphql", "-f", 'query={repository(owner:"nocoo",name:"ocelot"){stargazerCount defaultBranchRef{name target{... on Commit{oid history{totalCount}}}}}}'))["data"]["repository"]
profile_bytes = subprocess.check_output(["git", "show", f"{profile_revision}:README.md"], cwd=profile)
entry = f"- 🐆 **[ocelot](https://github.com/nocoo/ocelot)** - {description}"
assert entry in profile_bytes.decode()
(study / "input/adopted").mkdir(parents=True, exist_ok=True)
(study / "input/adopted/github-profile.md").write_bytes(profile_bytes)
files = []
paths = ["README.md", "docs/README.en.md", "AGENTS.md", "package.json", "src/views/styles.css", "src/views/Mark.tsx", "src/views/App.tsx", "src/views/Markdown.tsx", "src/views/NavigationTree.tsx", "src/viewmodels/reader.ts", "worker/index.ts", "worker/app.ts", "worker/auth.ts", "worker/github.ts", "worker/store.ts", "docs/02-github-auth-cache-and-sync.md", "docs/06-running-and-deployment.md", "docs/08-visual-identity.md", "assets/brand/provenance.json", "index.html", "wrangler.jsonc"]
for path in paths:
    data = subprocess.check_output(["git", "show", f"{revision}:{path}"], cwd=source)
    archived = study / "input/adopted" / path
    archived.parent.mkdir(parents=True, exist_ok=True)
    archived.write_bytes(data)
    files.append({"path": path, "archive": archived.relative_to(site).as_posix(), "revision": revision, "bytes": len(data), "sha256": sha(data)})
snapshot = {"capturedAt": datetime.now(timezone.utc).isoformat(), "repository": metadata["url"], "archived": False, "private": False, "fork": False, "revision": revision, "publicRevisionAtIntake": intake, "profileRevision": profile_revision, "readmePublication": "Published to source main with the approved logo", "website": None, "websiteEvidence": "GitHub homepage is empty; source docs describe production as not deployed", "profile": {"entry": entry, "archive": f"{relative_study}/input/adopted/github-profile.md", "sha256": sha(profile_bytes)}, "metadata": metadata, "popularity": stats, "files": files}
snapshot_path = site / "docs/sources/ocelot-2026-09-11.json"
save(snapshot_path, snapshot)

provenance = json.loads((source / "assets/brand/provenance.json").read_text())
master = provenance["files"][0]
for file in provenance["files"]:
    assert sha(subprocess.check_output(["git", "show", f'{revision}:{file["path"]}'], cwd=source)) == file["sha256"]
original_name = "ocelot-family-2026-09-11-01-03.png"
previous_name = "ocelot-initial.svg"
original_root = site / "public/logos/originals"
for file, data in [(original_name, (source / "logo.png").read_bytes()), (previous_name, (study / "input/public/favicon.svg").read_bytes())]:
    destination = original_root / file
    if destination.exists():
        assert destination.read_bytes() == data
    else:
        destination.write_bytes(data)
palette = json.loads((study / "palette.json").read_text())
palette["applicationTheme"] = {"revision": revision, "path": "src/views/styles.css", "light": {"primary": "#435e73", "background": "#fefefd", "rail": "#f3f5f7", "ink": "#283440"}, "dark": {"primary": "#a3bbcd", "background": "#151c24", "rail": "#12161c", "ink": "#d8e0e7"}, "note": "Published application tokens. Rail resolves the Basalt L0 HSL token; artwork and presentation colors remain separate."}
save(study / "palette.json", palette)
family_palette = [{"color": "#e7d4b7", "role": "background", "label": {"en": "Sand paper", "zh": "砂色纸底"}, "source": f"Owner-authorized Ocelot presentation {run}/{finishing}; background.base in archived settings.json"}]
for index, color in enumerate(palette["artworkSamples"]):
    family_palette.append({"color": color["hex"], "role": "primary" if index == 0 else "accent", "label": {"en": color["label"], "zh": color["zh"]}, "source": f'Native Ocelot output SHA-256 {palette["nativeSource"]["sha256"]}; opaque sRGB pixel ({color["x"]}, {color["y"]}); {relative_study}/palette.json'})
family_palette.append({"color": "#917451", "role": "accent", "label": {"en": "Rosette relief", "zh": "斑纹浮雕"}, "source": f"Designed independent background motif, 22% opacity; {relative_study}/finishing/03/settings.json"})
theme = {key: {"value": value, "source": f"src/views/styles.css :root {token} at {revision}"} for key, value, token in [("primary", "#435e73", "--accent"), ("background", "#fefefd", "--paper"), ("ink", "#283440", "--ink")]}
direction = [
    {"aspect": "composition", "title": {"en": "A glance at a paper bird", "zh": "回望一只纸鸟"}, "description": {"en": "The ocelot turns toward the upper-right bird with both eyes visible. Its shoulder enters naturally through the bottom and lower-left frame. Both ears and the complete bird clear the rounded outline; the nearest bird tip retains 62.9 px of space.", "zh": "豹猫转向右上方的纸鸟，双眼清晰可见。肩部自然延伸出底边与左下边框，双耳和纸鸟均完整保留，鸟翼尖距实际圆角边界最近为 62.9 px。"}},
    {"aspect": "drawing", "title": {"en": "Gold facets and dark rosettes", "zh": "金色切面与深色斑纹"}, "description": {"en": "Connected irregular planes run across the face, ears and shoulder. Dark elongated spots, amber eyes and ivory whiskers keep the species readable. One coral, saffron and teal folded-paper bird supplies the secondary gesture; native opaque RGB is unchanged.", "zh": "连贯的不规则平面贯穿脸部、耳朵与肩颈，深色长斑、琥珀色双眼和象牙色胡须保留物种特征。珊瑚、藏红花与青绿色折纸鸟形成唯一的彩色趣味点，不透明像素保留原生 RGB。"}},
    {"aspect": "presentation", "title": {"en": "Rosettes and turned pages", "zh": "斑纹与翻页"}, "description": {"en": "Broken almond rosettes sit in the upper-left negative space while asymmetric page curves sweep through the lower-right. Sand paper, fine grain and two shallow shadows remain independent of the transparent mark. The application keeps its cool blue-gray theme.", "zh": "左上留白铺陈断开的杏仁形斑纹，右下以不对称曲线呼应翻页。砂色纸底、细颗粒和两层浅阴影独立于透明标记，应用保留原有的冷蓝灰配色。"}},
]
size_note = {"en": "At 128/64 px the two eyes, dark markings and paper bird remain distinct. At 32/24/16 px the warm feline profile carries recognition; whiskers, small spots and bird folds merge. App navigation and browser tabs use the full transparent foreground.", "zh": "128/64 px 可辨认双眼、深色斑纹和折纸鸟；32/24/16 px 主要依靠暖色猫科侧脸轮廓识别，胡须、小斑点与纸鸟折面会合并。应用导航和浏览器页签使用完整透明前景。"}
root = f"/logos/family/ocelot/{run}/{finishing}"
previous = {"original": f"/logos/originals/{previous_name}", "sourceUrl": f"https://github.com/nocoo/ocelot/blob/{intake}/public/favicon.svg", "width": 64, "height": 64, "sha256": sha((original_root / previous_name).read_bytes())}
subject = {"en": "Warm-gold faceted ocelot watching a colorful paper bird", "zh": "凝望彩色折纸鸟的暖金色碎片豹猫"}
stack = [
    ("TypeScript / React / Vite", "MVVM web reader and static frontend builds", "MVVM 网页阅读器与静态前端构建"),
    ("Basalt 2.1.7 / Pierre Trees", "Controls, application layout and virtualized vault navigation", "控件、应用布局与知识库虚拟目录"),
    ("react-markdown / unified", "GFM, frontmatter, Obsidian links, callouts and sanitized HTML", "GFM、frontmatter、Obsidian 链接、提示块与 HTML 清理"),
    ("KaTeX / Mermaid", "Mathematical notation and diagrams", "数学公式与图表"),
    ("Cloudflare Workers / Access", "Owner authentication and read-only GitHub requests", "所有者身份验证与只读 GitHub 请求"),
    ("Cloudflare D1 / private R2", "Repository metadata and a rebuildable private cache", "仓库元数据与可重建的私有缓存"),
    ("Vitest / Playwright / Biome", "Runtime coverage, browser accessibility and static checks", "运行时代码覆盖率、浏览器无障碍与静态检查"),
]
project = {"id": "ocelot", "repo": "ocelot", "title": "Ocelot", "emoji": "🐆", "description": {"en": description, "zh": "面向 GitHub 公开与私有知识库的只读 Obsidian 阅读器"}, "category": "tools", "website": None, "websiteSource": None, "repository": metadata["url"], "subject": subject["en"], "reference": False, "archived": False, "logo": {"kind": "original", "original": f"/logos/originals/{original_name}", "sourcePath": "logo.png", "sourceUrl": f"https://github.com/nocoo/ocelot/blob/{revision}/logo.png", "modified": False, "width": 2048, "height": 2048, "bytes": master["bytes"], "sha256": master["sha256"], "thumbnail": "/logos/display/ocelot-160.webp", "display": "/logos/display/ocelot-1024.webp"}, "theme": theme, "colors": {"primary": "#435e73", "background": "#fefefd", "ink": "#283440", "palette": [{"color": value["value"], "role": key if key != "ink" else "accent", "source": value["source"]} for key, value in theme.items()] + [{**color, "role": "accent" if color["role"] == "primary" else color["role"]} for color in family_palette]}, "source": {"profileRevision": profile_revision, "profileSection": "Recent Projects", "description": description, "repositoryRevision": revision}, "overview": {"goal": {"en": "Read public and private Obsidian vaults from GitHub in a quiet, single-user web reader. Browse folders, follow wiki links and outlines, render math and diagrams, and apply new Git revisions explicitly while the source vault stays read-only. Production configuration is prepared; no deployed homepage is verified.", "zh": "在安静的单用户网页阅读器里阅读 GitHub 上的公开和私有 Obsidian 知识库。浏览目录、跟随双链与大纲、查看公式图表，并主动应用新的 Git 版本，源知识库始终只读。生产配置已准备，尚无已验证的线上入口。"}, "techStack": [{"name": name, "role": {"en": en, "zh": zh}} for name, en, zh in stack], "verified": {"date": "2026-09-11", "revision": revision, "snapshot": {"path": snapshot_path.relative_to(site).as_posix(), "sha256": sha(snapshot_path.read_bytes())}, "sources": paths}}, "family": {"id": run, "finishing": finishing, "root": root, "archive": f"https://github.com/nocoo/hexly.ai/tree/main/{relative_study}", "status": "adopted", "updated": "2026-09-11", "model": "gpt-image-2", "foreground": {"subject": subject, "original": f"{root}/transparent.png", "display": f"{root}/transparent-1024.webp", "width": 2048, "height": 2048, "sha256": master["sha256"]}, "previous": previous, "direction": direction, "palette": family_palette, "sizeNote": size_note}}
save(site / "src/data/projects/ocelot.json", project)
index_path = site / "src/data/projects/index.json"
index = json.loads(index_path.read_text())
if "ocelot" not in index:
    index.append("ocelot")
save(index_path, index)
order_path = site / "src/data/project-order.json"
order = json.loads(order_path.read_text())
row = {"id": "ocelot", "repo": "ocelot", "stars": stats["stargazerCount"], "commits": stats["defaultBranchRef"]["target"]["history"]["totalCount"], "defaultBranch": stats["defaultBranchRef"]["name"], "revision": stats["defaultBranchRef"]["target"]["oid"], "capturedAt": snapshot["capturedAt"]}
assert not any(item["id"] == "ocelot" for item in order["animals"])
order["animals"].append(row)
save(order_path, order)

# Reuse the established standalone review surface and its shared CSS/interaction module.
page = (site / "artwork/logo-family/coffee/2026-09-11-01/review.html").read_text()
for old, new in [("coffee", "ocelot"), ("Coffee", "Ocelot"), ("finishing/01", "finishing/03"), ("finishing 01", "finishing 03"), ("Physical-object family", "Animal family"), ("Physical-object identity", "Fragmented animal identity"), ("Local source adoption", "Published source adoption"), ("adopted in the local source", "adopted in the published source"), ("A pause before the first sip.", "A curious glance, caught between pages."), ("A physical object, a decisive moment.", "An animal portrait, a decisive moment."), ("Peach ceramic cup, latte leaf, saucer and brass teaspoon", subject["en"]), ("Rose and oat paper · complete material identity", "Sand paper · rosettes and turned pages"), ("The original bean-and-sparkle application icon", "The original blue-gray SVG cat badge"), ("ocelot-initial.png", "ocelot-initial.svg"), ("Native material samples and an independently designed paper field.", "Native animal colors and an independently designed paper field.")]:
    page = page.replace(old, new)
page = page.replace("Bilingual ocelot flavor wheel, origin atlas, brewing lab and tasting journal", description)
articles = "".join(f'<article><p class="eyebrow">0{index + 1} / {item["aspect"].capitalize()}</p><h2>{html.escape(item["title"]["en"])}</h2><p>{html.escape(item["description"]["en"])}</p></article>' for index, item in enumerate(direction))
page = re.sub(r'(<section class="direction-grid"[^>]*>).*?(</section>)', lambda match: match[1] + articles + match[2], page, flags=re.S)
page = re.sub(r'<p class="caption">At 128/64 px.*?</p>', f'<p class="caption">{html.escape(size_note["en"])}</p>', page)
swatches = "".join(f'<button type="button" data-color="{color["color"].upper()}" style="--swatch: {color["color"]}" title="{html.escape(color["source"], quote=True)}"><span></span><strong>{html.escape(color["label"]["en"])}</strong><code>{color["color"].upper()}</code><small>{"Native opaque pixel" if "opaque sRGB" in color["source"] else "Designed presentation"}</small></button>' for color in family_palette)
page = re.sub(r'<div class="swatches">.*?</div>', '<div class="swatches">' + swatches + '</div>', page)
page = re.sub(r'(<p id="copy-status"[^>]*>).*?(</p>)', r'\1Select a swatch to copy its hex value. Samples come from the exact native generation. Ocelot retains its CSS primary #435E73, paper #FEFEFD and ink #283440; website tokens remain separate from this presentation.\2', page)
references = json.loads((study / "references.json").read_text())["references"]
reference_html = "".join(f'<a href="{item["path"]}" target="_blank" rel="noreferrer"><img loading="lazy" src="{item["path"]}" alt="{html.escape(item["role"], quote=True)}" /></a>' for item in references)
page = re.sub(r'<div class="reference-grid">.*?</div>', '<div class="reference-grid">' + reference_html + '</div>', page)
page = page.replace("They guide historical identity, material or presentation only", "They guide historical identity, connected flat facets and presentation")
(study / "review.html").write_text(page)

adoption = {"recordedAt": snapshot["capturedAt"], "project": "ocelot", "study": run, "finishing": finishing, "status": "adopted and published in source", "decision": {"ownerMessage": owner_approval, "rawSha256": provenance["rawSha256"], "record": "raw-review.json"}, "sourceRepository": metadata["url"], "sourceRevision": revision, "profileRevision": profile_revision, "masterFiles": provenance["files"][:4], "committedMasterBytesVerified": True, "previous": previous, "sourceSnapshot": snapshot_path.relative_to(site).as_posix(), "consumers": {"readmes": {"README.md": "assets/brand/icon-rounded.png", "docs/README.en.md": "../assets/brand/icon-rounded.png"}, "application": ["src/views/Mark.tsx", "src/views/styles.css", "public/logo-80.png", "public/logo-160.png"], "browser": ["index.html", "public/favicon-16.png", "public/favicon-32.png"], "platform": ["public/apple-touch-icon.png — square 180 px"], "social": ["index.html — https://hexly.ai/og/ocelot.jpg"], "exceptions": ["No ICO, PWA or native app consumer", "Cloudflare Access login is an independent service identity", "Ocelot production is not deployed"]}, "review": {"catalogue": "https://index.dev.hexly.ai/logos/ocelot", "static": f"https://index.dev.hexly.ai/{relative_study}/review.html"}, "verification": {"nativeAndExports": "inspection/finishing-03.json", "sourceBrowser": "inspection/source-browser/checks.json", "source": {"lint": "passed", "typecheck": "passed through source pre-commit", "affectedBrowserTests": 4, "consumerStates": 8, "unitCoverage": "source pre-push gate"}}, "publication": {"sourcePushed": True, "profilePushed": True, "githubDescriptionUpdated": True, "hexlyReleaseTarget": "v0.5.4", "hexlyReleaseStatus": "pending", "deploymentMonitoring": "Waived explicitly by the owner", "productionAcceptance": "Waived explicitly by the owner"}}
save(study / "adoption.json", adoption)
print(json.dumps({"sourceRevision": revision, "profileRevision": profile_revision, "projects": len(index), "animalStats": row, "snapshotSha256": sha(snapshot_path.read_bytes())}, indent=2))
