import { RedDot } from "./Identity";
import {
	Body,
	Canvas,
	ContentArea,
	Eyebrow,
	FitText,
	Heading,
	mono,
	ProjectArt,
	type SceneProps,
	type SceneState,
	useScene,
} from "./SceneElements";

function Signal({ s }: { s: SceneState }) {
	return (
		<ContentArea
			s={s}
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
			}}
		>
			<FitText s={s} center>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div style={{ marginBottom: 36, ...s.move(0) }}>
						<RedDot size={18} />
					</div>
					<Eyebrow s={s} />
					<Heading
						s={s}
						size={s.portrait ? 126 : 184}
						style={{ maxWidth: s.portrait ? "100%" : 1550 }}
					/>
				</div>
			</FitText>
			<Body s={s} size={34} style={{ maxWidth: 1110, marginTop: 40 }} />
			<div
				style={{
					width: 88,
					height: 1,
					background: s.p.ink,
					marginTop: 56,
					transform: `scaleX(${s.enter(0.4)})`,
					opacity: s.exit,
				}}
			/>
		</ContentArea>
	);
}

function Frame({ s }: { s: SceneState }) {
	return (
		<ContentArea s={s} style={{ perspective: 1800 }}>
			<div
				style={{
					position: "absolute",
					inset: "20px -16px -16px 20px",
					border: `1px solid ${s.p.line}`,
					background: s.p.soft,
					borderRadius: 28,
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "grid",
					gridTemplateRows: s.portrait
						? "minmax(0, 1fr) 530px"
						: "minmax(0, 1fr) 270px",
					background: s.p.surface,
					border: `1px solid ${s.p.line}`,
					borderRadius: 26,
					overflow: "hidden",
					transform: `rotateX(${(1 - s.enter(0.08, 1)) * 5}deg)`,
					transformOrigin: "center bottom",
					opacity: s.enter(0),
				}}
			>
				<div
					style={{
						position: "relative",
						minHeight: 0,
						padding: s.portrait ? 55 : "38px 70px 22px",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 22,
							left: 26,
							right: 26,
							display: "flex",
							justifyContent: "space-between",
							gap: 25,
							...mono,
							fontSize: 14,
							color: s.muted,
						}}
					>
						<span>
							{s.project?.screenshot ? "PRODUCT VIEW" : "PROJECT IDENTITY"}
						</span>
						<span>01 — 01</span>
					</div>
					<ProjectArt s={s} style={{ padding: 0 }} />
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: s.portrait ? "1fr" : "1.15fr 1fr",
						gridTemplateRows: s.portrait ? "1fr 1fr" : "1fr",
						gap: s.portrait ? 30 : 80,
						padding: s.portrait ? 48 : "35px 48px",
						borderTop: `1px solid ${s.p.line}`,
						background: s.p.page,
					}}
				>
					<FitText s={s}>
						<Eyebrow
							s={s}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 14,
								marginBottom: 18,
							}}
						>
							<RedDot size={11} />
							{s.eyebrow}
						</Eyebrow>
						<Heading s={s} size={s.portrait ? 126 : 134} />
					</FitText>
					<FitText s={s}>
						<Body s={s} size={32} style={{ marginTop: 0 }} />
					</FitText>
				</div>
			</div>
		</ContentArea>
	);
}

function Index({ s }: { s: SceneState }) {
	return (
		<ContentArea
			s={s}
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "start",
					justifyContent: "space-between",
					gap: 38,
					flexShrink: 0,
				}}
			>
				<div
					style={{
						...mono,
						fontSize: s.portrait ? 220 : 270,
						letterSpacing: "-0.105em",
						lineHeight: 0.85,
						fontWeight: 400,
						color: s.p.accent,
						...s.move(0),
					}}
				>
					01<span style={{ color: s.p.line }}>.</span>
				</div>
				<div style={{ paddingTop: 6, textAlign: "right", maxWidth: 350 }}>
					<Eyebrow s={s} />
					<span style={{ ...mono, fontSize: 16, color: s.muted }}>
						IDEAS / PEOPLE / SOFTWARE
					</span>
				</div>
			</div>
			<FitText s={s} style={{ flex: 1 }}>
				<Heading s={s} size={s.portrait ? 140 : 170} />
			</FitText>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: s.portrait ? "1fr" : "0.5fr 1.5fr",
					gridTemplateRows: s.portrait ? "auto minmax(0, 1fr)" : "1fr",
					height: s.portrait
						? (s.body?.length ?? 0) > 260
							? 550
							: 225
						: (s.body?.length ?? 0) > 260
							? 270
							: 130,
					flexShrink: 0,
					gap: 40,
					borderTop: `1px solid ${s.p.ink}`,
					paddingTop: 28,
					...s.move(0.3),
				}}
			>
				<div
					style={{
						...mono,
						fontSize: 17,
						display: "flex",
						alignItems: "start",
						gap: 14,
						color: s.muted,
					}}
				>
					<RedDot size={10} style={{ marginTop: 8 }} />
					<span>
						THE OPENING NOTE
						<br />
						{s.project?.name ?? "HEXLY"}
					</span>
				</div>
				<FitText s={s}>
					<Body s={s} size={32} style={{ marginTop: 0, maxWidth: 1140 }} />
				</FitText>
			</div>
		</ContentArea>
	);
}

function Horizon({ s }: { s: SceneState }) {
	const line = s.portrait ? 0.59 : 0.63;
	return (
		<>
			<div
				style={{
					position: "absolute",
					inset: `${s.height * line}px 0 0`,
					background: s.p.soft,
					opacity: s.enter(0.08, 1),
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: s.height * line,
					height: 1,
					background: s.p.line,
					transform: `scaleX(${s.enter(0.15, 1)})`,
					transformOrigin: "left",
				}}
			/>
			<ContentArea s={s} style={{ display: "flex", flexDirection: "column" }}>
				<FitText
					s={s}
					style={{
						height: s.height * line - (s.portrait ? 186 : 152) - 72,
						flexShrink: 0,
					}}
				>
					<Eyebrow s={s} />
					<Heading
						s={s}
						size={s.portrait ? 128 : 162}
						style={{ maxWidth: s.portrait ? undefined : 1620 }}
					/>
					<Body
						s={s}
						size={34}
						style={{ maxWidth: s.portrait ? undefined : 1190 }}
					/>
				</FitText>
				<div
					style={{
						marginTop: "auto",
						display: "flex",
						alignItems: "end",
						justifyContent: "space-between",
						gap: 40,
						flexShrink: 0,
					}}
				>
					<div style={{ ...s.move(0.35), maxWidth: "54%" }}>
						<RedDot size={14} />
						<div
							style={{
								...mono,
								fontSize: 22,
								lineHeight: 1.65,
								color: s.muted,
								marginTop: 25,
							}}
						>
							A SMALL IDEA.
							<br />A NEW HORIZON.
						</div>
					</div>
					<div
						style={{
							width: s.portrait ? 330 : 360,
							height: s.portrait ? 380 : 288,
							padding: 18,
							marginBottom: 16,
							border: `1px solid ${s.p.line}`,
							background: s.p.surface,
							borderRadius: 24,
							boxShadow: `0 22px 60px ${s.p.shadow}0c`,
							...s.move(0.2, 32),
						}}
					>
						<ProjectArt s={s} style={{ padding: 22 }} />
					</div>
				</div>
			</ContentArea>
		</>
	);
}

function Stack({ s }: { s: SceneState }) {
	return (
		<ContentArea
			s={s}
			style={{
				display: "grid",
				placeItems: "center",
				padding: s.portrait ? "80px 14px" : "45px 80px",
			}}
		>
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					maxHeight: s.portrait ? 1250 : 660,
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: "-28px 26px 28px -26px",
						background: s.p.soft,
						border: `1px solid ${s.p.line}`,
						borderRadius: 28,
						transform: `rotate(${-2.4 * s.enter(0.12, 1.1)}deg)`,
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: "20px -24px -20px 24px",
						background: s.p.page,
						border: `1px solid ${s.p.line}`,
						borderRadius: 28,
						transform: `rotate(${1.5 * s.enter(0.18, 1.1)}deg)`,
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						padding: s.portrait ? 58 : 62,
						border: `1px solid ${s.p.line}`,
						background: s.p.surface,
						borderRadius: 28,
						display: "flex",
						flexDirection: "column",
						boxShadow: `0 25px 70px ${s.p.shadow}0d`,
						...s.move(0.08, 28),
					}}
				>
					<FitText s={s}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "start",
							}}
						>
							<Eyebrow s={s} />
							<RedDot size={12} />
						</div>
						<div
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								gap: 34,
							}}
						>
							<Heading
								s={s}
								size={s.portrait ? 128 : 146}
								style={{ flex: 1 }}
							/>
							<div
								style={{
									width: s.portrait ? 132 : 180,
									height: s.portrait ? 132 : 180,
								}}
							>
								<ProjectArt s={s} screenshot={false} style={{ padding: 12 }} />
							</div>
						</div>
						<Body
							s={s}
							size={30}
							style={{
								marginTop: 20,
								paddingTop: 26,
								borderTop: `1px solid ${s.p.line}`,
							}}
						/>
					</FitText>
				</div>
			</div>
		</ContentArea>
	);
}

const openings = {
	signal: Signal,
	frame: Frame,
	index: Index,
	horizon: Horizon,
	stack: Stack,
};
export function Opening(props: SceneProps) {
	const s = useScene(props, "intro");
	const Layout = openings[props.opening ?? "signal"];
	return (
		<Canvas s={s}>
			<Layout s={s} />
		</Canvas>
	);
}
