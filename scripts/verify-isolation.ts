import { readFile } from "node:fs/promises";
import { assertLocalIsolation } from "./isolation";

const config = JSON.parse(await readFile("wrangler.jsonc", "utf8"));
assertLocalIsolation(config);
console.info(
	"Isolation: local SQLite D1, separate persistence directories, no production bindings or live probes.",
);
