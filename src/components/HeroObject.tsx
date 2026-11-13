import { useEffect, useRef, useState } from "react";
import { copy } from "../data/copy";
import { type HeroObjectKind, shouldAnimateHero } from "../model/hero-object";
import type { Locale } from "../model/project";
import type { createHeroRenderer, HeroRenderer } from "./hero-three-renderer";
import { Icon } from "./Icon";
import "../styles/hero-object.css";

export function HeroObject({
	kind,
	locale,
}: {
	kind: HeroObjectKind;
	locale: Locale;
}) {
	const root = useRef<HTMLDivElement>(null);
	const stage = useRef<HTMLDivElement>(null);
	const pausedRef = useRef(false);
	const refresh = useRef<() => void>(() => {});
	const [paused, setPaused] = useState(false);
	const [canMove, setCanMove] = useState(false);
	const t = copy[locale];

	useEffect(() => {
		pausedRef.current = paused;
		refresh.current();
	}, [paused]);

	useEffect(() => {
		const element = root.current;
		const host = stage.current;
		if (!element || !host) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		let disposed = false;
		let intersecting = false;
		let requested = false;
		let factory: typeof createHeroRenderer | undefined;
		let renderer: HeroRenderer | undefined;
		let measuredWidth = 0;
		let measuredHeight = 0;
		const resize = () => {
			if (!renderer || !intersecting || document.hidden) return;
			const bounds = host.getBoundingClientRect();
			if (bounds.width === measuredWidth && bounds.height === measuredHeight)
				return;
			measuredWidth = bounds.width;
			measuredHeight = bounds.height;
			renderer.resize(bounds.width, bounds.height);
		};
		const lost = (event: Event) => {
			event.preventDefault();
			if (disposed || !renderer) return;
			renderer.showStatic();
			update();
		};
		const update = () => {
			if (disposed) return;
			const visible = !document.hidden;
			if (intersecting && visible && !renderer) {
				if (factory) {
					renderer = factory(host, kind);
					renderer.canvas.addEventListener("webglcontextlost", lost);
					resize();
				} else if (!requested) {
					requested = true;
					void import("./hero-three-renderer")
						.then((module) => {
							if (disposed) return;
							factory = module.createHeroRenderer;
							update();
						})
						.catch((error: unknown) => {
							if (disposed) return;
							host.dataset.renderer = "unavailable";
							element.dataset.motion = "static";
							console.warn("Hero scene could not be loaded", error);
						});
				}
			}
			if (!renderer) return;
			resize();
			const moving = shouldAnimateHero(
				intersecting,
				visible && !pausedRef.current,
				reduced.matches,
				renderer.mode,
			);
			renderer.setMotion(
				moving,
				intersecting && visible && (reduced.matches || renderer.mode === "svg"),
			);
			element.dataset.motion =
				renderer.mode === "svg"
					? "static"
					: reduced.matches
						? "reduced"
						: moving
							? "running"
							: "paused";
			setCanMove(renderer.mode === "webgl" && !reduced.matches);
		};
		refresh.current = update;
		const visibility = new IntersectionObserver(([entry]) => {
			intersecting = !!entry?.isIntersecting && entry.intersectionRatio > 0;
			update();
		});
		const size = new ResizeObserver(resize);
		visibility.observe(element);
		size.observe(host);
		reduced.addEventListener("change", update);
		document.addEventListener("visibilitychange", update);
		return () => {
			disposed = true;
			refresh.current = () => {};
			visibility.disconnect();
			size.disconnect();
			reduced.removeEventListener("change", update);
			document.removeEventListener("visibilitychange", update);
			renderer?.canvas.removeEventListener("webglcontextlost", lost);
			renderer?.dispose();
		};
	}, [kind]);

	return (
		<div
			className={`hero-object hero-object-${kind}`}
			data-hero-object={kind}
			ref={root}
		>
			<div className="hero-object-stage" ref={stage} aria-hidden="true" />
			{canMove ? (
				<button
					className="icon-button hero-motion-toggle"
					type="button"
					aria-label={paused ? t.resumeObject : t.pauseObject}
					title={paused ? t.resumeObject : t.pauseObject}
					aria-pressed={paused}
					onClick={() => setPaused((value) => !value)}
				>
					<Icon name={paused ? "play" : "pause"} />
				</button>
			) : null}
		</div>
	);
}
