import { CHARS } from '@src/config/chars';
import { escapeRegex } from './makeAlternation';

const NAMED_ENTITIES = new Map<string, string>([
	['&quot;', '"'],
	...Object.values(CHARS).map(({ entity, unicode }) => [entity, unicode] as const),
]);

const NAMED_ENTITY_PATTERN = new RegExp([...NAMED_ENTITIES.keys()].map(escapeRegex).join('|'), 'g');

const DECODABLE_CODE_POINTS = new Set<number>([
	34,
	...Object.values(CHARS)
		.map(({ unicode }) => unicode.codePointAt(0))
		.filter((codePoint): codePoint is number => codePoint !== undefined),
]);

function decodeCodePointEntity(raw: string, codePoint: number): string {
	if (!DECODABLE_CODE_POINTS.has(codePoint)) {
		return raw;
	}

	return String.fromCodePoint(codePoint);
}

export function decodeKnownEntities(text: string): string {
	return text
		.replace(NAMED_ENTITY_PATTERN, (entity) => NAMED_ENTITIES.get(entity) ?? entity)
		.replace(/&#(\d+);/g, (entity, value: string) =>
			decodeCodePointEntity(entity, Number.parseInt(value, 10)),
		)
		.replace(/&#x([0-9a-f]+);/gi, (entity, value: string) =>
			decodeCodePointEntity(entity, Number.parseInt(value, 16)),
		);
}
