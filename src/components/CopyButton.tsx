import { useState } from "react";
import { agentCopy } from "../data/agent-copy";
import type { Locale } from "../model/project";
import { Icon } from "./Icon";

export function CopyButton({
	text,
	locale,
	label,
}: {
	text: string;
	locale: Locale;
	label: string;
}) {
	const [result, setResult] = useState<{ text: string; ok: boolean }>();
	const current = result?.text === text ? result : undefined;
	const t = agentCopy[locale];
	return (
		<span className="copy-control">
			<button
				className="copy-button"
				type="button"
				aria-label={label}
				disabled={!text}
				onClick={async () => {
					try {
						await navigator.clipboard.writeText(text);
						setResult({ text, ok: true });
					} catch {
						setResult({ text, ok: false });
					}
				}}
			>
				<Icon name={current?.ok ? "check" : "copy"} />
				{current?.ok ? t.copied : label}
			</button>
			<span
				className={current && !current.ok ? "copy-failure" : "sr-only"}
				role="status"
			>
				{current ? (current.ok ? t.copied : t.failed) : ""}
			</span>
		</span>
	);
}
