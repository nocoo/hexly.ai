import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import { expect, test } from "vitest";

test.each(["png", "jpg"])(
	"preserves native generated %s bytes in the public archive",
	async (format) => {
		const root = await mkdtemp(join(tmpdir(), "hexly-generated-archive-"));
		const study = "artwork/logo-family/fixture/2026-10-18-01";
		const archive = "/logos/family/fixture/2026-10-18-01/01";
		const write = async (path: string, data: string | Buffer) => {
			await mkdir(resolve(root, path, ".."), { recursive: true });
			await writeFile(join(root, path), data);
		};
		try {
			const png = await sharp({
				create: { width: 32, height: 32, channels: 4, background: "#123456" },
			})
				.png()
				.toBuffer();
			const raw = format === "jpg" ? await sharp(png).jpeg().toBuffer() : png;
			await write("src/data/projects/index.json", '["fixture"]');
			await write(
				"src/data/projects/fixture.json",
				JSON.stringify({
					id: "fixture",
					logo: {
						original: "/logos/originals/fixture.png",
						display: "/logos/display/fixture-1024.webp",
					},
					family: {
						root: archive,
						finishing: "01",
						status: "review",
						foreground: { width: 32 },
						...(format === "jpg" ? { rawFile: "raw.jpg" } : {}),
					},
				}),
			);
			await write("public/logos/originals/fixture.png", png);
			await write(`${study}/raw/generated.${format}`, raw);
			await write(
				`${study}/presentation.json`,
				JSON.stringify(
					format === "jpg" ? { sourceRecord: "generation-source.json" } : {},
				),
			);
			await write(
				`${study}/response.json`,
				JSON.stringify(
					format === "jpg"
						? { savedFile: "raw/generated.jpg", model: null }
						: { output: { path: "raw/generated.png" } },
				),
			);
			if (format === "jpg")
				await write(
					`${study}/generation-source.json`,
					JSON.stringify({
						status: "succeeded",
						output: { path: "raw/generated.jpg" },
						originalReceipt: "response.json",
						model: null,
					}),
				);
			await write(`${study}/prompt.txt`, "Exact fixture prompt");
			for (const role of ["transparent", "icon", "rounded", "white"])
				await write(
					`${study}/finishing/01/exports/fixture-${role}-32.png`,
					png,
				);
			await write(`${study}/finishing/01/background.png`, png);
			await promisify(execFile)(
				"bun",
				[resolve("scripts/generate-assets.ts")],
				{ cwd: root },
			);
			expect(await readFile(`${root}/public${archive}/raw.${format}`)).toEqual(
				raw,
			);
			const manifest = JSON.parse(
				await readFile(`${root}/public${archive}/manifest.json`, "utf8"),
			);
			expect(manifest.files).toContainEqual(
				expect.objectContaining({
					path: `${archive}/raw.${format}`,
					bytes: raw.length,
				}),
			);
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	},
	15_000,
);
