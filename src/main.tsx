import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("The application root is missing.");
createRoot(root, {
	onUncaughtError(error) {
		console.error(error);
		document.documentElement.dataset.startupError = "true";
	},
}).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
