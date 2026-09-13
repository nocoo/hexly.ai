/** Fetch before download so CDN delivery preserves the requested filename. */
export async function downloadAsset(url: string, filename?: string) {
	const resource = new URL(url);
	// Keep explicit downloads separate from Chromium's reserved favicon request.
	resource.searchParams.set("download", "1");
	const response = await fetch(resource, {
		signal: AbortSignal.timeout(120_000),
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const objectUrl = URL.createObjectURL(await response.blob());
	const anchor = document.createElement("a");
	anchor.href = objectUrl;
	anchor.download = filename || resource.pathname.split("/").pop() || "asset";
	anchor.hidden = true;
	document.body.append(anchor);
	anchor.click();
	anchor.remove();
	window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}
