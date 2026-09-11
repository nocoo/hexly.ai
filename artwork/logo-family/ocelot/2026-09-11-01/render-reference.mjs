import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const input = new URL("./input/public/favicon.svg", import.meta.url);
const output = new URL("./input/original-favicon-1024.png", import.meta.url);
const source = await readFile(input);
await sharp(source, { density: 1152 })
	.resize(1024, 1024)
	.flatten({ background: "#FFFFFF" })
	.png()
	.toFile(fileURLToPath(output));
const rendered = await readFile(output);
await writeFile(
	new URL("./input/reference-rasterization.json", import.meta.url),
	`${JSON.stringify(
		{
			method:
				"SVG rasterization for historical reference input; not model-generated artwork",
			source: "public/favicon.svg",
			sourceSha256: createHash("sha256").update(source).digest("hex"),
			output: "original-favicon-1024.png",
			outputSha256: createHash("sha256").update(rendered).digest("hex"),
			width: 1024,
			height: 1024,
			background: "#FFFFFF",
			tool: `sharp ${sharp.versions.sharp}`,
		},
		null,
		"\t",
	)}\n`,
);
