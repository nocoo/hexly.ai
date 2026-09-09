import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { readProjects } from "../../../../src/data/read-projects";
import { filterProjects } from "../../../../src/model/catalogue";

// Run from the repository root after the matching Deploy job succeeds.
const revision = process.argv[2];
assert.match(revision ?? "", /^[a-f0-9]{40}$/);
const origin = "https://hexly.ai";
const started = new Date().toISOString();
const sha256 = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");

async function get(path: string) {
  const response = await fetch(new URL(path, origin), {
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, path);
  return response;
}

const live = await (await get(`/api/live?revision=${revision}`)).json();
assert.equal(live.revision, revision);
assert.equal(live.version, "0.5.0");
assert.equal(live.status, "ok");
const projects = await (await get("/data/projects.json")).json();
assert.deepEqual(projects, readProjects());
const project = projects.find((item: { id: string }) => item.id === "infospace");
assert.equal(project.family.status, "adopted");
assert.equal(project.source.repositoryRevision, "82f629ed42b6ec89dac0e0c79e2a63dec88ecacf");
assert.equal(project.logo.sha256, "3b2e9aaead0eddccf8bf2212fe96f5ed207a06dc6111f72a829dd2db0a656772");
assert.equal(project.overview.techStack.length, 7);
const ordered = filterProjects(projects, "", "all").map((item) => item.id);
const position = ordered.indexOf("infospace");
const neighbors = ordered.slice(position - 1, position + 2);
assert.deepEqual(neighbors, ["dreamro", "infospace", "signoff-now"]);

const htmlResponse = await get("/logos/infospace");
assert.match(htmlResponse.headers.get("content-type") ?? "", /text\/html/);
const html = await htmlResponse.text();
assert.ok(html.includes('href="https://hexly.ai/logos/infospace"'));
assert.ok(html.includes("https://hexly.ai/og/infospace.jpg"));

const manifestPath = `${project.family.root}/manifest.json`;
const manifest = JSON.parse(readFileSync(`public${manifestPath}`, "utf8"));
const paths: string[] = [
  project.logo.original,
  project.family.previous.original,
  manifestPath,
  ...manifest.files.map((file: { path: string }) => file.path),
  ...[32, 64, 160, 256, 512, 1024].map((size) => `/logos/display/infospace-${size}.webp`),
  "/og/infospace.jpg",
];
const assets = [];
for (let offset = 0; offset < paths.length; offset += 4) {
  const batch = await Promise.all(paths.slice(offset, offset + 4).map(async (path) => {
    const response = await get(path);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const expected = readFileSync(`public${path}`);
    assert.equal(sha256(bytes), sha256(expected), path);
    return { path, status: response.status, contentType: response.headers.get("content-type"), bytes: bytes.length, sha256: sha256(bytes), matchesArchive: true };
  }));
  assets.push(...batch);
}

const sourceURL = `https://raw.githubusercontent.com/nocoo/infospace/${project.source.repositoryRevision}/logo.png`;
const sourceBytes = new Uint8Array(await (await get(sourceURL)).arrayBuffer());
assert.equal(sha256(sourceBytes), project.logo.sha256);
const report = {
  started,
  finished: new Date().toISOString(),
  origin,
  revision,
  passed: true,
  live,
  project: { id: project.id, status: project.family.status, sourceRevision: project.source.repositoryRevision, sourceSha256: project.logo.sha256, techStackBadges: project.overview.techStack.length },
  catalogue: { total: projects.length, active: ordered.length, matchesCheckout: true, neighbors },
  page: { path: "/logos/infospace", status: 200, canonicalAndSocialImage: true },
  assets,
  source: { url: sourceURL, bytes: sourceBytes.length, sha256: sha256(sourceBytes), matchesArchive: true },
};
writeFileSync(new URL("./report.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.info(`Verified ${origin}/logos/infospace at ${revision}: adopted metadata, catalogue order, ${assets.length} exact assets and published InfoSpace source.`);
