import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const styles = readdirSync("src/styles")
	.filter((name) => name.endsWith(".css"))
	.map((name) => join("src/styles", name));

const artworkSpacing = new Map([
	["src/styles/base.css", new Set([".brand-grid"])],
	["src/styles/directory.css", new Set([".hero-art"])],
]);

test("keeps application spacing on the four-pixel grid, apart from preserved artwork placement", () => {
	const problems: string[] = [];
	for (const path of styles) {
		const css = readFileSync(path, "utf8");
		for (const match of css.matchAll(
			/^\s*((?:margin|padding)(?:-[a-z]+)?|(?:row-|column-)?gap)\s*:\s*([^;]+);/gm,
		)) {
			const opening = css.lastIndexOf("{", match.index);
			const previous = Math.max(
				css.lastIndexOf("}", opening - 1),
				css.lastIndexOf("{", opening - 1),
			);
			const selector = css.slice(previous + 1, opening).trim();
			if (artworkSpacing.get(path)?.has(selector)) continue;
			for (const value of match[2]?.matchAll(/(-?\d+(?:\.\d+)?)px/g) ?? []) {
				const pixels = Number(value[1]);
				if (Math.abs(pixels) <= 2 || pixels % 4 === 0) continue;
				problems.push(`${path}: ${selector}: ${match[1]}: ${pixels}px`);
			}
		}
	}
	expect(problems).toEqual([]);
});

test("keeps material-control text readable on every idle and selected surface", () => {
	const css = readFileSync("src/styles/tokens.css", "utf8");
	const luminance = (hex: string) => {
		const channels = [0, 2, 4].map((at) => {
			const value = Number.parseInt(hex.slice(at, at + 2), 16) / 255;
			return value <= 0.04045
				? value / 12.92
				: ((value + 0.055) / 1.055) ** 2.4;
		});
		return (
			(channels[0] ?? 0) * 0.2126 +
			(channels[1] ?? 0) * 0.7152 +
			(channels[2] ?? 0) * 0.0722
		);
	};
	const base = readFileSync("src/styles/base.css", "utf8");
	const palettes = [
		...base.matchAll(/:root(?:\[data-theme="dark"\])?\s*\{([^}]+)\}/g),
	]
		.map((block) => block[1] ?? "")
		.filter((body) => body.includes("--page:"));
	expect(palettes).toHaveLength(2);
	for (const body of palettes) {
		const value = (role: string) => {
			const reference = new RegExp(
				`--control-${role}:\\s*var\\((--[a-z-]+)\\)`,
			).exec(css)?.[1];
			if (!reference)
				throw new Error(`Control must reuse a site color: ${role}`);
			const color = new RegExp(`${reference}:\\s*#([a-f0-9]{6})`).exec(
				body,
			)?.[1];
			if (!color) throw new Error(`Missing site color: ${reference}`);
			return luminance(color);
		};
		value("edge");
		value("icon-ink");
		for (const foreground of ["ink", "muted", "selected-ink"]) {
			for (const background of ["face", "well", "hover", "selected"]) {
				const levels = [value(foreground), value(background)].toSorted(
					(a, b) => a - b,
				);
				expect(
					((levels[1] ?? 0) + 0.05) / ((levels[0] ?? 0) + 0.05),
					`${foreground} on ${background}`,
				).toBeGreaterThanOrEqual(4.5);
			}
		}
	}
});

test("defines nested controls and shared shell dimensions in one token source", () => {
	const css = readFileSync("src/styles/tokens.css", "utf8");
	const pixels = (name: string) =>
		Number(new RegExp(`${name}:\\s*(\\d+)px`).exec(css)?.[1]);
	expect(pixels("--radius-group")).toBe(
		pixels("--radius-control") + pixels("--space-4"),
	);
	expect(pixels("--control-height")).toBe(
		pixels("--control-item-height") + 2 * pixels("--space-4"),
	);
	expect(pixels("--control-item-height")).toBe(
		pixels("--control-line-height") + 2 * pixels("--space-8"),
	);
	expect(css).toContain("--brand-gap: var(--space-4)");
	for (const path of styles.filter((path) => !path.endsWith("tokens.css"))) {
		expect(readFileSync(path, "utf8")).not.toMatch(
			/--site-(?:gutter|layout-max|topbar-height|subheader-height)\s*:/,
		);
	}
});
