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
	} finally {
		await rm(study, { recursive: true, force: true });
	}
});
