import { Ending } from "./Endings";
import { HexlyReveal, RedDot } from "./Identity";
import { Opening } from "./Openings";
import {
	Action,
	ArtPanel,
	Body,
	Canvas,
	Chips,
	ContentArea,
	Eyebrow,
	Facts,
	FitText,
	Heading,
	mono,
	ProjectArt,
	type SceneProps,
	type SceneState,
	useScene,
} from "./SceneElements";
import type { SceneKind } from "./schema";

export type { SceneProps } from "./SceneElements";
export { projectAsset } from "./SceneElements";

function Launch({ s }: { s: SceneState }) {
	const art = s.kind === "content" || s.kind === "chapter";
	return (
		<ContentArea
			s={s}
			style={{
				display: "grid",
				gridTemplateColumns: !s.portrait && art ? "1.65fr 1fr" : "1fr",
				gridTemplateRows: s.portrait && art ? "minmax(0, 1fr) 650px" : "1fr",
				gap: s.portrait ? 60 : 100,
				alignItems: "center",
			}}
		>
			<FitText s={s}>
				<Eyebrow
					s={s}
					style={{ display: "flex", alignItems: "center", gap: 16 }}
				>
					<RedDot size={12} />
					{s.eyebrow}
				</Eyebrow>
				<Heading
					s={s}
					size={s.portrait ? 120 : 146}
					style={{ maxWidth: 1520 }}
				/>
				<Body s={s} size={34} style={{ maxWidth: 1250 }} />
				<Chips s={s} />
				<Action s={s} />
			</FitText>
			{art ? (
				s.kind === "chapter" ? (
					<div
						style={{
							fontSize: s.portrait ? 330 : 370,
							lineHeight: 1,
							letterSpacing: "-0.09em",
							color: s.p.accent,
							textAlign: "center",
							...s.move(0.25, 28),
						}}
					>
						01<span style={{ color: s.p.line }}>.</span>
					</div>
				) : (
					<ArtPanel s={s} layered style={{ height: s.portrait ? 650 : 590 }} />
				)
			) : null}
		</ContentArea>
	);
}

function Essential({ s }: { s: SceneState }) {
	const screenshot = s.kind === "content" && s.project?.screenshot;
	return (
		<ContentArea
			s={s}
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				gap: screenshot ? 40 : 0,
			}}
		>
			<FitText
				s={s}
				center
				style={{ maxWidth: s.portrait ? "100%" : 1510, flex: 1 }}
			>
				<Eyebrow
					s={s}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 16,
					}}
				>
					<RedDot size={12} />
					{s.eyebrow}
				</Eyebrow>
				<Heading s={s} size={s.portrait ? 124 : screenshot ? 112 : 162} />
				<Body
					s={s}
					size={34}
					style={{ maxWidth: 1260, marginInline: "auto" }}
				/>
				<Action s={s} />
			</FitText>
			{screenshot ? (
				<div
					style={{
						width: "min(100%, 1300px)",
						minHeight: 220,
						height: s.portrait ? 620 : 380,
						flexShrink: 0,
						...s.move(0.32),
					}}
				>
					<ProjectArt s={s} style={{ padding: 0 }} />
				</div>
			) : null}
		</ContentArea>
	);
}

function Showcase({ s }: { s: SceneState }) {
	const art = s.kind === "content";
	return (
		<ContentArea
			s={s}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: s.portrait ? 48 : 40,
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: s.portrait || !art ? "1fr" : "1.1fr 0.85fr",
					gridTemplateRows: s.portrait && art ? "1fr 1fr" : "1fr",
					height: s.portrait
						? art
							? 540
							: 380
						: art
							? (s.body?.length ?? 0) > 260
								? 340
								: 190
							: 300,
					flexShrink: 0,
					gap: 42,
					alignItems: "end",
				}}
			>
				<FitText s={s}>
					<Eyebrow s={s} />
					<Heading s={s} size={s.portrait ? 126 : art ? 116 : 154} />
				</FitText>
				{art ? (
					<FitText s={s}>
						<Body s={s} size={29} style={{ marginTop: 0 }} />
					</FitText>
				) : null}
			</div>
			<div
				style={{
					flex: 1,
					minHeight: 0,
					position: "relative",
					background: s.p.surface,
					border: `1px solid ${s.p.line}`,
					borderRadius: 24,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					...s.move(0.22, 30),
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 14,
						padding: "18px 25px",
						borderBottom: `1px solid ${s.p.line}`,
						...mono,
						fontSize: 15,
						color: s.muted,
					}}
				>
					<RedDot size={9} />
					<span>{s.project?.name ?? "HEXLY"}</span>
					<span style={{ marginLeft: "auto" }}>
						{String(s.index + 1).padStart(2, "0")} / {s.kind.toUpperCase()}
					</span>
				</div>
				{art ? (
					<div style={{ flex: 1, minHeight: 0, padding: s.portrait ? 22 : 16 }}>
						<ProjectArt s={s} style={{ padding: 0 }} />
					</div>
				) : (
					<div
						style={{
							flex: 1,
							minHeight: 0,
							padding: s.portrait ? 52 : 70,
							display: "flex",
							flexDirection:
								s.kind === "chapter" && !s.portrait ? "row" : "column",
							justifyContent: "center",
							alignItems: s.kind === "chapter" ? "center" : undefined,
							gap: s.kind === "chapter" ? 58 : 0,
						}}
					>
						{s.kind === "chapter" ? (
							<div
								style={{
									fontSize: 180,
									letterSpacing: "-0.07em",
									color: s.p.accent,
									lineHeight: 1,
									flexShrink: 0,
								}}
							>
								01.
							</div>
						) : null}
						<FitText s={s} style={{ flex: 1 }}>
							<Body
								s={s}
								size={s.portrait ? 44 : 50}
								style={{ maxWidth: 1450, marginTop: 0 }}
							/>
							<Action s={s} />
						</FitText>
					</div>
				)}
			</div>
		</ContentArea>
	);
}

function Columns({ s }: { s: SceneState }) {
	return (
		<ContentArea
			s={s}
			style={{
				display: "grid",
				gridTemplateColumns: s.portrait ? "1fr" : "0.85fr 1.25fr",
				gridTemplateRows: s.portrait
					? "minmax(0, 0.75fr) minmax(0, 1.25fr)"
					: "1fr",
				gap: s.portrait ? 46 : 86,
			}}
		>
			<div
				style={{
					position: "relative",
					padding: s.portrait ? 48 : 52,
					background: s.p.soft,
					borderRadius: 22,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					gap: 46,
				}}
			>
				<FitText s={s} style={{ flex: 1 }}>
					<Eyebrow s={s} />
					<Heading s={s} size={s.portrait ? 114 : 122} />
				</FitText>
				<div
					style={{
						display: "flex",
						alignItems: "end",
						justifyContent: "space-between",
						...s.move(0.2),
					}}
				>
					<span
						style={{
							fontSize: s.portrait ? 106 : 186,
							fontWeight: 400,
							lineHeight: 0.9,
							letterSpacing: "-0.08em",
							color: s.p.accent,
						}}
					>
						{String(s.index + 1).padStart(2, "0")}
					</span>
					<span style={{ ...mono, fontSize: 15, color: s.muted }}>
						HEXLY / NOTES
					</span>
				</div>
			</div>
			<FitText s={s}>
				{s.project?.screenshot && s.kind === "content" ? (
					<div style={{ height: s.portrait ? 350 : 300, marginBottom: 28 }}>
						<ProjectArt s={s} style={{ padding: 0 }} />
					</div>
				) : null}
				<Body
					s={s}
					size={s.project?.screenshot ? 32 : s.portrait ? 38 : 42}
					style={{ marginTop: 0, color: s.p.ink }}
				/>
				<Action s={s} />
				{s.kind === "content" ? (
					<div style={{ marginTop: 44 }}>
						<Facts s={s} />
						<Chips s={s} />
						<p
							style={{
								...mono,
								fontSize: 14,
								letterSpacing: 0,
								color: s.muted,
								marginTop: 24,
							}}
						>
							{s.project?.sourceNote}
						</p>
					</div>
				) : (
					<div
						style={{
							height: 1,
							marginTop: 50,
							background: s.p.line,
							transform: `scaleX(${s.enter(0.38)})`,
							transformOrigin: "left",
						}}
					/>
				)}
			</FitText>
		</ContentArea>
	);
}

function Bento({ s }: { s: SceneState }) {
	const facts = s.project?.facts.slice(0, 3) ?? [];
	return (
		<ContentArea
			s={s}
			style={{
				display: "grid",
				gridTemplateColumns: s.portrait
					? "1fr 1fr"
					: "repeat(3, minmax(0, 1fr))",
				gridTemplateRows: s.portrait
					? "minmax(0, 1.2fr) minmax(0, 1fr) 154px 138px"
					: "minmax(0, 1fr) 190px",
				gap: 22,
			}}
		>
			<div
				style={{
					gridColumn: "span 2",
					border: `1px solid ${s.p.line}`,
					background: s.p.surface,
					borderRadius: 24,
					padding: s.portrait ? 45 : 48,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					minHeight: 0,
				}}
			>
				<FitText s={s}>
					<Eyebrow
						s={s}
						style={{ display: "flex", alignItems: "center", gap: 16 }}
					>
						<RedDot size={10} />
						{s.eyebrow}
					</Eyebrow>
					<Heading s={s} size={s.portrait ? 116 : 128} />
					<Body s={s} size={31} />
					<Chips s={s} />
					<Action s={s} compact />
				</FitText>
			</div>
			<div
				style={{
					gridColumn: s.portrait ? "span 2" : undefined,
					borderRadius: 24,
					border: `1px solid ${s.p.line}`,
					background: s.p.soft,
					overflow: "hidden",
					...s.move(0.18, 26),
				}}
			>
				<ProjectArt
					s={s}
					style={{ padding: s.project?.screenshot ? 20 : 66 }}
				/>
			</div>
			{facts.length ? (
				facts.map((fact, i) => (
					<div
						key={fact.label}
						style={{
							borderRadius: 24,
							border: `1px solid ${s.p.line}`,
							background: s.p.surface,
							padding: s.portrait ? 26 : 32,
							gridColumn: s.portrait && i === 2 ? "span 2" : undefined,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							gap: 18,
							...s.move(0.27 + i * 0.09),
						}}
					>
						<span style={{ ...mono, fontSize: 16, color: s.muted }}>
							{fact.label.toUpperCase()}
						</span>
						<span
							style={{
								fontSize: fact.value.length > 16 ? 29 : 44,
								lineHeight: 1.1,
								letterSpacing: "-0.04em",
								overflowWrap: "anywhere",
							}}
						>
							{fact.value}
						</span>
					</div>
				))
			) : (
				<div
					style={{
						gridColumn: "1 / -1",
						...mono,
						color: s.muted,
						padding: 30,
						borderTop: `1px solid ${s.p.line}`,
					}}
				>
					{s.project?.repository.replace(/^https:\/\//, "") ?? "HEXLY.AI"}
				</div>
			)}
		</ContentArea>
	);
}

const contentLayouts = {
	launch: Launch,
	essential: Essential,
	showcase: Showcase,
	columns: Columns,
	bento: Bento,
};
function Slate(props: SceneProps & { kind: SceneKind }) {
	const s = useScene(props, props.kind);
	const Layout = contentLayouts[s.template];
	return (
		<Canvas s={s}>
			<Layout s={s} />
			{props.children}
		</Canvas>
	);
}
export const Intro = Opening;
export const Title = (props: SceneProps) => <Slate {...props} kind="title" />;
export const Chapter = (props: SceneProps) => (
	<Slate {...props} kind="chapter" />
);
export const Content = (props: SceneProps) => (
	<Slate {...props} kind="content" />
);
export const CTA = (props: SceneProps) => <Slate {...props} kind="cta" />;
export const LogoReveal = ({ title, theme, motion }: SceneProps) => (
	<HexlyReveal theme={theme} motion={motion} caption={title} />
);
export const Outro = Ending;
export const sceneComponents = {
	intro: Intro,
	title: Title,
	chapter: Chapter,
	content: Content,
	cta: CTA,
	logo: LogoReveal,
	outro: Outro,
};
