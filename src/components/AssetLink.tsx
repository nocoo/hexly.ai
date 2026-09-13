import { type AnchorHTMLAttributes, useState } from "react";
import { assetUrl } from "../model/assets";
import { downloadAsset } from "./download-asset";

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
						await downloadAsset(
							url,
							typeof download === "string" ? download : undefined,
						);
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
