import { type AnchorHTMLAttributes, useState } from "react";
import { assetUrl } from "../model/assets";

/** Cross-origin download attributes alone do not download: fetch the approved CDN bytes. */
export function AssetLink({
	href = "",
	download,
	onClick,
	children,
	...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
	const [busy, setBusy] = useState(false);
	const [failed, setFailed] = useState(false);
	const url = assetUrl(href);
	return (
		<>
			<a
				{...props}
				href={url}
				download={download}
				aria-busy={busy || undefined}
				onClick={async (event) => {
					onClick?.(event);
					if (
						event.defaultPrevented ||
						download === undefined ||
						download === false ||
						!url.startsWith("https://") ||
						new URL(url).origin === location.origin ||
						event.button !== 0 ||
						event.metaKey ||
						event.ctrlKey ||
						event.shiftKey ||
						event.altKey
					)
						return;
					event.preventDefault();
					if (busy) return;
					setBusy(true);
					setFailed(false);
					try {
						// Explicit downloads must not be mistaken for Chromium's reserved favicon request.
						const resource = new URL(url);
						resource.searchParams.set("download", "1");
						const response = await fetch(resource, {
							signal: AbortSignal.timeout(120_000),
						});
						if (!response.ok) throw new Error(`HTTP ${response.status}`);
						const objectUrl = URL.createObjectURL(await response.blob());
						const anchor = document.createElement("a");
						anchor.href = objectUrl;
						anchor.download =
							typeof download === "string" && download
								? download
								: (new URL(url).pathname.split("/").pop() ?? "asset");
						anchor.click();
						window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
					} catch (error) {
						console.error("Asset download failed", error);
						setFailed(true);
					} finally {
						setBusy(false);
					}
				}}
			>
				{children}
			</a>
			{failed && (
				<span role="status">
					{document.documentElement.lang.startsWith("zh")
						? "下载失败，可打开原文件重试。"
						: "Download failed. Open the file to retry."}{" "}
					<a href={url} target="_blank" rel="noreferrer">
						↗
					</a>
				</span>
			)}
		</>
	);
}
