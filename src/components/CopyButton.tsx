import { useEffect, useRef, useState } from "react";
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
	const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const current = result?.text === text ? result : undefined;
	const t = agentCopy[locale];

	useEffect(() => {
		return () => {
			if (resetTimer.current) clearTimeout(resetTimer.current);
			if (announceTimer.current) clearTimeout(announceTimer.current);
		};
	}, []);

	const updateResult = (ok: boolean) => {
		if (resetTimer.current) clearTimeout(resetTimer.current);
		if (announceTimer.current) clearTimeout(announceTimer.current);
		const apply = () => {
			setResult({ text, ok });
			resetTimer.current = setTimeout(() => setResult(undefined), 2500);
		};
		if (current) {
			setResult(undefined);
			announceTimer.current = setTimeout(apply, 20);
		} else {
			apply();
		}
	};

	return (
		<span className="copy-control">
			<button
				className="copy-button"
				type="button"
				disabled={!text}
				onClick={async () => {
					try {
						await navigator.clipboard.writeText(text);
						updateResult(true);
					} catch {
						updateResult(false);
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
