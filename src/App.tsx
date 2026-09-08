import { useEffect, useRef, useState } from "react";
import { Directory } from "./components/Directory";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Icon } from "./components/Icon";
import { copy } from "./data/copy";
import rawProjects from "./data/projects.json";
import { filterProjects } from "./model/catalogue";
import {
	type DirectoryState,
	navigationPath,
	openLogo,
	parseNavigation,
	resolveNavigation,
} from "./model/navigation";
import { readPreferences, savePreference } from "./model/preferences";
import type { Project, View } from "./model/project";
import "./styles/base.css";
import "./styles/directory.css";
import "./styles/gallery.css";

const projects = rawProjects as Project[];

function browserStorage(): Storage | null {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

export function App() {
	const [state, setState] = useState(() =>
		parseNavigation(window.location.pathname, window.location.search, projects),
	);
	const [preferences, setPreferences] = useState(() =>
		readPreferences(
			browserStorage(),
			navigator.language,
			window.matchMedia("(prefers-color-scheme: dark)").matches,
		),
	);
	const [toast, setToast] = useState("");
	const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const { locale, theme } = preferences;
	const t = copy[locale];
	const visible = filterProjects(
		projects,
		state.query,
		state.category,
		state.sort,
	);

	useEffect(() => {
		document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
		document.documentElement.dataset.theme = theme;
		const themeMeta = document.querySelector('meta[name="theme-color"]');
		themeMeta?.setAttribute(
			"content",
			theme === "dark" ? "#1e2824" : "#f0f0e9",
		);
	}, [locale, theme]);

	useEffect(() => {
		const path = navigationPath(state);
		if (`${window.location.pathname}${window.location.search}` !== path)
			window.history.replaceState(null, "", `${path}${window.location.hash}`);
	}, [state]);

	useEffect(() => {
		const onPopState = () =>
			setState(
				parseNavigation(
					window.location.pathname,
					window.location.search,
					projects,
				),
			);
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target;
			if (
				event.key === "/" &&
				!event.metaKey &&
				!event.ctrlKey &&
				!(
					target instanceof HTMLElement &&
					(target.isContentEditable ||
						["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
				)
			) {
				event.preventDefault();
				searchRef.current?.focus();
			}
		};
		window.addEventListener("popstate", onPopState);
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("popstate", onPopState);
			window.removeEventListener("keydown", onKeyDown);
			if (toastTimer.current) clearTimeout(toastTimer.current);
		};
	}, []);

	const navigate = (next: DirectoryState, replace = false) => {
		const resolved = resolveNavigation(next, projects);
		setState(resolved);
		window.history[replace ? "replaceState" : "pushState"](
			null,
			"",
			navigationPath(resolved),
		);
		if (next.view !== state.view)
			window.scrollTo({ top: 0, behavior: "instant" });
	};
	const change = (patch: Partial<DirectoryState>) =>
		navigate({ ...state, ...patch }, "query" in patch);
	const view = (next: View) => {
		navigate({ ...state, view: next, category: "all", query: "" });
		window.scrollTo({ top: 0, behavior: "instant" });
	};
	const switchLocale = () => {
		const next = locale === "en" ? "zh" : "en";
		savePreference(browserStorage(), "locale", next);
		setPreferences((current) => ({ ...current, locale: next }));
	};
	const switchTheme = () => {
		const next = theme === "light" ? "dark" : "light";
		savePreference(browserStorage(), "theme", next);
		setPreferences((current) => ({ ...current, theme: next }));
	};
	const copyValue = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			setToast(`${t.copied} ${value}`);
		} catch {
			setToast(`${t.copyFailed} ${value}`);
		}
		if (toastTimer.current) clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(() => setToast(""), 2600);
	};

	return (
		<>
			<a className="skip-link" href="#main-content">
				{t.skip}
			</a>
			<Header
				view={state.view}
				locale={locale}
				theme={theme}
				onView={view}
				onLocale={switchLocale}
				onTheme={switchTheme}
			/>
			{state.view === "directory" ? (
				<Directory
					projects={projects}
					visible={visible}
					state={state}
					locale={locale}
					searchRef={searchRef}
					onChange={change}
					onLogo={(id) => {
						const project = projects.find((item) => item.id === id);
						if (project) navigate(openLogo(state, project));
					}}
				/>
			) : (
				<Gallery
					projects={projects}
					visible={visible}
					state={state}
					locale={locale}
					searchRef={searchRef}
					onChange={change}
					onCopy={(value) => {
						void copyValue(value);
					}}
				/>
			)}
			<Footer locale={locale} onHome={() => view("directory")} />
			<div
				className={`toast ${toast ? "toast-visible" : ""}`}
				role="status"
				aria-live="polite"
			>
				{toast && (
					<>
						<Icon name="check" />
						<span>{toast}</span>
					</>
				)}
			</div>
		</>
	);
}
