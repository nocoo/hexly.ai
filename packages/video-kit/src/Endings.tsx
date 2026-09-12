import { family } from "./brand";
import { HexlyReveal, RedDot } from "./Identity";
import {
	Body,
	Canvas,
	FitText,
	Heading,
	mono,
	ProjectArt,
	type SceneProps,
	useScene,
} from "./SceneElements";

export function Ending(props: SceneProps) {
	const s = useScene(props, "outro");
	const ending = props.ending ?? "signature";
	const caption = [...new Set([s.title, s.body].filter(Boolean))].join(" · ");
	const lineY = s.height * 0.66;
	// Let the signature settle below the rule before drawing across its path.
	const lineProgress = s.enter(2.3, 0.75);
	const note =
		ending === "line"
			? {
					left: s.portrait ? 64 : 80,
					right: s.portrait ? 64 : 80,
					top: s.height * 0.19,
					height: s.height * 0.36,
					size: s.portrait ? 126 : 154,
					center: false,
				}
			: ending === "frame"
				? {
						left: s.portrait ? 150 : s.width * 0.6,
						right: s.portrait ? 150 : 310,
						top: s.portrait ? s.height * 0.62 : s.height * 0.29,
						height: s.portrait ? 400 : 440,
						size: 68,
						center: true,
					}
				: ending === "split"
					? {
							left: s.portrait ? 64 : s.width * 0.58,
							right: s.portrait ? 64 : 80,
							top: s.portrait ? s.height * 0.68 : s.height * 0.32,
							height: s.portrait ? 440 : 460,
							size: s.portrait ? 104 : 100,
							center: false,
						}
					: undefined;
	return (
		<Canvas s={s} chrome={false}>
			{ending === "frame" ? (
				<>
					<div
						style={{ position: "absolute", inset: 0, background: s.p.soft }}
					/>
					<div
						style={{
							position: "absolute",
							inset: s.portrait ? "300px 64px" : "190px 250px",
							borderRadius: 32,
							border: `1px solid ${s.p.line}`,
							background: s.p.page,
							transform: `translate(18px, 18px) rotate(${1.2 * s.enter(0, 1)}deg)`,
						}}
					/>
					<div
						style={{
							position: "absolute",
							inset: s.portrait ? "300px 64px" : "190px 250px",
							borderRadius: 32,
							border: `1px solid ${s.p.line}`,
							background: s.p.surface,
							boxShadow: `0 24px 70px ${s.p.shadow}0d`,
							opacity: s.enter(0, 0.6),
							transform: `scale(${0.96 + 0.04 * s.enter(0, 1)})`,
						}}
					/>
				</>
			) : null}
			{ending === "split" ? (
				<>
					<div
						style={{
							position: "absolute",
							top: 0,
							bottom: 0,
							left: `${100 - s.enter(0, 1.15) * 48}%`,
							right: 0,
							background: s.p.soft,
							borderLeft: `1px solid ${s.p.line}`,
						}}
					/>
					<div
						style={{
							position: "absolute",
							left: family.space.edge,
							bottom: 36,
							...mono,
							fontSize: 17,
							color: s.muted,
							...s.move(2.5),
						}}
					>
						THE IDEA CONTINUES.
					</div>
					<div
						style={{
							position: "absolute",
							right: family.space.edge,
							top: 36,
							...mono,
							fontSize: 17,
							color: s.muted,
							...s.move(2.5),
						}}
					>
						EXPLORE / HEXLY.AI ↗
					</div>
				</>
			) : null}
			{ending === "line" ? (
				<>
					<div
						style={{
							position: "absolute",
							left: 32,
							right: 32,
							top: lineY,
							height: 1,
							background: s.p.line,
							opacity: s.enter(2.3, 0.25),
						}}
					/>
					<div
						style={{
							position: "absolute",
							left: 32,
							top: lineY,
							width: (s.width - 64) * lineProgress,
							height: 1,
							background: s.p.accent,
						}}
					/>
					<RedDot
						size={12}
						style={{
							position: "absolute",
							left: 26 + (s.width - 64) * lineProgress,
							top: lineY - 5.5,
							opacity: s.enter(2.3, 0.25),
						}}
					/>
					<div
						style={{
							position: "absolute",
							left: 32,
							right: 32,
							top: lineY + 30,
							display: "flex",
							justifyContent: "space-between",
							gap: 30,
							...mono,
							fontSize: 16,
							color: s.muted,
							...s.move(2.6),
						}}
					>
						<span>ONE IDEA, WELL MADE.</span>
						<span>HEXLY.AI ↗</span>
					</div>
				</>
			) : null}
			{ending === "colophon" ? (
				<>
					<div
						style={{
							position: "absolute",
							inset: "32px 32px auto",
							borderTop: `1px solid ${s.p.ink}`,
							paddingTop: 20,
							display: "flex",
							justifyContent: "space-between",
							gap: 30,
							...mono,
							fontSize: 16,
							color: s.muted,
						}}
					>
						<span>THE HEXLY COLLECTION</span>
						<span>END / {String(s.index + 1).padStart(2, "0")}</span>
					</div>
					<div
						style={{
							position: "absolute",
							inset: "auto 32px 32px",
							borderTop: `1px solid ${s.p.ink}`,
							paddingTop: 25,
							display: "grid",
							gridTemplateColumns: "1.1fr 1fr auto",
							gap: 30,
							...mono,
							fontSize: 17,
							color: s.muted,
							...s.move(2.6),
						}}
					>
						<span>
							SMALL IDEAS.
							<br />A LITTLE UNIVERSE.
						</span>
						<span>
							DESIGNED TO BE SHARED.
							<br />
							HEXLY.AI
						</span>
						<RedDot size={13} style={{ alignSelf: "end" }} />
					</div>
				</>
			) : null}
			<HexlyReveal
				theme={s.theme}
				motion={s.motion}
				caption={note ? undefined : caption}
				centerX={
					ending === "line"
						? s.width * (s.portrait ? 0.36 : 0.2)
						: ending === "split" && !s.portrait
							? s.width * 0.27
							: ending === "frame" && !s.portrait
								? s.width * 0.34
								: undefined
				}
				centerY={ending === "line" ? s.height * 0.82 : undefined}
				scale={
					ending === "line"
						? 3.6
						: s.portrait
							? 4.2
							: ending === "colophon"
								? 8.4
								: ending === "frame"
									? 4.2
									: ending === "split"
										? 4.2
										: 5.8
				}
				background="transparent"
			/>
			{note ? (
				<div
					style={{
						position: "absolute",
						left: note.left,
						right: note.right,
						top: note.top,
						height: note.height,
						opacity: s.enter(2.5, 0.55),
						transform: `translateY(${18 * (1 - s.enter(2.5, 0.55))}px)`,
						textAlign: note.center ? "center" : "left",
					}}
				>
					<FitText s={s} center={note.center}>
						{ending === "frame" && s.project?.logo ? (
							<div style={{ width: 150, height: 150, margin: "0 auto 26px" }}>
								<ProjectArt s={s} screenshot={false} style={{ padding: 0 }} />
							</div>
						) : (
							<div
								style={{
									...mono,
									fontSize: 17,
									color: s.muted,
									marginBottom: 30,
								}}
							>
								{s.eyebrow}
							</div>
						)}
						<Heading s={{ ...s, move: () => ({}) }} size={note.size} />
						<Body
							s={{ ...s, move: () => ({}) }}
							size={25}
							style={{ marginTop: 20 }}
						/>
						<div
							style={{
								...mono,
								fontSize: 22,
								color: s.muted,
								marginTop: 35,
								overflowWrap: "anywhere",
							}}
						>
							{(
								s.project?.website ??
								s.project?.repository ??
								"https://hexly.ai"
							)
								.replace(/^https:\/\//, "")
								.replace(/\/$/, "")}{" "}
							↗
						</div>
					</FitText>
				</div>
			) : null}
		</Canvas>
	);
}
