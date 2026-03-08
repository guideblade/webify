import { CHARS } from '@src/config/chars';

const entries = Object.values(CHARS).map(({ unicode, entity }) => [unicode, entity] as const);
export const HTML_ENTITIES: Record<string, string> = Object.fromEntries(entries);

function escapeCharClassChar(ch: string): string {
	return ch.replace(/[\\\-\]\^]/g, '\\$&');
}

const ENCODABLE = new RegExp(`[${Object.keys(HTML_ENTITIES).map(escapeCharClassChar).join('')}]`, 'g');

export function encodeHtmlEntities(text: string): string {
	return text.replace(ENCODABLE, (c) => HTML_ENTITIES[c] ?? c);
}
