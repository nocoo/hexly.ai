import { BrandMark } from "./Icon";

export function SiteIdentity({ title }: { title: string }) {
	return (
		<section className="site-identity" aria-labelledby="site-identity-title">
			<h2 id="site-identity-title">{title}</h2>
			<figure className="site-identity-lockup">
				<div className="site-identity-logo">
					<BrandMark size={256} />
				</div>
				<figcaption className="brand-wordmark site-identity-wordmark" lang="en">
					<span>
						hexly<span className="brand-dot">.</span>
						<span className="brand-domain">ai</span>
					</span>
				</figcaption>
			</figure>
		</section>
	);
}
