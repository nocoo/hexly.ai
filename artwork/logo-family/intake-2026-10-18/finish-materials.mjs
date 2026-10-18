import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "../..");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sizes = [2048, 1024, 512, 256, 128, 64, 48, 32, 24, 16];
const studies = [
	{
		id: "hexly-ai",
		study: "2026-10-18-02",
		contour:
			"M505 130 Q511 127 518 131 L843 316 Q848 320 848 333 L848 693 Q848 705 839 713 L525 886 Q512 894 501 889 L187 713 Q176 707 176 695 L177 339 Q176 325 182 318 Z",
		colors: ["#eee6dc", "#faf7f1", "#ded0c0", "#b8997e"],
		pattern: "Ceramic workshop scoring",
		motif:
			"M-40 175L285 -12M-40 198L305 -2M730 1034L1060 844M738 1054L1070 863 M68 854L131 890L194 854L194 782L131 746L68 782Z M880 98L910 115L940 98M910 115V151",
		description:
			"Warm unglazed workboard with paired clay-scoring tracks and sparse hexagonal impression marks, relating to the ceramic directory emblem rather than product UI.",
		samples: [
			["Terracotta", 420, 345],
			["Cream ceramic", 510, 405],
			["Fired edge", 810, 600],
		],
		note: "The selected six-triangle ceramic is the owner's explicitly approved new identity. No return to the historical four-triangle artwork. Cream dividers are solid ceramic, not holes.",
		limitations:
			"At 16 and 24 px the six wedges remain a radial symbol, but clay grain, bevels and the narrow cream channels lose separation.",
	},
	{
		id: "base-ci",
		study: "2026-10-18-01",
		contour:
			"M172 504 C174 470 192 444 224 430 L576 293 C623 269 674 273 707 288 C731 298 747 315 766 336 L832 410 C856 440 865 474 865 511 L865 540 C865 587 840 623 800 650 L541 767 C489 791 421 792 365 779 C320 768 295 748 272 721 L212 649 C189 621 176 592 174 558 Z M368 566 Q379 563 383 556 L384 541 L411 531 Q423 526 423 517 L423 493 L510 460 Q520 456 527 461 L535 471 Q540 479 549 475 L590 460 Q595 475 605 472 L634 459 Q647 454 661 460 L688 486 L450 589 Q410 603 379 588 Z",
		colors: ["#e4eae2", "#f7f9f3", "#cfdacb", "#81977f"],
		pattern: "Inspection bench witness marks",
		motif:
			"M54 224V95H266M71 224V112H266 M742 922H946V757M742 905H929V757 M116 879h114m-114 -13v26m19 -20v14m19 -14v14m19 -14v14m19 -14v14m19 -20v26 M811 125l17 -10 17 10v20l-17 10 -17 -10Z",
		description:
			"A pale inspection bench with nested go/no-go corner gauges, a short witness ruler and a calibration stamp; distinct from a general engineering grid.",
		samples: [
			["Forest enamel", 251, 507],
			["Brass insert", 470, 388],
			["Satin steel", 307, 459],
		],
		note: "The enclosed aperture is transparent, including the baked floor shading inside it. The steel and brass vertical walls, tooth recesses and bright metal rim remain opaque.",
		limitations:
			"At 16 px the inspection frame and central opening survive, while brass steps and machined steel detail merge. The photo has an oblique opening, not a flat outlined glyph.",
	},
	{
		id: "base-cli",
		study: "2026-10-18-01",
		colors: ["#efe5d2", "#fcf8ed", "#ddcbb1", "#b19875"],
		pattern: "Driver service mat bit slots",
		motif:
			"M91 120h180q12 0 12 12v15q0 12 -12 12H91q-12 0 -12 -12v-15q0 -12 12 -12Z M103 133h19m19 0h19m19 0h19m19 0h19 M798 850l91 -83 14 16 -91 83Z M99 854l53 -48m-38 63l53 -48 M762 138l42 46m-34 -53l42 46",
		description:
			"Amber-tinted service mat with shallow bit-storage slots and short diagonal driver alignment scores, echoing reusable command-line utilities as a compact hand tool.",
		samples: [
			["Amber resin", 610, 395],
			["Warm resin edge", 505, 559],
			["Knurled steel", 409, 625],
		],
		note: "The resin's photographed transmission and steel reflections are retained as opaque RGB; no unsupported physical transparency reconstruction is claimed. Exterior-connected extraction retains the complete fitted bit.",
		limitations:
			"At 16 px the diagonal driver silhouette is readable, but knurling and resin depth disappear; at 24 px the collar is a small silver band.",
	},
	{
		id: "base-mcp",
		study: "2026-10-18-01",
		contour:
			"M267 451 C279 393 323 324 366 303 C386 293 402 291 421 299 L661 409 C680 418 694 428 705 433 C726 431 741 444 750 464 C762 486 767 514 765 539 C763 591 731 652 687 688 C662 714 641 725 618 720 L330 591 C300 581 280 567 271 541 C261 516 259 484 267 451 Z",
		colors: ["#e2e8ee", "#f6f9fc", "#ccd7e3", "#8098af"],
		pattern: "Coupling alignment witness arcs",
		motif:
			"M74 264A176 176 0 0 1 285 70M96 270A154 154 0 0 1 279 93 M943 737A169 169 0 0 1 745 950M921 737A147 147 0 0 1 746 928 M763 103l54 25m-47 -40l54 25 M154 865l45 20m-22 -33l-15 37",
		description:
			"Cool assembly sheet with opposing coupling witness arcs and paired axial alignment ticks; the motif references joining transports without a copied circuit stencil.",
		samples: [
			["Cobalt sleeve", 339, 480],
			["Brushed steel", 404, 514],
			["Copper contact", 432, 489],
		],
		note: "Keep the accepted near-closed coupling and its tiny copper contacts. The dark central seam is a physical recess, not a transparent hole. No attempt to separate the approved halves.",
		limitations:
			"At 16 and 24 px cobalt sleeves and the metal cylinder dominate; copper contacts and the nearly closed coupling seam cannot be relied upon as distinct marks.",
	},
	{
		id: "next-ai",
		study: "2026-10-18-01",
		contour:
			"M372 349 C371 322 386 296 412 279 C450 253 493 250 532 255 C549 257 565 260 578 267 Q583 258 591 262 C606 267 627 280 638 291 Q644 298 644 310 Q653 327 652 348 C699 364 747 396 775 437 C799 469 807 492 806 524 L804 581 C803 646 766 703 705 739 C652 773 585 785 513 785 C431 785 358 772 308 739 C253 705 223 651 220 586 L220 527 C215 489 230 455 254 428 C285 392 330 365 372 349 Z",
		colors: ["#dfe8e7", "#f4f8f4", "#c7d6d5", "#7c9999"],
		pattern: "Selector bench detent sweep",
		motif:
			"M763 73A218 218 0 0 1 969 285 M785 77l-8 26m57 -11l-12 24m57 -4l-17 22m48 6l-21 18m38 21l-25 12 M69 805A183 183 0 0 0 232 969 M92 806A160 160 0 0 0 234 946 M115 129h62m-31 -31v62",
		description:
			"Pale selector assembly surface with a partial detent sweep, indexed radial strokes and one locating cross; a quiet analogue for choosing model providers.",
		samples: [
			["Petrol enamel", 313, 542],
			["Ivory knob", 490, 331],
			["Amber pointer", 612, 280],
		],
		note: "The complete ivory knob and amber pointer remain opaque. The ornamental detent relief and dark housing seams are preserved as approved, without making mechanical accuracy claims.",
		limitations:
			"At 16 px the ivory knob and petrol disk remain distinct; the amber pointer is fragile and individual detents vanish. Use the transparent mark without an additional corner mask.",
	},
];

async function json(file, value) {
	await writeFile(file, `${JSON.stringify(value, null, "\t")}\n`);
}

for (const item of studies) {
	const study = path.join(root, "logo-family", item.id, item.study);
	const receipt = JSON.parse(
		await readFile(path.join(study, "response.json"), "utf8"),
	);
	const raw = await readFile(path.join(study, receipt.savedFile));
	assert.equal(hash(raw), receipt.sha256);
	const { data: rgb, info } = await sharp(raw)
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	assert.equal(info.width, 1024);
	assert.equal(info.height, 1024);
	if (process.argv[2] === "prepare") {
		assert(
			!existsSync(path.join(study, "finishing/01")),
			"Never overwrite records for a frozen finishing pass.",
		);
		const settings = {
			project: item.id,
			series: "material",
			sourceMode: "isolated-white",
			sourceRecord: "generation-source.json",
			background: {
				base: item.colors[0],
				light: item.colors[1],
				shade: item.colors[2],
				motif: item.colors[3],
				grainAmplitude: 0.45,
				grainSeed: 20261018 + studies.indexOf(item),
				motifOpacity: 0.22,
				highlightOpacity: 0.3,
				ribbonOpacity: 0.1,
				pattern: {
					name: item.pattern,
					description: item.description,
					layers: [{ d: item.motif, tone: "motif", strokeWidth: 1.1 }],
				},
			},
			matte: {
				minimumChannel: 237,
				maximumChroma: 24,
				backgroundRgb: [253, 253, 253],
				edgeBand: 2,
				interiorDistance: 4,
				searchRadius: 7,
				minimumColorAlignment: 0.95,
				maximumMatteEnergy: 350,
				minimumComponentPixels: 16,
			},
			shadows: [
				{
					color: [50, 46, 40],
					opacity: 0.16,
					blurAt2048: 42,
					offsetAt2048: [0, 24],
				},
			],
			cornerRadius: 0.23,
			exportSizes: sizes,
			upscaledExportSizes: [2048],
			framing: {
				scale: 1,
				offsetAt2048: [0, 0],
				minimumClearanceAt2048: 128,
				note: "Native whole-object composition retained; no geometry or RGB resampling in the 1024 transparent master.",
			},
		};
		if (item.contour) {
			const mask = Buffer.from(
				`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><title>${item.id} native foreground extraction mask</title><path fill="white" fill-rule="evenodd" d="${item.contour}"/></svg>\n`,
			);
			await writeFile(path.join(study, "foreground-mask.svg"), mask);
			settings.matte = {
				foregroundMask: {
					path: "foreground-mask.svg",
					sha256: hash(mask),
					description:
						"Inspected native contour separates the material object from baked exterior shadow; even-odd subpaths remove only physical background holes.",
				},
			};
		}
		await json(path.join(study, "presentation.json"), settings);
		await json(path.join(study, "generation-source.json"), {
			status: "succeeded",
			output: {
				path: receipt.savedFile,
				sha256: receipt.sha256,
				width: info.width,
				height: info.height,
				bytes: raw.length,
			},
			originalReceipt: "response.json",
			model: null,
		});
		const palette = item.samples.map(([name, x, y]) => {
			const channels = [
				...rgb.subarray((y * 1024 + x) * 3, (y * 1024 + x) * 3 + 3),
			];
			return {
				name,
				x,
				y,
				rgb: channels,
				hex: `#${channels.map((v) => v.toString(16).padStart(2, "0")).join("")}`,
			};
		});
		await json(path.join(study, "palette.json"), {
			source: {
				path: receipt.savedFile,
				sha256: receipt.sha256,
				width: 1024,
				height: 1024,
			},
			foreground: palette,
			presentation: {
				status: "local-finished-candidate",
				base: item.colors[0],
				light: item.colors[1],
				shade: item.colors[2],
				motif: item.colors[3],
			},
			website: {
				status: "unchanged",
				note: "Artwork samples are not evidence of website design tokens.",
			},
		});
		await writeFile(
			path.join(study, "notes.md"),
			`# ${item.id}: approved material finishing\n\n${item.note}\n\n## Native evidence\n\nThe exact owner-approved source is a 1024 x 1024 JPEG from image_gen.imagegen; the model is unknown. The immutable response.json and raw-review.json remain authoritative. generation-source.json only normalizes those facts for the deterministic finisher; it does not claim another request or a reference adaptation. 2048 px exports are declared Lanczos3 upscales, never native detail.\n\n## Extraction and presentation\n\n${item.contour ? "A native SVG contour mask removes baked outside shadows without thresholding pale metal or ivory; opaque decoded RGB remains unchanged. Antialiased boundary pixels keep the photographed RGB, so subpixel JPEG matte contamination is possible, not new translucency." : "Exterior-connected near-white extraction with local edge matting retains the resin and steel. No global white deletion or physically reconstructed transmission."} The native object is not moved, stretched or redrawn. The finished foreground, mask, background, contact shadow and settings/tool snapshot are independently archived. Full rounded-outline clearance must be at least 64 native pixels (6.25%).\n\n${item.description}\n\n## Small marks\n\n${item.limitations}\n\nUse transparent foregrounds for headers/sidebar/favicons. Large presentations may use the square or rounded tile. These local files do not establish source-repository adoption or publication.\n`,
		);
	} else if (process.argv[2] === "finish") {
		execFileSync(
			process.execPath,
			[path.join(root, "logo-family/tools/finish_study.mjs"), study, "01"],
			{ stdio: "inherit" },
		);
	} else if (process.argv[2] === "curate") {
		const publicRoot = `/logos/family/${item.id}/${item.study}/01`;
		const destination = path.resolve(root, "../public", publicRoot.slice(1));
		assert(
			!existsSync(path.join(destination, "manifest.json")),
			"Never overwrite a curated manifest.",
		);
		await mkdir(destination, { recursive: true });
		const entries = [
			...["transparent", "icon", "rounded", "white"].map((kind) => [
				`${kind}.png`,
				`finishing/01/exports/${item.id}-${kind}-1024.png`,
			]),
			["background.png", "finishing/01/background.png"],
			["raw.jpg", receipt.savedFile],
			["prompt.txt", "prompt.txt"],
			...sizes.flatMap((size) =>
				["transparent", "icon", "rounded"].map((kind) => [
					`${kind}-${size}.png`,
					`finishing/01/exports/${item.id}-${kind}-${size}.png`,
				]),
			),
		];
		const files = [];
		for (const [name, source] of entries) {
			const bytes = await readFile(path.join(study, source));
			await writeFile(path.join(destination, name), bytes);
			files.push({
				path: `${publicRoot}/${name}`,
				bytes: bytes.length,
				sha256: hash(bytes),
			});
		}
		await json(path.join(destination, "manifest.json"), {
			study: `${item.id}/${item.study}`,
			finishing: "01",
			status: "review",
			nativeSize: 1024,
			upscaledExportSizes: [2048],
			model: null,
			rawFile: "raw.jpg",
			files,
		});
		await json(path.join(study, "material-metadata.json"), {
			project: item.id,
			study: item.study,
			finishing: "01",
			root: publicRoot,
			rawFile: "raw.jpg",
			model: null,
			nativeSize: 1024,
			upscaledExportSizes: [2048],
			palette: "palette.json",
			notes: "notes.md",
			foreground: {
				path: `${publicRoot}/transparent.png`,
				width: 1024,
				height: 1024,
				sha256: files[0].sha256,
			},
			icon: {
				path: `${publicRoot}/icon.png`,
				width: 1024,
				height: 1024,
				sha256: files[1].sha256,
			},
			raw: {
				path: `${publicRoot}/raw.jpg`,
				width: 1024,
				height: 1024,
				sha256: receipt.sha256,
			},
			sourceAdoption: "controller-owned; not performed by material finisher",
			publication: "not-published",
		});
	} else if (process.argv[2] === "verify") {
		const finishing = path.join(study, "finishing/01");
		const manifest = JSON.parse(
			await readFile(path.join(finishing, "manifest.json"), "utf8"),
		);
		for (const file of manifest.files) {
			const bytes = await readFile(path.join(finishing, file.path));
			assert.equal(hash(bytes), file.sha256);
			assert.equal(bytes.length, file.bytes);
		}
		const publicRoot = `/logos/family/${item.id}/${item.study}/01`;
		const curated = JSON.parse(
			await readFile(
				path.resolve(root, "../public", publicRoot.slice(1), "manifest.json"),
				"utf8",
			),
		);
		for (const file of curated.files) {
			const bytes = await readFile(
				path.resolve(root, "../public", file.path.slice(1)),
			);
			assert.equal(hash(bytes), file.sha256);
			assert.equal(bytes.length, file.bytes);
		}
		const foreground = await sharp(
			path.join(finishing, `exports/${item.id}-transparent-1024.png`),
		)
			.raw()
			.toBuffer();
		let opaquePixels = 0;
		let changedOpaquePixels = 0;
		for (let i = 0; i < 1024 * 1024; i++) {
			if (foreground[i * 4 + 3] === 255) {
				opaquePixels++;
				if (
					!foreground
						.subarray(i * 4, i * 4 + 3)
						.equals(rgb.subarray(i * 3, i * 3 + 3))
				)
					changedOpaquePixels++;
			}
			if (i < 1024 || i >= 1024 * 1023 || i % 1024 === 0 || i % 1024 === 1023)
				assert.equal(foreground[i * 4 + 3], 0);
		}
		assert.equal(changedOpaquePixels, 0);
		const palette = JSON.parse(
			await readFile(path.join(study, "palette.json"), "utf8"),
		);
		for (const sample of palette.foreground) {
			const index = sample.y * 1024 + sample.x;
			assert.equal(foreground[index * 4 + 3], 255);
			assert.deepEqual([...rgb.subarray(index * 3, index * 3 + 3)], sample.rgb);
			assert.equal(
				sample.hex,
				`#${sample.rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`,
			);
		}
		assert.equal(manifest.placement.clippedPixels, 0);
		assert(manifest.placement.minimumRoundedEdgeClearance >= 64);
		assert.deepEqual(manifest.upscaledExportSizes, [2048]);
		assert.equal(manifest.input.width, 1024);
		if (item.id === "base-ci") {
			assert.equal(foreground[(540 * 1024 + 520) * 4 + 3], 0);
			assert.equal(foreground[(470 * 1024 + 440) * 4 + 3], 255);
		}
		for (const size of sizes)
			for (const kind of ["transparent", "icon", "rounded"]) {
				const metadata = await sharp(
					path.join(finishing, `exports/${item.id}-${kind}-${size}.png`),
				).metadata();
				assert.equal(metadata.width, size);
				assert.equal(metadata.height, size);
			}
		const white = await sharp(
			path.join(finishing, `exports/${item.id}-white-1024.png`),
		)
			.removeAlpha()
			.raw()
			.toBuffer();
		assert.deepEqual([...white.subarray(0, 3)], [255, 255, 255]);
		const shadow = await sharp(path.join(finishing, "shadow-1.png"))
			.ensureAlpha()
			.extractChannel(3)
			.raw()
			.toBuffer();
		assert(shadow.some((value) => value > 0));
		const inspection = path.join(study, "inspection");
		await mkdir(inspection, { recursive: true });
		const composites = [];
		for (const [row, color] of ["#f6f5ef", "#17211d"].entries()) {
			let left = 16;
			for (const size of [256, 128, 64, 48, 32, 24, 16]) {
				const bytes = await sharp(
					path.join(finishing, `exports/${item.id}-transparent-${size}.png`),
				)
					.flatten({ background: color })
					.png()
					.toBuffer();
				composites.push({ input: bytes, left, top: row * 288 + 16 });
				left += size + 16;
			}
		}
		await sharp({
			create: { width: 704, height: 576, channels: 3, background: "#f6f5ef" },
		})
			.composite([
				{
					input: Buffer.from(
						'<svg xmlns="http://www.w3.org/2000/svg" width="704" height="576"><path fill="#17211d" d="M0 288h704v288H0z"/></svg>',
					),
				},
				...composites,
			])
			.png()
			.toFile(path.join(inspection, "actual-size-marks.png"));
		await json(path.join(study, "verification.json"), {
			checkedAt: new Date().toISOString(),
			rawSha256: receipt.sha256,
			finishingFilesChecked: manifest.files.length,
			curatedFilesChecked: curated.files.length,
			exportsChecked: 30,
			opaquePixels,
			changedOpaquePixels,
			roundedClearancePixels: manifest.placement.minimumRoundedEdgeClearance,
			clippedPixels: 0,
			nativeSize: 1024,
			upscaledExportSizes: [2048],
			inspectedThemes: ["light", "dark"],
			extractionLimitations: item.limitations,
			publication: "not-published",
		});
		console.log(
			`${item.id}: hashes, 30 exports, ${opaquePixels} unchanged opaque pixels; rounded clearance ${manifest.placement.minimumRoundedEdgeClearance}px`,
		);
	} else {
		throw new Error(
			"Usage: bun finish-materials.mjs prepare|finish|curate|verify",
		);
	}
}
