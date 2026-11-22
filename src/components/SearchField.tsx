import type { RefObject } from "react";
import { copy } from "../data/copy";
import type { Locale } from "../model/project";
import { Icon } from "./Icon";

export function SearchField({
	value,
	onChange,
	locale,
	inputRef,
}: {
	value: string;
	onChange: (value: string) => void;
	locale: Locale;
	inputRef: RefObject<HTMLInputElement | null>;
}) {
	const t = copy[locale];
	return (
		<search className="search-field">
			<Icon name="search" />
			<label className="sr-only" htmlFor="project-search">
				{t.search}
			</label>
			<input
				ref={inputRef}
				id="project-search"
				type="search"
				enterKeyHint="search"
				placeholder={t.searchPlaceholder}
				autoComplete="off"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Escape") onChange("");
				}}
			/>
			{value ? (
				<button
					type="button"
					aria-label={t.clearSearch}
					onClick={() => {
						onChange("");
						inputRef.current?.focus();
					}}
				>
					<Icon name="close" />
				</button>
			) : (
				<span aria-hidden="true">
					<kbd>/</kbd>
				</span>
			)}
		</search>
	);
}
