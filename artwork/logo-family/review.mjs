const themeSwitch = document.querySelector("#theme-switch");
themeSwitch.addEventListener("click", () => {
	const isDark = document.body.dataset.theme !== "dark";
	document.body.dataset.theme = isDark ? "dark" : "light";
	themeSwitch.setAttribute("aria-pressed", String(isDark));
	themeSwitch.textContent = isDark ? "Light canvas" : "Dark canvas";
});

const candidate = document.querySelector("#candidate");
const candidateLink = document.querySelector("#candidate-link");
const viewButtons = document.querySelectorAll("button[data-view]");
for (const button of viewButtons) {
	button.addEventListener("click", () => {
		const view = button.dataset.view;
		document.body.dataset.view = view;
		candidate.src = candidate.dataset[view];
		candidateLink.href = candidate.dataset[view].replace(
			"-1024.png",
			"-2048.png",
		);
		for (const option of viewButtons)
			option.setAttribute("aria-pressed", String(option === button));
	});
}

for (const button of document.querySelectorAll("button[data-color]")) {
	button.setAttribute("aria-label", `Copy ${button.dataset.color}`);
	button.addEventListener("click", async () => {
		const status = document.querySelector("#copy-status");
		try {
			await navigator.clipboard.writeText(button.dataset.color);
			status.textContent = `Copied ${button.dataset.color}.`;
		} catch {
			status.textContent = `Color: ${button.dataset.color}. Select the hex value to copy it.`;
		}
	});
}

const prompt = document.querySelector("#generation-prompt");
try {
	const response = await fetch("./prompt.txt");
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	prompt.textContent = await response.text();
} catch {
	prompt.textContent = "Use the Exact prompt download link to read prompt.txt.";
}
