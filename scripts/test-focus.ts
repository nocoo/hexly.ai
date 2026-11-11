const focused = /\.only\s*\(/;
const todo = /\.todo\s*\(/;
const legacy = /(?:^|[^.\w])(?:fit|xdescribe|xit|fdescribe)\s*\(/m;
const unconditionalSkip = /\.skip\s*\(\s*[`'"]/;
const staticSkipIf = /\.skipIf\s*\(\s*true\s*\)/;

export function violations(path: string, source: string): string[] {
	const found: string[] = [];
	for (const [index, line] of source.split("\n").entries()) {
		if (line.trimStart().startsWith("//")) continue;
		const rule = focused.test(line)
			? "focused test (.only)"
			: todo.test(line)
				? "pending test (.todo)"
				: unconditionalSkip.test(line)
					? "unconditional skip (.skip)"
					: staticSkipIf.test(line)
						? "static skip (.skipIf(true))"
						: legacy.test(line)
							? "focused/skipped suite (fit/xit/fdescribe/xdescribe)"
							: null;
		if (rule) found.push(`${path}:${index + 1}: ${rule}`);
	}
	return found;
}
