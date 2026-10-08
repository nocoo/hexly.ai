import type { Page } from "@playwright/test";
import axe from "axe-core";
import { expect } from "./fixtures";

export async function scanAccessibility(page: Page, selector = "body") {
	expect(page.frames()).toHaveLength(1);
	await page.evaluate(axe.source);
	return page.evaluate(
		(selector) => (window as unknown as { axe: typeof axe }).axe.run(selector),
		selector,
	);
}
