import { createHash } from "node:crypto";
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { kitVersion } from "../packages/video-kit/src/brand";
import { parseVideoManifest } from "../packages/video-kit/src/schema";

const { values } = parseArgs({
	args: process.argv.slice(2).filter((arg) => arg !== "--"),
	options: { from: { type: "string" } },
});
if (!values.from)
	throw new Error(
		"Usage: bun run video:assets -- --from /reviewed/render/directory",
	);
const manifestPath = "src/data/videos.json";
const manifest = parseVideoManifest(
	JSON.parse(readFileSync(manifestPath, "utf8")),
);
for (const template of manifest.templates) {
	const source = resolve(values.from, template.id);
	const report = JSON.parse(readFileSync(join(source, "render.json"), "utf8"));
	if (
		report.kitVersion !== kitVersion ||
		report.template !== template.id ||
		report.project !== "hexly-ai" ||
		report.mode !== "all" ||
		report.fps !== 30 ||
		report.pages.length !== 7 ||
		report.width / report.height !== 16 / 9
	)
		throw new Error(`Expected a complete Hexly 16:9 sample: ${template.id}`);
	const publish = (file: string) => {
		const bytes = readFileSync(join(source, file));
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		if (
			bytes.length > 20 * 1024 * 1024 ||
			!report.artifacts.some(
				(artifact: { file: string; sha256: string; bytes: number }) =>
					artifact.file === file &&
					artifact.sha256 === sha256 &&
					artifact.bytes === bytes.length,
			)
		)
			throw new Error(`Unverified or oversized artifact: ${file}`);
		const name = `${basename(file, extname(file))}-${sha256.slice(0, 12)}${extname(file)}`;
		const path = `/video-assets/video-kit/${kitVersion}/${template.id}/${name}`;
		const destination = join("public", path);
		mkdirSync(join("public/video-assets/video-kit", kitVersion, template.id), {
			recursive: true,
		});
		if (existsSync(destination)) {
			if (!readFileSync(destination).equals(bytes))
				throw new Error(`Immutable asset collision: ${path}`);
		} else copyFileSync(join(source, file), destination);
		return {
			src: path,
			bytes: bytes.length,
			sha256,
			width: report.width,
			height: report.height,
		};
	};
	template.poster = publish("poster.webp");
	template.clip = {
		...publish("sample.mp4"),
		duration: report.durationInFrames / report.fps,
		fps: 30,
	};
	template.deck = {
		pptx: publish("deck.pptx"),
		pdf: publish("deck.pdf"),
		pages: report.pages.length,
	};
	template.status = "ready";
	template.version = kitVersion;
}
manifest.kitVersion = kitVersion;
writeFileSync(
	manifestPath,
	`${JSON.stringify(parseVideoManifest(manifest), null, "\t")}\n`,
);
process.stdout.write(
	"Published five reviewed samples into the static asset boundary. Run video:check before committing.\n",
);
