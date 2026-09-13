import { createContext, useContext, useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";
import { brandAssetVersion } from "./brand";

export const HexlyFontOrigin = createContext<string | undefined>(undefined);
const fonts = new Map<string, Promise<void>>();
export function loadHexlyFonts(origin?: string) {
	const key = origin ?? "local";
	const existing = fonts.get(key);
	if (existing) return existing;
	const ready = Promise.all(
		[
			["Space Grotesk Variable", "space-grotesk.woff2"],
			["Geist Mono Variable", "geist-mono.woff2"],
			["Journey CJK", "journey-cjk.woff2"],
		].map(async ([family, file]) => {
			const face = new FontFace(
				family ?? "",
				`url(${origin ? `${origin}/video-kit/${brandAssetVersion}/hexly/${file}` : staticFile(`video-kit/${brandAssetVersion}/hexly/${file}`)})`,
				{ weight: "100 900" },
			);
			document.fonts.add(await face.load());
		}),
	)
		.then(() => undefined)
		.catch((error: unknown) => {
			fonts.delete(key);
			throw error;
		});
	fonts.set(key, ready);
	return ready;
}

export function useHexlyFonts() {
	const origin = useContext(HexlyFontOrigin);
	const { delayRender, continueRender, cancelRender } = useDelayRender();
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const handle = delayRender("Load the licensed Hexly fonts");
		let active = true;
		loadHexlyFonts(origin)
			.then(() => {
				if (active) setReady(true);
				continueRender(handle);
			})
			.catch((error: unknown) => {
				if (active) cancelRender(error);
			});
		return () => {
			active = false;
			continueRender(handle);
		};
	}, [delayRender, continueRender, cancelRender, origin]);
	return ready;
}
