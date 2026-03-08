const COMMON_TLDS = [
	'com',
	'net',
	'org',
	'ru',
	'me',
	'online',
	'gov',
	'edu',
	'io',
	'dev',
	'app',
	'ai',
	'uk',
	'md',
	'рф',
] as const;

const TRAILING_PUNCTUATION = new Set(['.', ',', '!', '?', ';', ':', '"', "'", '»', '”', '’']);
const ABSOLUTE_URL_PATTERN = /\bhttps?:\/\/[^\s<>"']+/giu;
const WWW_URL_PATTERN = /\bwww\.[^\s<>"']+/giu;
const EMAIL_PATTERN =
	/\b[\p{L}\p{N}._%+-]+@(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?\.)+(?:com|net|org|ru|me|online|gov|edu|io|dev|app|ai|uk|md|рф)\b/giu;
const BARE_DOMAIN_PATTERN = new RegExp(
	`(?<![@/\\p{L}\\p{N}_-])(?:[\\p{L}\\p{N}](?:[\\p{L}\\p{N}-]{0,61}[\\p{L}\\p{N}])?\\.)+(?:${COMMON_TLDS.join('|')})(?:/[^\\s<>"']*)?`,
	'giu',
);

type ProtectedRange = {
	start: number;
	end: number;
	value: string;
};

export type ProtectedTokens = {
	text: string;
	restore(text: string): string;
};

function countChar(text: string, char: string): number {
	return Array.from(text).filter((candidate) => candidate === char).length;
}

function trimTrailingPunctuation(token: string): string {
	let result = token;

	while (result.length > 0) {
		const trailingChar = result.at(-1);
		if (trailingChar === undefined) {
			break;
		}

		if (TRAILING_PUNCTUATION.has(trailingChar)) {
			result = result.slice(0, -1);
			continue;
		}

		if (trailingChar === ')' && countChar(result, '(') < countChar(result, ')')) {
			result = result.slice(0, -1);
			continue;
		}

		if (trailingChar === ']' && countChar(result, '[') < countChar(result, ']')) {
			result = result.slice(0, -1);
			continue;
		}

		if (trailingChar === '}' && countChar(result, '{') < countChar(result, '}')) {
			result = result.slice(0, -1);
			continue;
		}

		break;
	}

	return result;
}

function collectRanges(text: string, pattern: RegExp): ProtectedRange[] {
	const ranges: ProtectedRange[] = [];

	for (const match of text.matchAll(pattern)) {
		const rawValue = match[0];
		if (rawValue === undefined || match.index === undefined) {
			continue;
		}

		const value = trimTrailingPunctuation(rawValue);
		if (value.length === 0) {
			continue;
		}

		ranges.push({
			start: match.index,
			end: match.index + value.length,
			value,
		});
	}

	return ranges;
}

function mergeRanges(ranges: ProtectedRange[]): ProtectedRange[] {
	const merged: ProtectedRange[] = [];

	for (const range of [...ranges].sort((left, right) => left.start - right.start || right.end - left.end)) {
		const previous = merged.at(-1);
		if (previous !== undefined && range.start < previous.end) {
			if (range.end > previous.end) {
				previous.end = range.end;
				previous.value = previous.value.length >= range.value.length ? previous.value : range.value;
			}

			continue;
		}

		merged.push({ ...range });
	}

	return merged;
}

function makePlaceholder(index: number): string {
	return `x${String.fromCharCode(0xe100 + index)}x`;
}

export function protectLinkLikeTokens(text: string): ProtectedTokens {
	const ranges = mergeRanges([
		...collectRanges(text, ABSOLUTE_URL_PATTERN),
		...collectRanges(text, WWW_URL_PATTERN),
		...collectRanges(text, EMAIL_PATTERN),
		...collectRanges(text, BARE_DOMAIN_PATTERN),
	]);

	if (ranges.length === 0) {
		return {
			text,
			restore: (value) => value,
		};
	}

	const placeholders = new Map<string, string>();
	let protectedText = '';
	let cursor = 0;

	ranges.forEach((range, index) => {
		const placeholder = makePlaceholder(index);
		placeholders.set(placeholder, range.value);
		protectedText += text.slice(cursor, range.start);
		protectedText += placeholder;
		cursor = range.end;
	});

	protectedText += text.slice(cursor);

	return {
		text: protectedText,
		restore(value: string): string {
			let restored = value;

			for (const [placeholder, original] of placeholders) {
				restored = restored.split(placeholder).join(original);
			}

			return restored;
		},
	};
}
