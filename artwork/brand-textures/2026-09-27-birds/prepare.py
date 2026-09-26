import hashlib
import json
from pathlib import Path
import subprocess


def sha(value):
    return hashlib.sha256(value).hexdigest()


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent="\t") + "\n")


destination = Path("docs/brand-textures/2026-09-27-birds/inventory.json")
assert not destination.exists(), "Preserve the existing batch"
directions = [
    ("raven", "Rowan leaves", "花楸叶影", "Broad compound rowan leaves from a temperate woodland edge, with substantial oval serrated leaflets and clear central ribs. Use two unequal leafy sprays, no pine needles or berries."),
    ("dove", "Orchard leaves", "果园叶影", "Broad oval cherry leaves from a temperate orchard perch, gently serrated margins and curved secondary veins. Group five to seven unequal leaves on two short quiet stems. No blossoms or fruit."),
    ("lyre", "Forest fern folds", "林间蕨褶", "A damp southeastern Australian forest floor: two broad triangular tree-fern fronds with substantial clearly separated pinnae, accompanied by three long eucalyptus leaves. Keep fern divisions broad enough to read at small size, never lace-like."),
    ("rooster", "Morning-glory leaves", "牵牛叶影", "Broad heart-shaped morning-glory leaves from a farmyard garden, with distinct palmate veins and gently curled edges. Five to seven unequal leaves on one loose short vine. No flowers or coiled ornamental tendrils."),
    ("codo", "Garden sage leaves", "庭院鼠尾草", "A plausible hummingbird garden: generous oval sage leaves and a few paired honeysuckle leaves, with softly quilted veins and subtly folded tips. Two unequal clusters of five to seven primary leaves. No flowers or thin decorative flourishes."),
    ("owl", "Beech canopy leaves", "山毛榉叶影", "A temperate tawny-owl woodland: five broad oval beech leaves with strong arcing side veins and two smaller softly lobed oak leaves. One loose diagonal leafy grouping. No seed husks or scattered forest litter."),
    ("shrike", "Hawthorn leaf folds", "山楂叶褶", "A temperate hedgerow perch: broad deeply lobed hawthorn leaves with readable palmate veins, arranged in two unequal leafy sprays. Leaves dominate; short woody stems are subordinate. No visible thorns, berries or flowers."),
    ("clip", "Savanna leaf fans", "草原叶扇", "An ostrich savanna edge: broad lanceolate wild-grass blades in two loose bent fans, with a small spray of oval bushwillow leaves. Show broad folded surfaces and longitudinal veins, not fine hair-like grasses. No seed plumes or flowers."),
    ("fundly", "Coastal leaf shelter", "海岸叶荫", "A plausible vegetated subantarctic penguin coast, without asserting a penguin species: broad leathery coastal megaherb leaves with shallow scalloped margins and a few substantial folded tussock blades. Rounded low leaves dominate. No tropical foliage, ice, seed heads or flowers."),
    ("eagle", "Mountain birch leaves", "山地桦叶", "A broad mountain woodland edge associated with an eagle, without asserting an exact species or range: substantial triangular birch leaves with softly toothed margins, accompanied by several rounded aspen leaves. Loose overlapping leaf planes, no needles or cones."),
    ("rio", "Rainforest leaf folds", "雨林叶褶", "A scarlet macaw's tropical forest habitat: five broad elliptic tropical canopy leaves and two long heliconia leaves, with pronounced curved or parallel secondary veins and softly curled margins. No split monstera leaves, fruit, flowers or palms."),
    ("falcon", "Cliffside leaf shelter", "崖边叶荫", "A plausible temperate peregrine-falcon cliff margin: broad leathery sea-beet leaves with wavy edges and clear central ribs, together with a few smaller rounded coastal plantain leaves. This is one possible coastal habitat, not a species-range claim. No rocks, landscape, flowers or grass seed heads."),
    ("kite", "Oak woodland margins", "橡林叶缘", "A red kite's open woodland edge: broad softly lobed oak leaves with clearly modeled branching veins, accompanied by three smaller oval hazel leaves. Five to seven substantial leaf planes form one loose lower-right sweep. No acorns, flowers or feather shapes."),
]
rows = []
for project_id, name_en, name_zh, motif in directions:
    path = Path(f"src/data/projects/{project_id}.json")
    project = json.loads(path.read_text())
    assert not project["archived"]
    original = Path("public" + project["logo"]["original"]).read_bytes()
    assert sha(original) == project["logo"]["sha256"]
    pixels = subprocess.check_output(["node", "--input-type=module", "-e",
        "import sharp from 'sharp';process.stdout.write(await sharp(process.argv[1]).ensureAlpha().raw().toBuffer());",
        "public" + project["logo"]["original"]])
    previous = project.get("brandTexture")
    version = "1.0.1" if previous else "1.0.0"
    if previous:
        major, minor, patch = map(int, previous["version"].split("."))
        version = f"{major}.{minor}.{patch + 1}"
    study = f"artwork/brands/{project_id}/texture-studies/2026-09-27-flare-birds-01"
    assert not Path(study).exists()
    kit = project.get("brandKit")
    row = {
        "id": project_id, "title": project["title"], "archived": False,
        "action": "generate", "study": study, "version": version,
        "root": f"/textures/{project_id}/v{version}",
        "sourceMetadataSha256": sha(path.read_bytes()),
        "subject": project.get("family", {}).get("foreground", {}).get("subject", {}).get("en", project["subject"]),
        "officialProjectIdentity": {
            "path": project["logo"]["original"], "sha256": sha(original), "rgbaSha256": sha(pixels),
            "source": project["logo"]["sourceUrl"], "bytes": len(original),
            "width": project["logo"]["width"], "height": project["logo"]["height"], "kind": project["logo"]["kind"],
        },
        "existingKit": {"root": kit["root"], "version": kit["version"],
            "manifestSha256": sha(Path("public" + kit["root"] + "/manifest.json").read_bytes())} if kit else None,
        "previousTexture": previous,
        "design": {"identityType": "bird", "language": "habitat-botanical",
            "name": {"en": name_en, "zh": name_zh}, "motif": motif,
            "description": {"en": motif.split(". ")[0] + ".", "zh": name_zh + "：宽阔叶面与清晰叶脉形成浅浮雕，右侧疏密错落，左侧保留安静纸面。"},
            "rationale": "Use the recorded bird identity's plausible habitat. Match the existing Frogie animal texture's matte paper, broad readable leaves, shallow relief, calm left field and restrained theme palette. Do not alter the Logo or infer product features from vegetation."},
        "productEvidence": {"source": str(path), "purpose": project.get("overview", {}).get("goal", project["description"]),
            "inspectedRevision": project["source"]["repositoryRevision"]},
    }
    rows.append(row)
    for theme in ["light", "dark"]:
        template = Path(f"artwork/brands/frogie/texture-studies/2026-09-14-flare-rollout-01/{theme}/prompt.txt").read_text()
        template = template.replace("'Lily margins' for Frogie", f"'{name_en}' for {project['title']}")
        start = template.index("Design from the following product-specific brief:\n")
        end = template.index("\n\nART DIRECTION", start)
        template = template[:start] + "Design from the following product-specific brief:\n" + motif + template[end:]
        template += "\nSERIES CONSISTENCY: Broad leaf surfaces are the visual subject, sculpted as very shallow botanical relief into the same fine matte paper. Use five to nine substantial primary leaf planes, softly overlapping in an open arc on the right and lower-right. Keep at least the left 55 percent as continuous calm paper, and approximately 8 percent clearance around all leaf tips. A few smaller supporting leaves may bridge the group, but no scattered confetti, bouquet, sticks, cut-paper collage, stiff symmetrical frame or busy forest-floor still life. Leaf veins are rounded tactile folds, never flat line art or white etched outlines. Maintain muted sage-paper tonality with soft upper-left grazing illumination, consistent medium-low contrast and no isolated saturated accents. Match this same density, relief depth, lighting and placement in both themes. No flowers in this series.\n"
        target = Path(study) / theme / "prompt.txt"
        target.parent.mkdir(parents=True)
        target.write_text(template)
    Path(study, "brief.md").write_text(f"# {project['title']} — {name_en}\n\nIdentity: {row['subject']}\n\n{motif}\n\n{row['design']['rationale']}\n\nSource: {path}; revision {row['productEvidence']['inspectedRevision']}.\n\nThe owner requested all bird-project textures to follow the successful animal-series rules, waived another confirmation, and requested local integration and verification. Acceptance is delegated to the inspecting agent; no personal owner review of new bytes is claimed. Production upload and release are outside this batch.\n")
save(destination, {
    "schemaVersion": 1, "recordedAt": "2026-09-27", "siteBaseline": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
    "scope": "All 13 non-archived catalogue bird identities; local generation, delegated visual acceptance, integration and browser verification only.",
    "authorization": {"ownerRequest": "动物类不错，鸟类就质量不行了，按照类似的规则，给鸟类的项目生成底纹，要求一致。不必确认，生成完在本地启动验证", "generation": True, "acceptance": "delegated-agent", "publication": False},
    "model": "gpt-image-2.5-flare", "plannedRequests": 26, "nativeSize": [1024, 1024],
    "tokenSource": "src/styles/base.css", "originalIdentityRecolored": False, "productUIChanged": False,
    "projects": rows,
})
print(f"Prepared {len(rows)} bird projects / {len(rows) * 2} images")
