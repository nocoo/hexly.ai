import { readFile } from "node:fs/promises";
import { assertStaticIsolation } from "./isolation";

const config = JSON.parse(await readFile("wrangler.jsonc", "utf8"));
assertStaticIsolation(config);
console.info(
	"D1: static assets only; isolated loopback servers; no production bindings.",
);
