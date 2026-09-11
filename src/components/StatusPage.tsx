import {
	type CSSProperties,
	type RefObject,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { statusCopy } from "../data/status-copy";
import type { Locale, Project } from "../model/project";
import {
	currentStatus,
	type DisplayStatus,
	healthEndpoint,
	historySlots,
	hourStatus,
	parseStatusSnapshot,
	type StatusService,
	type StatusSnapshot,
	sampleTotals,
} from "../model/status";
import { formatStatusTime } from "../model/time-zone";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { SearchField } from "./SearchField";

function percentage(value: number | null) {
	return value === null ? "—" : `${value.toFixed(value === 100 ? 0 : 2)}%`;
}

function StatusHistory({
	service,
	title,
	now,
	hours,
	locale,
	timeZone,
}: {
	service: StatusService;
	title: string;
	now: number;
	hours: number;
	locale: Locale;
	timeZone: string;
}) {
	const t = statusCopy[locale];
	const slots = historySlots(service.history, now, hours);
	const [selected, setSelected] = useState<number | null>(null);
	const focused = useRef(false);
	const tooltipId = useId();
	const index = Math.min(selected ?? slots.length - 1, slots.length - 1);
	const slot = slots[index];
	if (!slot) return null;
	const date = formatStatusTime(slot.time, locale, timeZone, true);
	const label = `${date} · ${slot.data ? `${slot.data.passed}/${slot.data.total} ${t.passed}` : t.noData}`;
	return (
		<div
			className="status-history"
			onPointerMove={(event) => {
				const rect = event.currentTarget.getBoundingClientRect();
				setSelected(
					Math.max(
						0,
						Math.min(
							slots.length - 1,
							Math.floor(
								((event.clientX - rect.left) / rect.width) * slots.length,
							),
						),
					),
				);
			}}
			onPointerLeave={() => {
				if (!focused.current) setSelected(null);
			}}
		>
			<div className="status-bars" aria-hidden="true">
				{slots.map(({ time, data }, position) => (
					<span
						key={time}
						className={`status-bar status-${hourStatus(data)}`}
						data-selected={
							selected !== null && index === position ? "true" : undefined
						}
					/>
				))}
			</div>
			<input
				className="status-history-input"
				type="range"
				min={0}
				max={slots.length - 1}
				value={index}
				aria-label={`${t.inspect} ${title}`}
				aria-valuetext={label}
				aria-describedby={selected !== null ? tooltipId : undefined}
				onChange={(event) => setSelected(Number(event.target.value))}
				onFocus={() => {
					focused.current = true;
					setSelected(slots.length - 1);
				}}
				onBlur={() => {
					focused.current = false;
					setSelected(null);
				}}
			/>
			{selected !== null && (
				<div
					id={tooltipId}
					className="status-history-tooltip"
					role="tooltip"
					style={
						{
							"--position": `${((index + 0.5) / slots.length) * 100}%`,
						} as CSSProperties
					}
				>
					<span>
						<time dateTime={new Date(slot.time).toISOString()}>{date}</time>
					</span>
					<strong>
						{slot.data
							? `${slot.data.passed}/${slot.data.total} ${t.passed}`
							: t.noData}
					</strong>
				</div>
			)}
		</div>
	);
}

function ServiceRow({
	project,
	service,
	now,
	hours,
	locale,
	timeZone,
}: {
	project: Project;
	service: StatusService;
	now: number;
	hours: number;
	locale: Locale;
	timeZone: string;
}) {
	const t = statusCopy[locale];
	const [expanded, setExpanded] = useState(false);
	const detailId = useId();
	const status = currentStatus(service.latest, now);
	const totals = sampleTotals(service.history);
	const latest = service.latest;
	const reason = latest?.error
		? t.reasons[latest.error as keyof typeof t.reasons]
		: null;
	return (
		<article className="status-service" data-service={project.id}>
			<div className="status-service-main">
				<a
					className="status-service-identity"
					href={project.website ?? project.repository}
					target="_blank"
					rel="noreferrer"
				>
					<Logo project={project} size={44} />
					<span>
						<h3>
							{project.title}
							<Icon name="arrow" />
						</h3>
						<span className="status-host">
							{new URL(service.endpoint).hostname}
						</span>
					</span>
				</a>
				<div className="status-service-history">
					<StatusHistory
						service={service}
						title={project.title}
						now={now}
						hours={hours}
						locale={locale}
						timeZone={timeZone}
					/>
					<div className="status-history-meta">
						<span>
							<strong>{percentage(totals.percentage)}</strong>{" "}
							{t.checksPassed
								.replace(" · 7 days", "")
								.replace(" · 最近 7 天", "")}
						</span>
						<span>
							{latest?.latencyMs === null || !latest
								? "—"
								: `${Math.round(latest.latencyMs)} ms`}
						</span>
					</div>
				</div>
				<button
					type="button"
					className={`status-service-state status-${status}`}
					aria-expanded={expanded}
					aria-controls={detailId}
					aria-label={`${project.title}: ${t[status]}. ${t.latest}`}
					onClick={() => setExpanded(!expanded)}
				>
					<span className="status-dot" aria-hidden="true" />
					<span>{t[status]}</span>
					<Icon name="chevron" />
				</button>
			</div>
			{expanded && (
				<div id={detailId} className="status-service-detail">
					{reason && (
						<p
							className={`status-detail-reason status-${latest?.status ?? "unknown"}`}
						>
							<Icon name="info" />
							{reason}
						</p>
					)}
					<dl>
						<div>
							<dt>{t.endpoint}</dt>
							<dd>
								<a href={service.endpoint} target="_blank" rel="noreferrer">
									{service.endpoint}
									<Icon name="arrow" />
								</a>
							</dd>
						</div>
						<div>
							<dt>{t.checkedAt}</dt>
							<dd>
								{latest ? (
									<time dateTime={new Date(latest.checkedAt).toISOString()}>
										{formatStatusTime(latest.checkedAt, locale, timeZone, true)}
									</time>
								) : (
									t.awaiting
								)}
							</dd>
						</div>
						<div>
							<dt>{t.result}</dt>
							<dd>
								{latest?.httpStatus
									? `HTTP ${latest.httpStatus}`
									: t.notAvailable}
							</dd>
						</div>
						<div>
							<dt>{t.version}</dt>
							<dd>{latest?.version ?? t.notAvailable}</dd>
						</div>
					</dl>
				</div>
			)}
		</article>
	);
}

export function StatusPage({
	projects,
	locale,
	timeZonePreference,
	onTimeZone,
	query,
	searchRef,
	onQuery,
}: {
	projects: Project[];
	locale: Locale;
	timeZonePreference: string;
	onTimeZone: (timeZone: string) => void;
	query: string;
	searchRef: RefObject<HTMLInputElement | null>;
	onQuery: (query: string) => void;
}) {
	const t = statusCopy[locale];
	const [snapshot, setSnapshot] = useState<StatusSnapshot | null>(null);
	const [error, setError] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const refresh = useRef<(() => Promise<void>) | null>(null);
	const [now, setNow] = useState(Date.now);
	const [filter, setFilter] = useState<"all" | "attention">("all");
	const [hours, setHours] = useState(168);
	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const timeZone =
		timeZonePreference === "local" ? browserTimeZone : timeZonePreference;
	const timeZones = useMemo(
		() =>
			[
				...new Set([
					browserTimeZone,
					timeZone,
					...Intl.supportedValuesOf("timeZone"),
				]),
			]
				.filter((zone) => zone !== "UTC")
				.sort(),
		[browserTimeZone, timeZone],
	);

	useEffect(() => {
		const controller = new AbortController();
		let pending = false;
		async function update() {
			if (pending) return;
			pending = true;
			setRefreshing(true);
			try {
				const response = await fetch("/api/status", {
					signal: AbortSignal.any([
						controller.signal,
						AbortSignal.timeout(15_000),
					]),
					cache: "no-cache",
				});
				if (!response.ok) throw new Error("Status feed unavailable");
				const next = parseStatusSnapshot(await response.json());
				if (!controller.signal.aborted) {
					setSnapshot(next);
					setError(false);
					setNow(Date.now());
				}
			} catch {
				if (!controller.signal.aborted) setError(true);
			} finally {
				pending = false;
				if (!controller.signal.aborted) setRefreshing(false);
			}
		}
		refresh.current = update;
		void update();
		const timer = setInterval(() => {
			setNow(Date.now());
			if (!document.hidden) void update();
		}, 60_000);
		const resume = () => {
			if (!document.hidden) void update();
		};
		document.addEventListener("visibilitychange", resume);
		return () => {
			refresh.current = null;
			controller.abort();
			clearInterval(timer);
			document.removeEventListener("visibilitychange", resume);
		};
	}, []);

	const active = projects.filter((project) => !project.archived);
	const unmonitored = active.filter((project) => !healthEndpoint(project));
	const services = active.flatMap((project) => {
		const endpoint = healthEndpoint(project);
		if (!endpoint) return [];
		const service = snapshot?.services.find(
			(item) => item.id === project.id && item.endpoint === endpoint,
		) ?? { id: project.id, endpoint, latest: null, history: [] };
		return [{ project, service, status: currentStatus(service.latest, now) }];
	});
	const counts = services.reduce<Record<DisplayStatus, number>>(
		(result, { status }) => {
			result[status]++;
			return result;
		},
		{ operational: 0, degraded: 0, down: 0, unconfigured: 0, unknown: 0 },
	);
	const measured = sampleTotals(
		services.flatMap(({ service }) => service.history),
	);
	const latestTime = Math.max(
		0,
		...services.map(({ service }) => service.latest?.checkedAt ?? 0),
	);
	const latencies = services
		.flatMap(({ service, status }) =>
			status !== "unknown" &&
			service.latest?.latencyMs !== null &&
			service.latest
				? [service.latest.latencyMs]
				: [],
		)
		.sort((a, b) => a - b);
	const mid = Math.floor(latencies.length / 2);
	const median = latencies.length
		? ((latencies[mid] ?? 0) +
				(latencies[Math.floor((latencies.length - 1) / 2)] ?? 0)) /
			2
		: null;
	const hasAttention = counts.down + counts.degraded + counts.unconfigured > 0;
	const hasUnknown = counts.unknown > 0 || services.length === 0;
	const summaryStatus = error
		? "unknown"
		: hasAttention
			? "degraded"
			: hasUnknown
				? "unknown"
				: "operational";
	const heading = error
		? t.errorTitle
		: !latestTime
			? t.waitingTitle
			: hasAttention
				? t.attentionTitle
				: hasUnknown
					? t.staleTitle
					: t.allGood;
	const description = error
		? t.errorDescription
		: !latestTime
			? t.waitingDescription
			: hasAttention
				? t.attentionDescription
				: hasUnknown
					? t.staleDescription
					: t.allGoodDescription;
	const priority: Record<DisplayStatus, number> = {
		down: 0,
		degraded: 1,
		unconfigured: 2,
		unknown: 3,
		operational: 4,
	};
	const visible = services
		.filter(
			({ project, status }) =>
				(filter === "all" || status !== "operational") &&
				`${project.title} ${project.website} ${project.description[locale]}`
					.toLocaleLowerCase()
					.includes(query.trim().toLocaleLowerCase()),
		)
		.sort(
			(a, b) =>
				priority[a.status] - priority[b.status] ||
				a.project.title.localeCompare(b.project.title),
		);
	const attention = services.length - counts.operational;

	return (
		<main id="main-content" className="shell status-page">
			<section className="status-intro" aria-labelledby="status-title">
				<div>
					<p className="eyebrow">
						<span className="tiny-square" />
						{t.eyebrow}
						<span className="status-eyebrow-rule" />
					</p>
					<h1 id="status-title">
						{t.title}
						<span className="headline-period">.</span>
					</h1>
					<p className="status-description">{t.description}</p>
					<div className="status-timezone">
						<label htmlFor="status-timezone">
							<Icon name="clock" />
							{t.timeZone}
						</label>
						<div className="sort-control">
							<select
								id="status-timezone"
								value={timeZonePreference}
								onChange={(event) => onTimeZone(event.target.value)}
							>
								<option value="local">
									{t.localTime} · {browserTimeZone.replaceAll("_", " ")}
								</option>
								<option value="UTC">UTC</option>
								<optgroup label={t.allTimeZones}>
									{timeZones.map((zone) => (
										<option key={zone} value={zone}>
											{zone.replaceAll("_", " ")}
										</option>
									))}
								</optgroup>
							</select>
							<Icon name="chevron" />
						</div>
					</div>
				</div>
				<div
					className={`status-signal status-${summaryStatus}`}
					aria-hidden="true"
				>
					<div className="status-signal-orbit">
						<span />
						<span />
						<span />
						<Icon name="activity" />
					</div>
					<div>
						<span className="status-signal-label">
							{snapshot?.mode === "demo" ? t.demo : t.live}
						</span>
						<span>{t.cadence}</span>
						<span>{t.retention}</span>
					</div>
				</div>
			</section>

			{snapshot?.mode === "demo" && (
				<p className="status-demo">
					<Icon name="info" />
					<strong>{t.demo}</strong>
					<span>{t.demoDescription}</span>
				</p>
			)}

			<section
				className={`status-overview status-${summaryStatus}`}
				aria-label={heading}
			>
				<div className="status-summary">
					<div className="status-summary-icon">
						<Icon
							name={
								summaryStatus === "operational"
									? "check"
									: summaryStatus === "degraded"
										? "activity"
										: "clock"
							}
						/>
					</div>
					<div>
						<h2>{heading}</h2>
						<p>{description}</p>
					</div>
					<span className="status-summary-stamp" aria-hidden="true">
						HEXLY / SYSTEMS
					</span>
				</div>
				<div className="status-metrics">
					<div>
						<span className="status-metric-label">{t.responding}</span>
						<strong>
							{latestTime ? counts.operational : "—"}
							<span className="status-metric-denominator">
								{" "}
								/ {services.length}
							</span>
						</strong>
						<span>{t.endpoints}</span>
					</div>
					<div>
						<span className="status-metric-label">{t.checksPassed}</span>
						<strong>{percentage(measured.percentage)}</strong>
						<span>
							{measured.total.toLocaleString(locale)} {t.observations}
						</span>
					</div>
					<div>
						<span className="status-metric-label">{t.response}</span>
						<strong>
							{median === null ? "—" : Math.round(median)}
							<span className="status-metric-unit"> ms</span>
						</strong>
						<span>{t.responseNote}</span>
					</div>
				</div>
			</section>

			<section className="status-collection" aria-labelledby="services-title">
				<div className="status-section-heading">
					<div>
						<div className="collection-title-row">
							<h2 id="services-title">{t.systems}</h2>
							<span className="count-badge">{services.length}</span>
						</div>
						<p>{t.systemsDescription}</p>
					</div>
					<div className="status-update">
						<span className={`status-update-dot status-${summaryStatus}`} />
						<span>
							{latestTime ? (
								<>
									{t.updated}{" "}
									<time dateTime={new Date(latestTime).toISOString()}>
										{formatStatusTime(latestTime, locale, timeZone, true)}
									</time>
								</>
							) : (
								t.awaiting
							)}
						</span>
						<button
							type="button"
							className={`icon-button ${refreshing ? "status-refreshing" : ""}`}
							disabled={refreshing}
							aria-label={refreshing ? t.refreshing : t.refresh}
							title={t.refresh}
							onClick={() => {
								void refresh.current?.();
							}}
						>
							<Icon name="refresh" />
						</button>
					</div>
				</div>
				<div className="status-toolbar">
					<fieldset className="status-filters" aria-label={t.systems}>
						<button
							type="button"
							aria-pressed={filter === "all"}
							onClick={() => setFilter("all")}
						>
							{t.all}
							<span>{services.length}</span>
						</button>
						<button
							type="button"
							aria-pressed={filter === "attention"}
							onClick={() => setFilter("attention")}
						>
							{t.attention}
							<span>{attention}</span>
						</button>
					</fieldset>
					<SearchField
						value={query}
						onChange={onQuery}
						locale={locale}
						inputRef={searchRef}
					/>
				</div>
				<div className="status-history-heading">
					<div className="status-legend">
						{(["operational", "degraded", "down", "unknown"] as const).map(
							(state) => (
								<span key={state}>
									<i className={`status-legend-key status-${state}`} />
									{t[state]}
								</span>
							),
						)}
					</div>
					<fieldset className="status-period" aria-label={t.history}>
						<button
							type="button"
							aria-pressed={hours === 24}
							onClick={() => setHours(24)}
						>
							{t.day}
						</button>
						<button
							type="button"
							aria-pressed={hours === 168}
							onClick={() => setHours(168)}
						>
							{t.week}
						</button>
					</fieldset>
				</div>
				<div className="status-service-list">
					{visible.map(({ project, service }) => (
						<ServiceRow
							key={project.id}
							project={project}
							service={service}
							now={now}
							hours={hours}
							locale={locale}
							timeZone={timeZone}
						/>
					))}
					{visible.length === 0 && (
						<div className="status-empty">
							<Icon name="search" />
							<p>{t.noResults}</p>
							<button
								type="button"
								className="text-button"
								onClick={() => {
									onQuery("");
									setFilter("all");
								}}
							>
								{t.clear}
								<Icon name="right" />
							</button>
						</div>
					)}
				</div>
				<div className="status-timeline-labels">
					<span>
						{formatStatusTime(now - hours * 3_600_000, locale, timeZone)}
					</span>
					<span>{t.hourLegend}</span>
					<span>{t.now}</span>
				</div>
			</section>

			{unmonitored.length > 0 && (
				<details className="status-coverage">
					<summary>
						<span className="status-coverage-icon">
							<Icon name="folder" />
						</span>
						<span>
							<strong>
								{t.coverage}
								<span className="count-badge">{unmonitored.length}</span>
							</strong>
							<span>{t.coverageDescription}</span>
						</span>
						<Icon name="chevron" />
					</summary>
					<div className="status-coverage-content">
						<p>{t.coverageNote}</p>
						<div>
							{unmonitored.map((project) => (
								<a key={project.id} href={`/logos/${project.id}`}>
									<Logo project={project} size={24} />
									<span>{project.title}</span>
									<Icon name="arrow" />
								</a>
							))}
						</div>
					</div>
				</details>
			)}
			<aside className="status-method">
				<div>
					<span className="eyebrow">
						<Icon name="info" />
						{t.methodTitle}
					</span>
					<p>{t.method}</p>
				</div>
				<div>
					<p>{t.methodDetail}</p>
					<p>{t.methodScope}</p>
				</div>
			</aside>
		</main>
	);
}
