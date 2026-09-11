import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const study = dirname(fileURLToPath(import.meta.url));
const destination = resolve(process.argv[2] ?? "../ocelot");
const source = join(study, "finishing/03");
const mappings = [
	["exports/ocelot-transparent-2048.png", "logo.png", "transparent"],
	[
		"exports/ocelot-icon-2048.png",
		"assets/brand/icon.png",
		"square presentation",
	],
	[
		"exports/ocelot-rounded-2048.png",
		"assets/brand/icon-rounded.png",
		"rounded presentation",
	],
	[
		"background.png",
		"assets/brand/background.png",
		"independent paper background",
	],
];
const files = [];
async function record(path, role, derivedFrom = null) {
	const bytes = await readFile(join(destination, path));
	const { data, info } = await sharp(bytes)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	let clearPixels = 0;
	let opaquePixels = 0;
	for (let i = 3; i < data.length; i += 4) {
		if (data[i] === 0) clearPixels++;
		if (data[i] === 255) opaquePixels++;
	}
	files.push({
		path,
		role,
		derivedFrom,
		width: info.width,
		height: info.height,
		bytes: bytes.length,
		sha256: createHash("sha256").update(bytes).digest("hex"),
		clearPixels,
		opaquePixels,
	});
}
for (const [from, to, role] of mappings) {
	await mkdir(dirname(join(destination, to)), { recursive: true });
	await copyFile(join(source, from), join(destination, to));
	await record(to, role, `finishing/03/${from}`);
}
await mkdir(join(destination, "public"), { recursive: true });
for (const [name, size, master, role] of [
	["logo-80.png", 80, "logo.png", "transparent application mark"],
	["logo-160.png", 160, "logo.png", "transparent application mark at 2x"],
	["favicon-16.png", 16, "logo.png", "transparent browser favicon"],
	["favicon-32.png", 32, "logo.png", "transparent browser favicon"],
	[
		"apple-touch-icon.png",
		180,
		"assets/brand/icon.png",
		"square touch presentation; platform-masked",
	],
]) {
	await sharp(join(destination, master))
		.resize(size, size, { kernel: "lanczos3" })
		.png({ compressionLevel: 9 })
		.toFile(join(destination, "public", name));
	await record(`public/${name}`, role, master);
}
const provenance = {
	project: "ocelot",
	study: "2026-09-11-01",
	finishing: "03",
	archive:
		"https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/ocelot/2026-09-11-01",
	rawSha256: "4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a",
	ownerApproval:
		"可以，继续，去ocelot按规范替换logo，readme等，写入gh profile，继续做我们的页面发版z+1",
	exportTool: "export-source.mjs in the archived Hexly study",
	sharp: sharp.versions.sharp,
	placement:
		"Complete native 2048px canvas, scale 1, no crop or recoloring. The shoulder intentionally enters at the bottom and lower-left.",
	files,
};
await writeFile(
	join(destination, "assets/brand/provenance.json"),
	`${JSON.stringify(provenance, null, 2)}\n`,
);
console.log(
	JSON.stringify({
		destination,
		files: files.length,
		masters: files.slice(0, 4),
	}),
);
