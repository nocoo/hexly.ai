import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const directory = "artwork/brand-textures/2026-10-18";
const batch = JSON.parse(
	await readFile("docs/brand-textures/2026-10-18/inventory.json", "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const escapeHtml = (text) =>
	text.replace(
		/[&<>"']/g,
		(char) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				char
			],
	);
const sections = [];
const files = [];
for (const row of batch.projects) {
	const isNew = row.action === "generate";
	const project = JSON.parse(
		await readFile(`src/data/projects/${row.id}.json`, "utf8"),
	);
	assert.equal(
		hash(await readFile(`public${row.officialProjectIdentity.path}`)),
		row.officialProjectIdentity.sha256,
	);
	const panels = [];
	for (const theme of ["light", "dark"]) {
		const file = isNew
			? `${row.study}/${theme}/raw.png`
			: `public${row.existingTexture.root}/texture-${theme}.png`;
		const prompt = isNew
			? `${row.study}/${theme}/prompt.txt`
			: `public${row.existingTexture.root}/texture-${theme}-prompt.txt`;
		const approvalPath = isNew
			? `${row.study}/${theme}/raw-review.json`
			: `public${row.existingTexture.root}/source-${theme}-raw-review.json`;
		const approval = JSON.parse(await readFile(approvalPath, "utf8"));
		const bytes = await readFile(file);
		const sha256 = hash(bytes);
		const metadata = await sharp(bytes).metadata();
		assert.equal(metadata.width, 1024);
		assert.equal(metadata.height, 1024);
		assert.equal(approval.imageSha256, sha256);
		if (isNew) {
			const response = JSON.parse(
				await readFile(`${row.study}/${theme}/response.json`, "utf8"),
			);
			assert.equal(response.status, "succeeded");
			assert.equal(response.outputs.length, 1);
			assert.equal(response.outputs[0].sha256, sha256);
			assert.equal(approval.ownerReviewedExactBytes, true);
			assert.equal(approval.status, "approved");
		} else {
			assert.equal(approval.status, "approved");
			assert.equal(approval.ownerReviewedExactBytes, true);
		}
		files.push({
			project: row.id,
			theme,
			file,
			bytes: bytes.length,
			sha256,
			approval: approvalPath,
			status: approval.status,
		});
		panels.push(
			`<article class="${theme}"><div class="panel-heading"><h3>${theme === "light" ? "Light / 明" : "Dark / 暗"}</h3><span>1024 × 1024 · native PNG</span></div><a class="native" href="/${file}" target="_blank" rel="noopener"><img src="/${file}" width="1024" height="1024" alt="${escapeHtml(row.title)} ${theme} untouched full texture canvas"></a><div class="links"><a href="/${file}" download>Original PNG ↓</a><a href="/${prompt}" target="_blank" rel="noopener">Exact prompt ↗</a><a href="/${approvalPath}" target="_blank" rel="noopener">Review receipt ↗</a></div><code>${sha256}</code><details><summary>280 CSS px · complete-canvas specimen</summary><img class="actual" src="/${file}" width="280" height="280" alt="${escapeHtml(row.title)} ${theme} at actual 280 CSS pixels"></details></article>`,
		);
	}
	const design = isNew ? row.design : row.existingTexture;
	const status = isNew ? "NEW / 已批准原图" : "REUSE / 已批准原图";
	const note = isNew
		? "Exact native bytes approved by the owner on 2026-10-18; local adoption authorized."
		: "Existing owner-approved texture reused without generation.";
	sections.push(
		`<section id="${row.id}" data-project="${row.id}"><header class="project"><img src="/public${project.family.foreground.original}" width="64" height="64" alt="${escapeHtml(row.title)} unchanged approved identity"><div><p class="eyebrow">${status}</p><h2>${escapeHtml(row.title)} <span>${escapeHtml(design.name.en)} / ${escapeHtml(design.name.zh)}</span></h2></div></header><p>${escapeHtml(design.description.en)}<br><span lang="zh">${escapeHtml(design.description.zh)}</span></p><p class="note">${escapeHtml(note)}</p><div class="pair">${panels.join("")}</div></section>`,
	);
}
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Eight texture checkpoints · Hexly</title><style>
@font-face{font-family:Space;src:url('/fonts/space-grotesk.woff2') format('woff2');font-weight:100 900;font-display:swap}
:root{color-scheme:light;--page:#f0f0e9;--surface:#f8f8f2;--ink:#30372e;--line:#d4d8cb;--accent:#bf5c3c}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:80px}body{margin:0;color:var(--ink);background:var(--page);font-family:Space,"PingFang SC",sans-serif;line-height:1.6}main{max-width:1360px;margin:auto;padding:24px clamp(16px,3vw,40px) 64px}a{color:inherit;text-underline-offset:4px}a:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.eyebrow{font-size:12px;letter-spacing:.1em;margin:0;color:var(--accent)}h1{font-size:clamp(30px,4vw,56px);line-height:1.15;letter-spacing:-.04em;margin:16px 0}h2{font-size:24px;line-height:1.4;margin:0}h2 span{display:block;font-size:14px;font-weight:400;letter-spacing:0}h3{font-size:16px;margin:0}.lede{max-width:900px}nav{display:flex;flex-wrap:wrap;gap:8px 20px;padding:16px 0;border-bottom:1px solid var(--line);font-size:14px}section{padding-top:40px}.project{display:flex;gap:16px;align-items:center}.project img{object-fit:contain;flex:none}.note{font-size:13px;padding:10px 14px;border-left:3px solid var(--accent);background:var(--surface)}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}article{min-width:0;padding:16px;border:1px solid var(--line);background:var(--surface);border-radius:16px}.dark{background:#27332c;color:#e6e9dc;border-color:#3d4940}.panel-heading{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:14px}.panel-heading span{font-size:12px}.native img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}.links{display:flex;gap:10px 18px;flex-wrap:wrap;margin:16px 0 8px;font-size:13px}code{display:block;overflow-wrap:anywhere;font-size:12px;line-height:1.6}details{margin-top:14px;font-size:13px}summary{cursor:pointer}.actual{display:block;max-width:100%;height:auto;margin-top:12px}footer{border-top:1px solid var(--line);margin-top:48px;padding-top:20px;font-size:13px}@media(max-width:700px){.pair{grid-template-columns:1fr}section{padding-top:28px}article{padding:12px}h2{font-size:21px}.project{gap:12px}.project img{width:52px;height:52px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style></head><body><main><p class="eyebrow">HEXLY / CAMPAIGN SURFACES / 2026-10-18</p><h1>Eight projects.<br>Six new surface pairs.</h1><p class="lede" lang="zh">6 个项目新增明暗原图；Zoo、Sleepy 复用已批准的底纹。原图已批准并接入本地站点，尚未发布线上。Logo 本体、历史图片和源项目均未改动。点击大图查看完整 1024 原图；展开下方可看 280px 实际尺寸。</p><p class="lede">GPT Image 2.5 Flare · untouched native PNGs · full canvas, no crop or repeat. Native images approved for local adoption; no upload or release.</p><nav aria-label="Project checkpoints">${batch.projects.map((row) => `<a href="#${row.id}">${escapeHtml(row.title)}</a>`).join("")}</nav>${sections.join("\n")}<footer><a href="/docs/brand-textures/2026-10-18/inventory.json">Scope &amp; identity hashes</a> · <a href="/projects/sleepy#texture">Sleepy existing texture archive</a> · <a href="/projects/zoo#texture">Zoo existing texture archive</a><p>Local-only review. Approval of artwork and authorization to publish are separate decisions.</p></footer></main></body></html>\n`;
await writeFile(`${directory}/raw-review.html`, html);
await writeFile(
	"docs/brand-textures/2026-10-18/raw-files.json",
	`${JSON.stringify({ schemaVersion: 1, review: `${directory}/raw-review.html`, reviewSha256: hash(html), files }, null, "\t")}\n`,
);
console.log(
	`Verified ${files.length} native canvases; wrote local-only raw checkpoint.`,
);
