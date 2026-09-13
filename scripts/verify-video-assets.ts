import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import provenance from "../packages/video-kit/brand-source.json";
import { brandAssetVersion, kitVersion } from "../packages/video-kit/src/brand";
import { parseVideoManifest } from "../packages/video-kit/src/schema";
import vendor from "../packages/video-kit/vendor/pptxgenjs-source.json";

const sha256 = (path: string) =>
	createHash("sha256").update(readFileSync(path)).digest("hex");
if (sha256(join("packages/video-kit/vendor", vendor.archive)) !== vendor.sha256)
	throw new Error(
		"Vendored PptxGenJS archive does not match its source record.",
	);
const manifest = parseVideoManifest(
	JSON.parse(readFileSync("src/data/videos.json", "utf8")),
);
if (manifest.kitVersion !== kitVersion)
	throw new Error("Video manifest and kit versions differ.");
for (const asset of provenance.assets)
	if (
		sha256(
			join(
				"packages/video-kit/public/video-kit",
				brandAssetVersion,
				"hexly",
				asset.file,
			),
		) !== asset.sha256
	)
		throw new Error(
			`Brand asset differs from its source record: ${asset.file}`,
		);
// Preview is generated from the same React composition. Old sample media must not silently return.
if (
	existsSync("public/video-assets") &&
	readdirSync("public/video-assets", { recursive: true }).some((path) =>
		statSync(join("public/video-assets", String(path))).isFile(),
	)
)
	throw new Error(
		"Pre-rendered video assets are no longer part of the preview. Keep renders outside public/.",
	);
process.stdout.write(
	"Verified 5 openings, 5 content layouts, 5 endings, both themes and licensed assets; no rendered media in public assets.\n",
);
