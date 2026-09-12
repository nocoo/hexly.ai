import {
	type CSSProperties,
	type ReactNode,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	AbsoluteFill,
	Img,
	staticFile,
	useCurrentFrame,
	useDelayRender,
	useVideoConfig,
} from "remotion";
import { family, hexly, layouts, palettes } from "./brand";
import { useHexlyFonts } from "./fonts";
import { BrandLockup, BrandMark } from "./Identity";
import { ease, entrance } from "./motion";
import type {
	CompositionOptions,
	Motion,
	SceneConfig,
	SceneKind,
	TemplateId,
	VideoProject,
} from "./schema";
import "./canvas.css";

export type SceneProps = Pick<SceneConfig, "title"> &
	Partial<Pick<SceneConfig, "eyebrow" | "body" | "link">> &
	Partial<CompositionOptions> & {
		template?: TemplateId;
		motion?: Motion;
		index?: number;
		project?: VideoProject;
		children?: ReactNode;
	};

export function useScene(props: SceneProps, kind: SceneKind) {
	const frame = useCurrentFrame();
	const { fps, width, height, durationInFrames } = useVideoConfig();
	const ready = useHexlyFonts();
	const template = props.template ?? "launch";
	const theme = props.theme ?? "light";
	const motion = props.motion ?? "full";
	const timing = layouts[template];
	const reduced = motion === "reduced";
	const enter = (delay = 0, duration: number = timing.enter) =>
		entrance(frame, fps, duration, delay, reduced);
	const exit = reduced
		? 1
		: 1 -
			ease(
				(frame - durationInFrames + fps * family.motion.transition) /
					(fps * family.motion.transition),
			);
	const move = (
		delay = 0,
		travel: number = family.motion.travel,
	): CSSProperties => ({
		opacity: enter(delay) * exit,
		transform: `translateY(${(1 - enter(delay)) * travel}px)`,
	});
	return {
		...props,
		kind,
		template,
		theme,
		motion,
		index: props.index ?? 0,
		p: palettes[theme],
		muted: `color-mix(in srgb, ${palettes[theme].muted} 84%, ${palettes[theme].ink})`,
		width,
		height,
		portrait: height > width,
		frame,
		fps,
		ready,
		enter,
		exit,
		move,
	};
}
export type SceneState = ReturnType<typeof useScene>;

/** Fit a complete text group in its assigned cell, after the real fonts load. No clipping or ellipsis. */
export function FitText({
	s,
	children,
	center = false,
	style,
}: {
	s: SceneState;
	children: ReactNode;
	center?: boolean;
	style?: CSSProperties;
}) {
	const host = useRef<HTMLDivElement>(null);
	const content = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const { delayRender, continueRender } = useDelayRender();
	useLayoutEffect(() => {
		if (!s.ready || !host.current || !content.current) return;
		const handle = delayRender("Fit the scene copy in its content cell");
		const measure = () => {
			const box = host.current;
			const text = content.current;
			if (!box || !text || !box.clientHeight || !text.offsetHeight) return;
			setScale(
				Math.min(
					1,
					box.clientHeight / text.offsetHeight,
					box.clientWidth / text.scrollWidth,
				),
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(host.current);
		observer.observe(content.current);
		continueRender(handle);
		return () => observer.disconnect();
	}, [s.ready, delayRender, continueRender]);
	return (
		<div
			data-fit-cell
			ref={host}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				minHeight: 0,
				minWidth: 0,
				...style,
			}}
		>
			<div
				ref={content}
				data-fit-scale={scale}
				style={{
					position: "absolute",
					top: "50%",
					left: 0,
					width: "100%",
					transform: `translateY(-50%) scale(${scale})`,
					transformOrigin: `${center ? "center" : "left"} center`,
				}}
			>
				{children}
			</div>
		</div>
	);
}
export const mono: CSSProperties = {
	fontFamily: hexly.mono,
	fontSize: 19,
	lineHeight: 1.5,
	letterSpacing: 1.2,
};
export const projectAsset = (path: string) =>
	/^(https:|data:)/.test(path) ? path : staticFile(path.replace(/^\//, ""));

export function Canvas({
	s,
	children,
	chrome = true,
}: {
	s: SceneState;
	children: ReactNode;
	chrome?: boolean;
}) {
	return (
		<AbsoluteFill
			className="vk-canvas"
			data-video-scene={s.kind}
			data-template={s.template}
			data-video-theme={s.theme}
			data-opening={s.kind === "intro" ? (s.opening ?? "signal") : undefined}
			data-ending={s.kind === "outro" ? (s.ending ?? "signature") : undefined}
			style={{
				background: s.p.page,
				color: s.p.ink,
				fontFamily: hexly.sans,
				overflow: "hidden",
				opacity: s.ready ? 1 : 0,
			}}
		>
			{children}
			{chrome ? (
				<>
					<div
						data-video-edge
						style={{
							position: "absolute",
							top: family.space.edge,
							left: family.space.edge,
							right: family.space.edge,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 24,
						}}
					>
						<BrandLockup scale={s.portrait ? 1.65 : 1.3} palette={s.p} />
						<span style={{ ...mono, fontSize: 15, color: s.muted }}>
							{String(s.index + 1).padStart(2, "0")} /{" "}
							{s.project?.name ?? "HEXLY"}
						</span>
					</div>
					<div
						data-video-edge
						style={{
							position: "absolute",
							left: family.space.edge,
							right: family.space.edge,
							bottom: 26,
							paddingTop: 16,
							borderTop: `1px solid ${s.p.line}`,
							display: "flex",
							justifyContent: "space-between",
							gap: 24,
							...mono,
							fontSize: 14,
							color: s.muted,
						}}
					>
						<span>SMALL IDEAS. A LITTLE UNIVERSE.</span>
						<span>HEXLY.AI</span>
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
}

export function ContentArea({
	s,
	children,
	style,
}: {
	s: SceneState;
	children: ReactNode;
	style?: CSSProperties;
}) {
	return (
		<div
			data-video-content
			style={{
				position: "absolute",
				left: s.portrait ? 64 : family.space.safe,
				right: s.portrait ? 64 : family.space.safe,
				top: s.portrait ? 186 : family.space.top,
				bottom: s.portrait ? 142 : family.space.bottom,
				...style,
			}}
		>
			{children}
		</div>
	);
}

export function Eyebrow({
	s,
	children,
	style,
}: {
	s: SceneState;
	children?: ReactNode;
	style?: CSSProperties;
}) {
	return (
		<div
			style={{
				...mono,
				color: s.muted,
				marginBottom: 28,
				...s.move(0.03),
				...style,
			}}
		>
			{children ?? s.eyebrow ?? s.kind.toUpperCase()}
		</div>
	);
}

export function Heading({
	s,
	size = 132,
	style,
}: {
	s: SceneState;
	size?: number;
	style?: CSSProperties;
}) {
	// Full text is preserved. Bound long Latin names and CJK paragraphs without fixed-height clipping.
	const length = [...s.title].reduce(
		(n, char) => n + (char.charCodeAt(0) > 255 ? 1.65 : 1),
		0,
	);
	const factor =
		length > 85 ? 0.52 : length > 55 ? 0.65 : length > 30 ? 0.8 : 1;
	return (
		<div
			data-video-title
			style={{
				fontSize: size * factor,
				fontWeight: 500,
				lineHeight: 1.07,
				letterSpacing: "-0.055em",
				whiteSpace: "pre-line",
				overflowWrap: "anywhere",
				textWrap: "balance",
				margin: 0,
				...s.move(0.12),
				...style,
			}}
		>
			{s.title}
		</div>
	);
}

export function Body({
	s,
	size = 32,
	style,
}: {
	s: SceneState;
	size?: number;
	style?: CSSProperties;
}) {
	return s.body ? (
		<div
			data-video-body
			style={{
				fontSize: s.body.length > 300 ? size * 0.8 : size,
				lineHeight: 1.55,
				color: s.muted,
				whiteSpace: "pre-line",
				overflowWrap: "anywhere",
				textWrap: "pretty",
				marginTop: 30,
				...s.move(0.24),
				...style,
			}}
		>
			{s.body}
		</div>
	) : null;
}

export function ProjectArt({
	s,
	screenshot = true,
	style,
}: {
	s: SceneState;
	screenshot?: boolean;
	style?: CSSProperties;
}) {
	const image = screenshot ? s.project?.screenshot : undefined;
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: image ? 20 : 66,
				...style,
			}}
		>
			{image ? (
				<Img
					src={projectAsset(image.src)}
					alt={image.alt}
					style={{ width: "100%", height: "100%", objectFit: "contain" }}
				/>
			) : s.project?.logo ? (
				<Img
					src={projectAsset(s.project.logo)}
					alt={s.project.name}
					style={{ width: "100%", height: "100%", objectFit: "contain" }}
				/>
			) : (
				<BrandMark scale={6.5} palette={s.p} />
			)}
		</div>
	);
}

export function ArtPanel({
	s,
	style,
	layered = false,
}: {
	s: SceneState;
	style?: CSSProperties;
	layered?: boolean;
}) {
	return (
		<div
			style={{ position: "relative", minWidth: 0, height: "100%", ...style }}
		>
			{layered ? (
				<div
					style={{
						position: "absolute",
						inset: "22px -18px -18px 22px",
						border: `1px solid ${s.p.line}`,
						background: s.p.soft,
						borderRadius: 28,
					}}
				/>
			) : null}
			<div
				style={{
					position: "absolute",
					inset: 0,
					border: `1px solid ${s.p.line}`,
					background: s.p.surface,
					borderRadius: 24,
					overflow: "hidden",
					...s.move(0.28, 26),
				}}
			>
				<ProjectArt s={s} />
			</div>
		</div>
	);
}

export function Chips({ s }: { s: SceneState }) {
	return s.kind === "content" && s.project?.technologies.length ? (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: 12,
				marginTop: 30,
				...s.move(0.36),
			}}
		>
			{s.project.technologies.map((name) => (
				<span
					key={name}
					style={{
						...mono,
						fontSize: 18,
						letterSpacing: 0,
						padding: "9px 14px",
						border: `1px solid ${s.p.line}`,
						borderRadius: 8,
					}}
				>
					{name}
				</span>
			))}
		</div>
	) : null;
}

export function Action({
	s,
	compact = false,
}: {
	s: SceneState;
	compact?: boolean;
}) {
	if (!s.link) return null;
	return (
		<div style={{ marginTop: compact ? 26 : 44, ...s.move(0.32) }}>
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 48,
					background: s.p.ink,
					color: s.p.page,
					borderRadius: 10,
					padding: "23px 30px",
					fontSize: 28,
				}}
			>
				{s.link.label}
				<span aria-hidden="true">↗</span>
			</div>
			<div
				style={{
					...mono,
					fontSize: 20,
					letterSpacing: 0,
					marginTop: 22,
					color: s.muted,
					overflowWrap: "anywhere",
				}}
			>
				{s.link.href.replace(/^https:\/\//, "").replace(/\/$/, "")}
			</div>
		</div>
	);
}

export function Facts({
	s,
	direction = "row",
}: {
	s: SceneState;
	direction?: "row" | "column";
}) {
	const facts = s.project?.facts ?? [];
	return facts.length ? (
		<div
			style={{
				display: "grid",
				gridTemplateColumns:
					direction === "row"
						? `repeat(${Math.min(3, facts.length)}, minmax(0, 1fr))`
						: "1fr",
				gap: 28,
			}}
		>
			{facts.slice(0, 3).map((fact, index) => (
				<div
					key={fact.label}
					style={{
						borderTop: `1px solid ${s.p.line}`,
						paddingTop: 20,
						...s.move(0.22 + index * 0.09),
					}}
				>
					<div style={{ ...mono, fontSize: 16, color: s.muted }}>
						{fact.label.toUpperCase()}
					</div>
					<div
						style={{
							fontSize: fact.value.length > 16 ? 32 : 46,
							letterSpacing: "-0.04em",
							lineHeight: 1.2,
							marginTop: 10,
							overflowWrap: "anywhere",
						}}
					>
						{fact.value}
					</div>
				</div>
			))}
		</div>
	) : null;
}
