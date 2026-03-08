export function escapeRegex(text: string): string {
	return text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

export function makeAlternation(words: readonly string[]): string {
	return [...words]
		.sort((a, b) => b.length - a.length)
		.map(escapeRegex)
		.join('|');
}
