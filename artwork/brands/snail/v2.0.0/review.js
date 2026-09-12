const themeSwitch = document.querySelector("#theme-switch");
themeSwitch.addEventListener("click", () => {
	const dark = document.body.dataset.theme !== "dark";
	document.body.dataset.theme = dark ? "dark" : "light";
	themeSwitch.setAttribute("aria-pressed", String(dark));
	themeSwitch.textContent = dark ? "Light canvas" : "Dark canvas";
});

const candidate = document.querySelector("#candidate");
const candidateLink = document.querySelector("#candidate-link");
const viewButtons = document.querySelectorAll("button[data-view]");
for (const button of viewButtons) {
	button.addEventListener("click", () => {
		const view = button.dataset.view;
		candidate.src =
			view === "icon" ? "./icon-light-512.png" : "./logo-light.png";
		candidateLink.href =
			view === "icon"
				? "./icon-light.png"
				: view === "white"
					? "./white.png"
					: "./logo.png";
		candidateLink.dataset.view = view;
		for (const option of viewButtons)
			option.setAttribute("aria-pressed", String(option === button));
	});
}

for (const button of document.querySelectorAll("button[data-color]")) {
	button.addEventListener("click", async () => {
		const status = document.querySelector("#copy-status");
		try {
			await navigator.clipboard.writeText(button.dataset.color);
			status.textContent = `Copied ${button.dataset.color}`;
		} catch {
			status.textContent = `Copy manually: ${button.dataset.color}`;
		}
	});
}

for (const prompt of document.querySelectorAll("pre[data-source]")) {
	try {
		const response = await fetch(prompt.dataset.source);
		if (!response.ok) throw new Error("Prompt request failed");
		prompt.textContent = await response.text();
	} catch {
		prompt.textContent =
			"Open the exact prompt download above; the inline request did not complete.";
	}
}
