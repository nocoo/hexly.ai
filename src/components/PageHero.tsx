import type { ReactNode } from "react";
import "../styles/hero.css";

export function PageHero({
	headingId,
	eyebrow,
	title,
	description,
	artwork,
	children,
	className = "",
}: {
	headingId: string;
	eyebrow: string;
	title: ReactNode;
	description: string;
	artwork: ReactNode;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<section className={`hero ${className}`} aria-labelledby={headingId}>
			<div className="hero-copy">
				<p className="eyebrow">
					<span className="tiny-square" />
					{eyebrow}
				</p>
				<h1 id={headingId}>{title}</h1>
				<p className="hero-description">{description}</p>
				{children ? <div className="hero-actions">{children}</div> : null}
			</div>
			{artwork}
		</section>
	);
}
