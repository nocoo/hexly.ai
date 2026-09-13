import { downloadAsset } from "./components/download-asset";
import storage from "./data/media-storage.json" with { type: "json" };
import { assetUrl } from "./model/assets";

// Browser-only enhancement; the archived HTML/JS and raw HTTP bytes stay untouched.
document.addEventListener("click", async (event) => {
	const link =
		event.target instanceof Element
			? event.target.closest("a[download]")
			: null;
	if (
		!(link instanceof HTMLAnchorElement) ||
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	)
		return;
	const original = new URL(link.href);
	const url = assetUrl(
		original.origin === location.origin
			? `${original.pathname}${original.search}`
			: original.href,
	);
	if (!url.startsWith(`${storage.origin}/`)) return;
	event.preventDefault();
	if (link.getAttribute("aria-busy") === "true") return;
	link.setAttribute("aria-busy", "true");
	try {
		await downloadAsset(url, link.download);
	} catch (error) {
		console.error("Asset download failed", error);
		const message = document.createElement("span");
		message.setAttribute("role", "status");
		message.textContent = document.documentElement.lang.startsWith("zh")
			? "下载失败，请重试。"
			: "Download failed. Please retry.";
		link.after(message);
	} finally {
		link.removeAttribute("aria-busy");
	}
});
