// Additional cross-field checks for public/brands/schema-v2.json.
// A brand archive is a Hexly campaign surface, never a product-UI migration.
type Fields = Record<string, unknown>;
function object(value: unknown): Fields {
	return value !== null && typeof value === "object" && !Array.isArray(value)
		? (value as Fields)
		: {};
}
function text(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}
function digest(value: unknown) {
	return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}
function positive(value: unknown) {
	return Number.isInteger(value) && Number(value) > 0;
}

export function brandManifestProblems(value: unknown): string[] {
	const m = object(value);
	const problems: string[] = [];
	const root = `/brands/${m.project}/v${m.version}`;
	if (
		m.schemaVersion !== 2 ||
		m.method !== "archived-artwork" ||
		!text(m.project) ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.project) ||
		!text(m.version) ||
		!/^\d+\.\d+\.\d+$/.test(m.version) ||
		m.root !== `https://hexly.ai${root}` ||
		m.canonical !== `https://hexly.ai/projects/${m.project}#brand`
	)
		problems.push("Invalid campaign manifest identity");
	const scope = object(m.scope);
	if (
		scope.id !== "hexly-campaign" ||
		scope.productUIChanged !== false ||
		scope.officialIdentityRecolored !== false ||
		scope.campaignReplacesOfficialIdentity !== false ||
		!Array.isArray(scope.appliesTo) ||
		!scope.appliesTo.length ||
		!scope.appliesTo.every(text)
	)
		problems.push("Invalid Hexly-only color and identity scope");
	const files = Array.isArray(m.files) ? m.files.map(object) : [];
	const within = (path: unknown) =>
		text(path) &&
		path.startsWith(`${root}/`) &&
		/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(path.slice(root.length + 1));
	if (
		!files.length ||
		files.some(
			(f) =>
				!within(f.path) ||
				!text(f.role) ||
				!positive(f.bytes) ||
				!digest(f.sha256),
		) ||
		new Set(files.map((f) => f.path)).size !== files.length
	)
		problems.push("Invalid or duplicate versioned files");
	const official = object(m.officialProjectIdentity);
	const campaign = object(m.campaignInterpretation);
	for (const identity of [official, campaign]) {
		if (
			!text(identity.path) ||
			!/^\/(logos|brands)\//.test(identity.path) ||
			!within(identity.export) ||
			!digest(identity.sha256) ||
			!digest(identity.rgbaSha256) ||
			!positive(identity.bytes) ||
			!positive(identity.width) ||
			!positive(identity.height) ||
			!files.some(
				(f) =>
					f.path === identity.export &&
					f.sha256 === identity.sha256 &&
					f.bytes === identity.bytes,
			)
		)
			problems.push(
				"Identity must reference exact original bytes, pixel digest and an exported file",
			);
	}
	if (
		official.role !== "official-project-identity" ||
		official.modified !== false ||
		campaign.role !== "hexly-campaign-interpretation" ||
		campaign.replacesOfficialIdentity !== false ||
		campaign.newGenerationCalls !== 0 ||
		!["gpt-image-2", "retained-original", "reference-adaptation"].includes(
			String(campaign.sourceMethod),
		) ||
		!["adopted", "review"].includes(String(campaign.sourceAdoptionStatus)) ||
		campaign.sameBytesAsOfficial !== (official.sha256 === campaign.sha256)
	)
		problems.push(
			"Official identity and campaign interpretation must remain separate and truthful",
		);
	const hero = object(m.hero);
	const placement = object(hero.placements);
	if (
		hero.method !== "authored-composition" ||
		hero.nativeGPTOutput !== false ||
		hero.crop !== false ||
		hero.recolor !== false ||
		!placement.wide ||
		!placement.square
	)
		problems.push("Hero must declare its actual authored composition method");
	return problems;
}

/** Texture-only versions reference the original identity; they never clone or replace it. */
export function textureManifestProblems(value: unknown): string[] {
	const m = object(value);
	const problems: string[] = [];
	const root = `/textures/${m.project}/v${m.version}`;
	if (
		m.schemaVersion !== 1 ||
		m.kind !== "hexly-project-texture" ||
		!text(m.project) ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.project) ||
		!text(m.version) ||
		!/^\d+\.\d+\.\d+$/.test(m.version) ||
		m.root !== root ||
		m.canonical !== `https://hexly.ai/projects/${m.project}#texture`
	)
		problems.push("Invalid texture manifest identity");
	const scope = object(m.scope);
	if (
		scope.id !== "hexly-campaign" ||
		scope.productUIChanged !== false ||
		scope.officialIdentityChanged !== false ||
		scope.officialIdentityRecolored !== false ||
		scope.campaignReplacesOfficialIdentity !== false
	)
		problems.push(
			"Texture must preserve the official identity and independent product UI",
		);
	const original = object(m.officialProjectIdentity);
	if (
		!text(original.path) ||
		!/^\/(logos|brands)\//.test(original.path) ||
		!digest(original.sha256) ||
		!digest(original.rgbaSha256) ||
		!positive(original.bytes) ||
		!positive(original.width) ||
		!positive(original.height)
	)
		problems.push("Texture must retain original file and pixel hashes");
	const files = Array.isArray(m.files) ? m.files.map(object) : [];
	if (
		!files.length ||
		files.some(
			(file) =>
				!text(file.path) ||
				!file.path.startsWith(`${root}/`) ||
				!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(
					file.path.slice(root.length + 1),
				) ||
				!text(file.role) ||
				!positive(file.bytes) ||
				!digest(file.sha256),
		) ||
		new Set(files.map((file) => file.path)).size !== files.length
	)
		problems.push("Invalid or duplicate texture files");
	const generations = Array.isArray(m.generations)
		? m.generations.map(object)
		: [];
	if (
		generations.length !== 2 ||
		generations
			.map((g) => g.theme)
			.sort()
			.join(",") !== "dark,light" ||
		generations.some((g) => {
			const raw = object(g.raw);
			return (
				!["gpt-image-2.5-flare", "gpt-image-2.5-sunburst"].includes(
					String(g.model),
				) ||
				g.provider !== "Azure OpenAI" ||
				!text(g.source) ||
				g.crop !== false ||
				g.recolor !== false ||
				!["delegated-agent", "owner"].includes(String(g.acceptance)) ||
				g.ownerReviewedExactBytes !== (g.acceptance === "owner") ||
				raw.path !== `${root}/texture-${g.theme}.png` ||
				raw.width !== 1024 ||
				raw.height !== 1024 ||
				![
					raw.path,
					g.request,
					g.response,
					g.prompt,
					g.approval,
					`${root}/texture-${g.theme}.webp`,
					`${root}/texture-${g.theme}-320.webp`,
				].every((path) => files.some((f) => f.path === path)) ||
				!files.some(
					(f) =>
						f.path === raw.path &&
						f.sha256 === raw.sha256 &&
						f.bytes === raw.bytes,
				)
			);
		})
	)
		problems.push(
			"Two genuine, approved and uncropped theme generations are required",
		);
	return problems;
}
