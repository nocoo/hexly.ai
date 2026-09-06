import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("The application root is missing.");
createRoot(root).render(
	<StrictMode>
		<main>
			<h1>hexly.ai</h1>
			<p>A little universe of projects.</p>
		</main>
	</StrictMode>,
);
