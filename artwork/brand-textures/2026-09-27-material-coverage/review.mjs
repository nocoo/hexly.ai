import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const base = "docs/brand-textures/2026-09-27-material-coverage";
const directory = ".video-work/material-coverage";
const batch = JSON.parse(await readFile(`${base}/inventory.json`, "utf8"));
await mkdir(directory, { recursive: true });
const escapeHtml = (value) =>
	String(value).replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const candidates = [];
const figure = (run, title, id, theme) =>
	`<figure class="${theme}"><figcaption>${title}<a href="/${run}/raw.png" download="${id}-${theme}.png">Original PNG ↗</a></figcaption><a href="/${run}/raw.png" target="_blank"><img src="/${run}/raw.png" width="1024" height="1024" alt="${escapeHtml(id)} ${theme} ${title}" loading="lazy"></a></figure>`;
const articles = [];
for (const row of batch.projects) {
	const project = JSON.parse(
		await readFile(`src/data/projects/${row.id}.json`, "utf8"),
	);
	const comparisons = [];
	for (const theme of ["light", "dark"]) {
		const before = row.previousCandidates[theme];
		if (hash(await readFile(`${before.run}/raw.png`)) !== before.sha256)
			throw new Error(`Changed prior original: ${row.id}/${theme}`);
		let proposed = `<figure class="${theme} waiting"><figcaption>New · ${theme}</figcaption><div>Generating candidate</div></figure>`;
		const runs = (await readdir(row.study))
			.filter((name) => name === theme || name.startsWith(`${theme}-attempt-`))
			.sort()
			.reverse();
		for (const name of runs) {
			const run = `${row.study}/${name}`;
			if (!existsSync(`${run}/raw-review.json`)) continue;
			const review = JSON.parse(
				await readFile(`${run}/raw-review.json`, "utf8"),
			);
			const bytes = await readFile(`${run}/raw.png`);
			const digest = hash(bytes);
			if (digest !== review.imageSha256)
				throw new Error(`Changed candidate: ${run}`);
			if (review.status !== "rejected") {
				candidates.push({
					id: row.id,
					theme,
					run,
					sha256: digest,
					status: review.status,
					agentAssessment: review.agentAssessment ?? null,
					before,
				});
				await sharp(bytes)
					.jpeg({ quality: 78 })
					.toFile(`${directory}/${row.id}-${theme}-inspection.jpg`);
				proposed = figure(run, `New · ${theme}`, row.id, theme);
				break;
			}
		}
		comparisons.push(
			`<div class="comparison" data-theme="${theme}">${figure(before.run, `Previous · ${theme}`, row.id, theme)}${proposed}</div>`,
		);
	}
	articles.push(
		`<article id="${row.id}"><header><img src="${project.family.foreground.display}" width="64" height="64" alt=""><div><h2>${escapeHtml(row.title)}</h2><p>${escapeHtml(row.experiment.name)}</p></div></header>${comparisons.join("")}</article>`,
	);
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Full-square texture experiment · Hexly</title><style>
:root{color-scheme:light;--paper:#f0f0e9;--surface:#f8f8f2;--ink:#30372e;--muted:#68705f;--line:#d4d8cb;--night:#1e2824;--night-ink:#e6e9dc;--night-line:#3d4940;--accent:#bf5c3c;font:15px/1.5 system-ui,sans-serif;color:var(--ink);background:var(--paper)}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1100px;margin:auto}h1{font-size:28px;margin:0}h2{font-size:22px;margin:0}p{margin:4px 0;color:var(--muted)}a{color:inherit;text-underline-offset:3px}a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}nav{display:flex;flex-wrap:wrap;gap:8px 20px;margin:12px 0}.references{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px 0 24px}.references img{display:block;width:116px;height:116px}.references p{max-width:560px;font-size:13px}article{scroll-margin-top:16px;margin-bottom:32px}header{display:flex;align-items:center;gap:12px;margin-bottom:12px}header img{object-fit:contain}.comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}figure{margin:0;border:1px solid var(--line);background:var(--surface)}figure img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}figcaption{display:flex;justify-content:space-between;gap:8px;padding:10px 12px;font-size:13px;border-bottom:1px solid var(--line)}.dark{background:var(--night);color:var(--night-ink);border-color:var(--night-line)}.dark figcaption{border-color:var(--night-line)}.waiting>div{aspect-ratio:1;display:grid;place-items:center}footer{font-size:13px;margin:20px 0}@media(max-width:680px){body{padding:16px}.comparison{grid-template-columns:1fr;gap:12px}h1{font-size:24px}}
</style></head><body><main><h1>Full-square texture experiment</h1><p>${candidates.length} / 6 candidates · 3 projects · awaiting your review</p><p>Compare coverage across the entire square. Each pair uses the same display size.</p><nav>${batch.projects.map((row) => `<a href="#${row.id}">${escapeHtml(row.title)}</a>`).join("")}</nav><section class="references" aria-label="Botanical references"><a href="${batch.references.light}" target="_blank"><img src="${batch.references.light}" alt="Botanical paper reference"></a><a href="${batch.references.dark}" target="_blank"><img src="${batch.references.dark}" alt="Botanical night reference"></a><p>Paper palette, fine surface detail and shallow-relief references. The new experiment distributes material texture through all four quadrants, with small breathing spaces throughout. Wider rollout follows your confirmation.</p></section>${articles.join("")}<footer><a href="/.video-work/material-textures/review.html">Previous 21-project batch ↗</a></footer></main></body></html>`;
await writeFile(`${directory}/review.html`, html);
await writeFile(
	`${base}/candidates.json`,
	`${JSON.stringify({ ownerAcceptance: "pending", candidates }, null, "\t")}\n`,
);
console.log(`Prepared coverage review: ${candidates.length}/6 candidates.`);
