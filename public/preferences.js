(() => {
	const page = document.documentElement;
	let theme = matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
	let locale = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
	try {
		const savedTheme = localStorage.getItem("hexly:theme");
		const savedLocale = localStorage.getItem("hexly:locale");
		if (savedTheme === "light" || savedTheme === "dark") theme = savedTheme;
		if (savedLocale === "en" || savedLocale === "zh") locale = savedLocale;
	} catch {
		// System preferences also work when browser storage is unavailable.
	}
	page.dataset.theme = theme;
	page.lang = locale === "zh" ? "zh-CN" : "en";

	let stylesheetFailed = false;
	const showError = () => {
		page.dataset.startupError = "true";
	};
	window.addEventListener(
		"error",
		(event) => {
			const target = event.target;
			if (
				target instanceof HTMLLinkElement &&
				target.relList.contains("stylesheet")
			) {
				stylesheetFailed = true;
				showError();
			} else if (
				page.dataset.appReady !== "true" &&
				((target instanceof HTMLScriptElement &&
					target.src &&
					new URL(target.src).origin === location.origin) ||
					(event instanceof ErrorEvent &&
						(!event.filename ||
							new URL(event.filename, location.href).origin ===
								location.origin)))
			) {
				showError();
			}
		},
		true,
	);
	window.addEventListener("click", (event) => {
		if (
			event.target instanceof Element &&
			event.target.closest("#startup-error button")
		) {
			location.reload();
		}
	});
	// A stalled request gets a retry action; normal startup never waits for a timer.
	const timeout = setTimeout(showError, 15000);
	window.addEventListener("hexly:app-ready", () => {
		clearTimeout(timeout);
		if (!stylesheetFailed) delete page.dataset.startupError;
	});
})();
