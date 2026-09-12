import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { parseVideoManifest } from "../packages/video-kit/src/schema";
import vendor from "../packages/video-kit/vendor/pptxgenjs-source.json";

if (
	createHash("sha256")
		.update(readFileSync(join("packages/video-kit/vendor", vendor.archive)))
		.digest("hex") !== vendor.sha256
)
	throw new Error(
		"Vendored PptxGenJS archive does not match its source record.",
	);

const manifest = parseVideoManifest(
	JSON.parse(readFileSync("src/data/videos.json", "utf8")),
);
const expected = new Set<string>();
let total = 0;
for (const entry of [...manifest.templates, ...manifest.projects]) {
	for (const asset of [
		entry.poster,
		entry.clip,
		entry.deck.pptx,
		entry.deck.pdf,
	]) {
		const path = join("public", asset.src);
		const bytes = readFileSync(path);
		const sha = createHash("sha256").update(bytes).digest("hex");
		if (
			bytes.length !== asset.bytes ||
			sha !== asset.sha256 ||
			!asset.src.includes(sha.slice(0, 12))
		)
			throw new Error(`Video asset checksum/filename mismatch: ${path}`);
		if (bytes.length > 20 * 1024 * 1024)
			throw new Error(`Video asset exceeds the 20 MB budget: ${path}`);
		if (asset.src.endsWith(".webp")) {
			const image = await sharp(bytes).metadata();
			if (image.width !== asset.width || image.height !== asset.height)
				throw new Error(`Incorrect poster dimensions: ${path}`);
		}
		expected.add(asset.src.slice("/video-assets/".length));
		total += bytes.length;
	}
}
const actual = readdirSync("public/video-assets", { recursive: true }).filter(
	(path) => statSync(join("public/video-assets", String(path))).isFile(),
);
if (
	actual.some((path) => !expected.has(String(path))) ||
	actual.length !== expected.size
)
	throw new Error(
		"public/video-assets contains undeclared files. Keep render caches and source outside public/.",
	);
if (total > 40 * 1024 * 1024)
	throw new Error(
		"Curated video assets exceed 40 MB. Compress previews or host final media separately.",
	);
process.stdout.write(
	`Verified ${expected.size} declared video assets, ${(total / 1024 / 1024).toFixed(2)} MB; no render caches.\n`,
);
