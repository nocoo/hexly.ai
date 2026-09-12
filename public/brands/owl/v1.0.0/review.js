const themeSwitch = document.querySelector("#theme-switch");
const candidate = document.querySelector("#candidate");
const candidateLink = document.querySelector("#candidate-link");
const viewButtons = document.querySelectorAll("button[data-view]");

function updateArtwork() {
	const theme = document.body.dataset.theme;
	const view = candidateLink.dataset.view;
	candidate.src =
		view === "icon" ? `./icon-${theme}-512.png` : "./logo-light.png";
	candidateLink.href =
		view === "icon"
			? `./icon-${theme}.png`
			: view === "white"
				? "./white.png"
				: "./logo.png";
}

themeSwitch.addEventListener("click", () => {
	const dark = document.body.dataset.theme !== "dark";
	document.body.dataset.theme = dark ? "dark" : "light";
	themeSwitch.setAttribute("aria-pressed", String(dark));
	themeSwitch.textContent = dark ? "Light canvas" : "Dark canvas";
	updateArtwork();
});
for (const button of viewButtons) {
	button.addEventListener("click", () => {
		candidateLink.dataset.view = button.dataset.view;
		for (const option of viewButtons)
			option.setAttribute("aria-pressed", String(option === button));
		updateArtwork();
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
