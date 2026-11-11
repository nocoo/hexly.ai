export interface PushRef {
	localOid: string;
	remoteOid: string | null;
}

const zeroOid = /^0+$/;

/**
 * Parses Git's pre-push stdin. Deleted refs and duplicates collapse away so a
 * push verifies each target commit once, not the current working tree.
 */
export function parsePushRefs(input: string): PushRef[] {
	const refs = new Map<string, PushRef>();
	for (const line of input.split("\n")) {
		const fields = line.trim().split(/\s+/);
		if (fields.length < 4) continue;
		const localOid = fields[1] ?? "";
		if (!/^[0-9a-f]{40,64}$/.test(localOid) || zeroOid.test(localOid)) continue;
		const remoteOid = fields[3] ?? "";
		const resolved =
			/^[0-9a-f]{40,64}$/.test(remoteOid) && !zeroOid.test(remoteOid)
				? remoteOid
				: null;
		const existing = refs.get(localOid);
		if (!existing || (existing.remoteOid === null && resolved))
			refs.set(localOid, { localOid, remoteOid: resolved });
	}
	return [...refs.values()];
}

/** Cumulative secret scan range: new branch commits, or the pushed commits. */
export function historyRange(ref: PushRef): string {
	return ref.remoteOid
		? `${ref.remoteOid}..${ref.localOid}`
		: `${ref.localOid} --not --remotes`;
}
