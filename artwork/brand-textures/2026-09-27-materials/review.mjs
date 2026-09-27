import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const batch = JSON.parse(
	await readFile(
		"docs/brand-textures/2026-09-27-materials/inventory.json",
		"utf8",
	),
);
const directory = ".video-work/material-textures";
const revision = JSON.parse(
	await readFile(
		"docs/brand-textures/2026-09-27-materials/prompt-revision.json",
		"utf8",
	),
);
await mkdir(directory, { recursive: true });
const escapeHtml = (value) =>
	String(value).replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			],
	);
const candidates = [];
const cards = [];
for (const row of batch.projects) {
	const motif =
		row.id === "dogfight" ? revision.dogfightRevisedMotif : row.design.motif;
	const project = JSON.parse(
		await readFile(`src/data/projects/${row.id}.json`, "utf8"),
	);
	const figures = [];
	for (const theme of ["light", "dark"]) {
		const runs = (await readdir(row.study))
			.filter((name) => name === theme || name.startsWith(`${theme}-attempt-`))
			.sort()
			.reverse();
		let selected;
		for (const name of runs) {
			const run = `${row.study}/${name}`;
			if (
				!existsSync(`${run}/raw.png`) ||
				!existsSync(`${run}/raw-review.json`)
			)
				continue;
			const review = JSON.parse(
				await readFile(`${run}/raw-review.json`, "utf8"),
			);
			if (review.status === "rejected") continue;
			const bytes = await readFile(`${run}/raw.png`);
			const hash = createHash("sha256").update(bytes).digest("hex");
			if (hash !== review.imageSha256)
				throw new Error(`Raw hash mismatch: ${run}`);
			selected = {
				id: row.id,
				title: row.title,
				theme,
				run,
				sha256: hash,
				status: review.status,
				agentAssessment: review.agentAssessment ?? null,
			};
			await sharp(bytes)
				.jpeg({ quality: 80 })
				.toFile(`${directory}/${row.id}-${theme}-inspection.jpg`);
			break;
		}
		if (selected) {
			candidates.push(selected);
			figures.push(
				`<figure class="${theme}"><a href="/${selected.run}/raw.png" target="_blank"><img src="/${selected.run}/raw.png" width="1024" height="1024" loading="lazy" alt="${escapeHtml(row.title)} ${theme} texture"></a><figcaption><span>${theme === "light" ? "Paper" : "Night"}</span><a href="/${selected.run}/raw.png" download="${row.id}-${theme}.png">Original PNG ↗</a></figcaption></figure>`,
			);
		} else
			figures.push(
				`<figure class="${theme} waiting"><div>Awaiting candidate</div><figcaption>${theme === "light" ? "Paper" : "Night"}</figcaption></figure>`,
			);
	}
	cards.push(
		`<article id="${row.id}"><header><img src="${project.family.foreground.display}" width="60" height="60" alt=""><div><h2>${escapeHtml(row.title)}</h2><p>${escapeHtml(row.design.name.en)}</p></div></header><div class="pair">${figures.join("")}</div><p class="brief">${escapeHtml(motif)}</p></article>`,
	);
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Material texture review · Hexly</title><style>
:root{color-scheme:light;--paper:#f0f0e9;--surface:#f8f8f2;--ink:#30372e;--muted:#68705f;--line:#d4d8cb;--dark:#1e2824;--dark-ink:#e6e9dc;--accent:#bf5c3c;font:15px/1.5 system-ui,sans-serif;color:var(--ink);background:var(--paper)}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:1400px;margin:auto}h1{font-size:28px;margin:0}h2{font-size:19px;margin:0}p{margin:4px 0}a{color:inherit;text-underline-offset:3px}a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.intro{margin-bottom:20px}.intro p{color:var(--muted)}nav{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:14px;font-size:13px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}article{scroll-margin-top:20px}article>header{display:flex;align-items:center;gap:12px;margin-bottom:10px}header img{object-fit:contain}header p{font-size:13px;color:var(--muted)}.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}figure{margin:0;overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--surface)}figure img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}figcaption{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;font-size:12px;border-top:1px solid var(--line)}.dark{background:var(--dark);color:var(--dark-ink);border-color:#3d4940}.dark figcaption{border-color:#3d4940}.brief{font-size:13px;color:var(--muted);margin:10px 0 0}.waiting>div{aspect-ratio:1;display:grid;place-items:center;opacity:.65}.reference{display:flex;align-items:center;gap:14px;padding:14px 0 20px}.reference img{width:112px;height:112px;object-fit:contain;border-radius:8px}.reference p{max-width:440px;font-size:13px}.reference strong{display:block;margin-bottom:4px}@media(max-width:760px){body{padding:16px}.grid{grid-template-columns:1fr;gap:26px}.pair{grid-template-columns:1fr}.reference{flex-wrap:wrap}.reference p{flex-basis:100%}}@media(max-width:380px){figcaption{font-size:11px;padding:8px 6px}.pair{gap:8px}}
</style></head><body><main><div class="intro"><h1>Material texture studies</h1><p>${candidates.length} / 42 candidates · 21 projects · awaiting your review</p><nav>${batch.projects.map((row) => `<a href="#${row.id}">${escapeHtml(row.title)}</a>`).join("")}</nav></div><section class="reference" aria-label="Botanical series references"><img src="/textures/frogie/v1.0.0/texture-light.webp" alt="Accepted botanical paper reference"><img src="/textures/raven/v1.0.1/texture-dark.webp" alt="Accepted botanical night reference"><p><strong>Series reference</strong>Match the paper palette, shallow relief, generous quiet field and right-hand coverage. Each material study uses traces related to its existing icon. Icon background replacement follows your texture review.</p></section><div class="grid">${cards.join("")}</div></main></body></html>`;
await writeFile(`${directory}/review.html`, html);
await writeFile(
	"docs/brand-textures/2026-09-27-materials/candidates.json",
	`${JSON.stringify({ ownerAcceptance: "pending", candidates }, null, "\t")}\n`,
);
console.log(
	`Prepared local review: ${candidates.length}/42 candidates at /.video-work/material-textures/review.html`,
);
