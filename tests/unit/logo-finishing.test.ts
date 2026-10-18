import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { expect, test } from "vitest";

const execute = promisify(execFile);
const tool = fileURLToPath(
	new URL("../../artwork/logo-family/tools/finish_study.mjs", import.meta.url),
);

test("finishes an approved built-in JPEG with a native contour and explicitly declared upscales", async () => {
	const study = await mkdtemp(join(tmpdir(), "hexly-material-finishing-"));
	const hash = (bytes: Buffer) =>
		createHash("sha256").update(bytes).digest("hex");
	try {
		const source = await sharp(
			Buffer.from(
				'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><path fill="#eeeeee" d="M0 0h128v128H0z"/><path fill="#999999" d="M20 22h96v96H20z"/><path fill="#faf8ef" d="M20 20h88v88H20z"/><path fill="#eeeeee" d="M44 44h40v40H44z"/></svg>',
			),
		)
			.jpeg()
			.toBuffer();
		const mask = Buffer.from(
			'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><path fill="white" fill-rule="evenodd" d="M20 20h88v88H20z M44 44h40v40H44z"/></svg>',
		);
		const output = {
			path: "generated.jpg",
			sha256: hash(source),
			width: 128,
			height: 128,
			bytes: source.length,
		};
		const receipt = JSON.stringify({
			savedFile: output.path,
			sha256: output.sha256,
			width: 128,
			height: 128,
			model: null,
		});
		await writeFile(join(study, "generated.jpg"), source);
		await writeFile(join(study, "response.json"), receipt);
		await writeFile(
			join(study, "generation-source.json"),
			JSON.stringify({
				status: "succeeded",
				output,
				originalReceipt: "response.json",
				model: null,
			}),
		);
		await writeFile(
			join(study, "raw-review.json"),
			JSON.stringify({ status: "approved", imageSha256: output.sha256 }),
		);
		await writeFile(join(study, "mask.svg"), mask);
		const recipe = {
			project: "fixture",
			sourceRecord: "generation-source.json",
			matte: { foregroundMask: { path: "mask.svg", sha256: hash(mask) } },
			background: {
				base: "#dddddd",
				light: "#eeeeee",
				shade: "#cccccc",
				motif: "#888888",
				motifOpacity: 0.1,
				grainAmplitude: 0,
				grainSeed: 1,
				pattern: {
					name: "Fixture contour",
					layers: [{ d: "M0 0h20v20H0z", tone: "motif" }],
				},
			},
			shadows: [],
			cornerRadius: 0.23,
			exportSizes: [256, 128, 16],
			upscaledExportSizes: [] as number[],
			framing: { minimumClearanceAt2048: 128 },
		};
		await writeFile(join(study, "presentation.json"), JSON.stringify(recipe));
		await expect(
			execute(process.execPath, [tool, study, "01"]),
		).rejects.toThrow(
			"Upscaled exports require an explicit upscaledExportSizes declaration.",
		);
		recipe.upscaledExportSizes = [256];
		await writeFile(join(study, "presentation.json"), JSON.stringify(recipe));
		await execute(process.execPath, [tool, study, "02"]);
		const result = await sharp(
			join(study, "finishing/02/exports/fixture-transparent-128.png"),
		)
			.raw()
			.toBuffer();
		const rgb = await sharp(source).raw().toBuffer();
		const at = (y: number, x: number) => (y * 128 + x) * 4;
		expect([...result.subarray(at(30, 30), at(30, 30) + 3)]).toEqual([
			...rgb.subarray((30 * 128 + 30) * 3, (30 * 128 + 30) * 3 + 3),
		]);
		expect(result[at(30, 30) + 3]).toBe(255);
		expect(result[at(60, 60) + 3]).toBe(0);
		expect(result[at(112, 112) + 3]).toBe(0);
		expect(await readFile(join(study, "response.json"), "utf8")).toBe(receipt);
		const manifest = JSON.parse(
			await readFile(join(study, "finishing/02/manifest.json"), "utf8"),
		);
		expect(manifest.sourceRecord).toBe("generation-source.json");
		expect(manifest.upscaledExportSizes).toEqual([256]);
		expect(manifest.input.width).toBe(128);
		expect(manifest.placement.clippedPixels).toBe(0);
		expect(
			(
				await sharp(
					join(study, "finishing/02/exports/fixture-icon-256.png"),
				).metadata()
			).width,
		).toBe(256);
		const wrongSize = {
			status: "succeeded",
			output: { ...output, width: 256 },
		};
		await writeFile(
			join(study, "generation-source.json"),
			JSON.stringify(wrongSize),
		);
		await expect(
			execute(process.execPath, [tool, study, "03"]),
		).rejects.toThrow(
			"Supplemental source dimensions or bytes differ from the native artwork.",
		);
		await writeFile(
			join(study, "generation-source.json"),
			JSON.stringify({ status: "succeeded", output }),
		);
		recipe.matte.foregroundMask.sha256 = "0".repeat(64);
		await writeFile(join(study, "presentation.json"), JSON.stringify(recipe));
		await expect(
			execute(process.execPath, [tool, study, "03"]),
		).rejects.toThrow("Foreground mask differs from its recorded hash.");
	} finally {
		await rm(study, { recursive: true, force: true });
	}
});

test("keeps pale anatomy and an eye highlight while extracting a backdrop gap and translating the full mark", async () => {
	const study = await mkdtemp(join(tmpdir(), "hexly-logo-finishing-"));
	try {
		const source = await sharp(
			Buffer.from(
				'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><path fill="white" d="M0 0h256v256H0z"/><path fill="#805030" d="M60 100h150v156H60z"/><path fill="white" d="M90 140h30v30H90zM135 180h10v10h-10z"/><path fill="#f9f9f9" d="M180 60h20v20h-20z"/></svg>',
			),
		)
			.png()
			.toBuffer();
		const sha256 = createHash("sha256").update(source).digest("hex");
		await writeFile(join(study, "source.png"), source);
		await writeFile(
			join(study, "response.json"),
			JSON.stringify({
				status: "succeeded",
				output: { path: "source.png", sha256 },
			}),
		);
		await writeFile(
			join(study, "raw-review.json"),
			JSON.stringify({ status: "approved", imageSha256: sha256 }),
		);
		await writeFile(
			join(study, "presentation.json"),
			JSON.stringify({
				project: "fixture",
				background: {
					base: "#998877",
					light: "#bbaa99",
					shade: "#887766",
					motif: "#665544",
					motifOpacity: 0.1,
					grainAmplitude: 0,
					grainSeed: 1,
					pattern: {
						name: "Fixture field",
						layers: [{ d: "M0 0h20v20H0z", tone: "motif" }],
					},
				},
				matte: {
					minimumChannel: 237,
					maximumChroma: 16,
					backgroundRgb: [255, 255, 255],
					edgeBand: 2,
					interiorDistance: 4,
					searchRadius: 7,
					minimumColorAlignment: 0.985,
					maximumMatteEnergy: 350,
					minimumComponentPixels: 16,
					foregroundRegionsAt2048: [
						{
							name: "Pale petal",
							points: [
								[1440, 480],
								[1600, 480],
								[1600, 640],
								[1440, 640],
							],
						},
					],
					backgroundSeedsAt2048: [[760, 1160]],
				},
				shadows: [],
				cornerRadius: 0.23,
				exportSizes: [256, 16],
				framing: { scale: 1, offsetAt2048: [-80, 80] },
			}),
		);
		await execute(process.execPath, [tool, study, "01"]);
		const pixels = await sharp(
			join(study, "finishing/01/exports/fixture-transparent-256.png"),
		)
			.ensureAlpha()
			.raw()
			.toBuffer();
		const pixel = (x: number, y: number) => [
			...pixels.subarray((y * 256 + x) * 4, (y * 256 + x) * 4 + 4),
		];
		expect(pixel(180, 80)).toEqual([249, 249, 249, 255]);
		expect(pixel(90, 160)[3]).toBe(0);
		expect(pixel(130, 195)).toEqual([255, 255, 255, 255]);
		expect(pixel(70, 130)).toEqual([128, 80, 48, 255]);
		expect(pixel(70, 255)).toEqual([128, 80, 48, 255]);
		expect(pixel(10, 10)[3]).toBe(0);
		const manifest = JSON.parse(
			await readFile(join(study, "finishing/01/manifest.json"), "utf8"),
		);
		expect(manifest.placement.offsetAt2048).toEqual([-80, 80]);
		expect(
			manifest.files.some(
				(file: { path: string }) => file.path === "matte-protection-mask.png",
			),
		).toBe(true);
		const continuation = Buffer.from(
			'<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048"><path fill="#605040" d="M240 800h1600v1248H240z"/></svg>',
		);
		await writeFile(join(study, "continuation.svg"), continuation);
		const recipe = JSON.parse(
			await readFile(join(study, "presentation.json"), "utf8"),
		);
		recipe.framing.continuation = {
			path: "continuation.svg",
			sha256: createHash("sha256").update(continuation).digest("hex"),
			description: "Extend the silhouette behind accepted opaque artwork.",
		};
		await writeFile(join(study, "presentation.json"), JSON.stringify(recipe));
		await execute(process.execPath, [tool, study, "02"]);
		const completed = await sharp(
			join(study, "finishing/02/exports/fixture-transparent-256.png"),
		)
			.ensureAlpha()
			.raw()
			.toBuffer();
		const completedPixel = (x: number, y: number) => [
			...completed.subarray((y * 256 + x) * 4, (y * 256 + x) * 4 + 4),
		];
		expect(completedPixel(40, 150)).toEqual([96, 80, 64, 255]);
		expect(completedPixel(70, 130)).toEqual(pixel(70, 130));
		expect(completedPixel(130, 195)).toEqual(pixel(130, 195));
		expect(completedPixel(10, 10)[3]).toBe(0);
		recipe.framing.continuation.sha256 = "0".repeat(64);
		await writeFile(join(study, "presentation.json"), JSON.stringify(recipe));
		await expect(
			execute(process.execPath, [tool, study, "03"]),
		).rejects.toThrow("Edge continuation differs from its recorded hash.");
	} finally {
		await rm(study, { recursive: true, force: true });
	}
});
