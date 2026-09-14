import { type CSSProperties, useEffect, useRef, useState } from "react";
import { copy } from "../data/copy";
import { assetUrl } from "../model/assets";
import type { Locale, ProjectScreenshot } from "../model/project";
import { AssetLink } from "./AssetLink";
import { Icon } from "./Icon";
import "../styles/project-screenshots.css";

type GalleryProps = {
	screenshots: ProjectScreenshot[];
	projectTitle: string;
	locale: Locale;
};

function ScreenshotLightbox({
	screenshots,
	projectTitle,
	locale,
	initialIndex,
	onDismiss,
}: GalleryProps & { initialIndex: number; onDismiss: () => void }) {
	const [index, setIndex] = useState(initialIndex);
	const [failedSrc, setFailedSrc] = useState<string>();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const thumbnailsRef = useRef<HTMLElement>(null);
	const t = copy[locale];
	const shot = screenshots[index];
	const multiple = screenshots.length > 1;
	const move = (offset: number) =>
		setIndex(
			(current) => (current + offset + screenshots.length) % screenshots.length,
		);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const trigger = document.activeElement;
		const previousOverflow = document.documentElement.style.overflow;
		dialog.showModal();
		closeRef.current?.focus({ preventScroll: true });
		document.documentElement.style.overflow = "hidden";
		return () => {
			dialog.close();
			document.documentElement.style.overflow = previousOverflow;
			if (trigger instanceof HTMLElement && trigger.isConnected)
				trigger.focus({ preventScroll: true });
		};
	}, []);

	useEffect(() => {
		const rail = thumbnailsRef.current;
		const current = rail?.querySelectorAll<HTMLButtonElement>("button")[index];
		if (!rail || !current) return;
		// Scroll only this rail, never the underlying page or the dialog image.
		rail.scrollTo({
			left: current.offsetLeft - rail.clientWidth / 2 + current.clientWidth / 2,
			behavior: "auto",
		});
	}, [index]);

	if (!shot) return null;
	return (
		<dialog
			ref={dialogRef}
			className="screenshot-lightbox"
			aria-labelledby="screenshot-preview-title"
			aria-describedby="screenshot-preview-caption"
			onCancel={(event) => {
				event.preventDefault();
				onDismiss();
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) onDismiss();
			}}
			onKeyDown={(event) => {
				// Keep both image navigation and the site's search shortcut in the modal.
				event.stopPropagation();
				if (event.key === "Tab") {
					const controls = event.currentTarget.querySelectorAll<HTMLElement>(
						"a[href], button:not([disabled])",
					);
					const first = controls[0];
					const last = controls[controls.length - 1];
					if (event.shiftKey && document.activeElement === first) {
						event.preventDefault();
						last?.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first?.focus();
					}
					return;
				}
				if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
					return;
				if (
					!multiple ||
					!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
				)
					return;
				event.preventDefault();
				if (event.key === "Home") setIndex(0);
				else if (event.key === "End") setIndex(screenshots.length - 1);
				else move(event.key === "ArrowLeft" ? -1 : 1);
			}}
		>
			<header className="screenshot-lightbox-heading">
				<div>
					<p className="eyebrow">{t.screenshots}</p>
					<h2 id="screenshot-preview-title">{projectTitle}</h2>
				</div>
				<div className="screenshot-lightbox-actions">
					<AssetLink href={shot.src} target="_blank" rel="noreferrer">
						<span>{t.openOriginal}</span>
						<Icon name="arrow" />
					</AssetLink>
					<button
						ref={closeRef}
						type="button"
						className="icon-button"
						aria-label={t.closePreview}
						onClick={onDismiss}
					>
						<Icon name="close" />
					</button>
				</div>
			</header>
			<div className="screenshot-lightbox-stage" data-multiple={multiple}>
				{multiple && (
					<button
						type="button"
						className="icon-button screenshot-step"
						aria-label={t.previousImage}
						aria-keyshortcuts="ArrowLeft"
						onClick={() => move(-1)}
					>
						<Icon name="left" />
					</button>
				)}
				<div className="screenshot-focus">
					{failedSrc === shot.src ? (
						<p role="alert">{t.imageFailed}</p>
					) : (
						<img
							key={shot.id}
							crossOrigin="anonymous"
							src={assetUrl(shot.src)}
							alt={shot.alt[locale]}
							width={shot.width}
							height={shot.height}
							decoding="async"
							onError={() => setFailedSrc(shot.src)}
						/>
					)}
				</div>
				{multiple && (
					<button
						type="button"
						className="icon-button screenshot-step"
						aria-label={t.nextImage}
						aria-keyshortcuts="ArrowRight"
						onClick={() => move(1)}
					>
						<Icon name="right" />
					</button>
				)}
			</div>
			<footer className="screenshot-lightbox-footer">
				<div
					className="screenshot-lightbox-caption"
					id="screenshot-preview-caption"
					aria-live="polite"
					aria-atomic="true"
				>
					<span className="mono">
						{String(index + 1).padStart(2, "0")} /{" "}
						{String(screenshots.length).padStart(2, "0")}
					</span>
					<p>{shot.alt[locale]}</p>
				</div>
				{multiple && (
					<nav
						ref={thumbnailsRef}
						className="screenshot-thumbnails"
						aria-label={t.previewNavigation}
					>
						{screenshots.map((item, position) => (
							<button
								key={item.id}
								type="button"
								aria-label={`${position + 1}. ${item.alt[locale]}`}
								aria-current={index === position ? "true" : undefined}
								onClick={() => setIndex(position)}
							>
								<img
									crossOrigin="anonymous"
									src={assetUrl(item.thumbnail ?? item.preview ?? item.src)}
									alt=""
									width={item.width}
									height={item.height}
									decoding="async"
								/>
							</button>
						))}
					</nav>
				)}
				{multiple && (
					<p className="screenshot-keyboard-hint mono">{t.previewKeyboard}</p>
				)}
			</footer>
		</dialog>
	);
}

export function ProjectScreenshots(props: GalleryProps) {
	const { screenshots, projectTitle, locale } = props;
	const [opened, setOpened] = useState<number | null>(null);
	const t = copy[locale];
	if (!screenshots.length) return null;
	return (
		<section className="project-screenshots" aria-label={t.screenshots}>
			<div className="screenshot-gallery-heading">
				<h3>
					{t.screenshots}
					<span className="mono">
						{String(screenshots.length).padStart(2, "0")}
					</span>
				</h3>
				<p>{t.previewHint}</p>
			</div>
			<div
				className="screenshot-gallery"
				style={
					{
						"--screenshot-columns": Math.min(screenshots.length, 3),
					} as CSSProperties
				}
			>
				{screenshots.map((shot, index) => (
					<figure key={shot.id}>
						<AssetLink
							className="screenshot-card"
							href={shot.src}
							target="_blank"
							rel="noreferrer"
							aria-label={`${t.previewImage}: ${shot.alt[locale]}`}
							aria-haspopup="dialog"
							onClick={(event) => {
								if (
									event.button ||
									event.metaKey ||
									event.ctrlKey ||
									event.shiftKey ||
									event.altKey
								)
									return;
								event.preventDefault();
								setOpened(index);
							}}
						>
							<img
								crossOrigin="anonymous"
								src={assetUrl(shot.preview ?? shot.src)}
								alt={shot.alt[locale]}
								width={shot.width}
								height={shot.height}
								loading="lazy"
								decoding="async"
							/>
							<span className="screenshot-expand" aria-hidden="true">
								<Icon name="expand" />
							</span>
						</AssetLink>
						<figcaption>
							<span className="mono">{String(index + 1).padStart(2, "0")}</span>
							<span>{shot.alt[locale]}</span>
						</figcaption>
					</figure>
				))}
			</div>
			{opened !== null && (
				<ScreenshotLightbox
					screenshots={screenshots}
					projectTitle={projectTitle}
					locale={locale}
					initialIndex={opened}
					onDismiss={() => setOpened(null)}
				/>
			)}
		</section>
	);
}
