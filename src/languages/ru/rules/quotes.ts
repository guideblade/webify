import { CHARS } from '@src/config/chars';

const LETTER_PATTERN = /\p{L}/u;
const WHITESPACE_PATTERN = /\s/u;
const OPENING_PRECEDERS = new Set([
	'(',
	'[',
	'{',
	'"',
	"'",
	CHARS.LAQUO.unicode,
	CHARS.LOW_DOUBLE_QUOTE.unicode,
]);
const CLOSING_FOLLOWERS = new Set([
	'.',
	',',
	';',
	':',
	'!',
	'?',
	')',
	'}',
	']',
	CHARS.RAQUO.unicode,
	CHARS.RIGHT_DOUBLE_QUOTE.unicode,
	CHARS.HELLIP.unicode,
	"'",
	'"',
]);
const CLOSING_PRECEDERS = new Set(['?', '!', '.', CHARS.HELLIP.unicode]);

function isLetter(char: string | undefined): boolean {
	return char !== undefined && LETTER_PATTERN.test(char);
}

function isWordLike(char: string | undefined): boolean {
	return char !== undefined && (isLetter(char) || /\d/u.test(char));
}

function isWhitespace(char: string | undefined): boolean {
	return char !== undefined && WHITESPACE_PATTERN.test(char);
}

function getPrevSignificantChar(text: string, fromIndex: number): string | undefined {
	for (let index = fromIndex - 1; index >= 0; index -= 1) {
		if (!isWhitespace(text[index])) {
			return text[index];
		}
	}

	return undefined;
}

function getNextSignificantChar(text: string, fromIndex: number): string | undefined {
	for (let index = fromIndex + 1; index < text.length; index += 1) {
		if (!isWhitespace(text[index])) {
			return text[index];
		}
	}

	return undefined;
}

function isOpeningContext(previous: string | undefined, next: string | undefined): boolean {
	return (previous === undefined || isWhitespace(previous) || OPENING_PRECEDERS.has(previous)) && isWordLike(next);
}

function isClosingContext(previous: string | undefined, next: string | undefined): boolean {
	if (previous === undefined) {
		return false;
	}

	const hasClosingPreceder = isLetter(previous) || CLOSING_PRECEDERS.has(previous);
	const hasClosingFollower =
		next === undefined || isWhitespace(next) || CLOSING_FOLLOWERS.has(next);

	return hasClosingPreceder && hasClosingFollower;
}

function isSeparatedClosingContext(
	text: string,
	previous: string | undefined,
	next: string | undefined,
	fromIndex: number,
): boolean {
	if (next === undefined || !isWhitespace(next)) {
		return false;
	}

	const nextSignificant = getNextSignificantChar(text, fromIndex);
	if (!isLetter(nextSignificant)) {
		return false;
	}

	return previous === undefined || CLOSING_PRECEDERS.has(previous) || CLOSING_FOLLOWERS.has(previous);
}

function getOpeningQuote(depth: number): string {
	return depth % 2 === 0 ? CHARS.LAQUO.unicode : CHARS.LOW_DOUBLE_QUOTE.unicode;
}

function getClosingQuote(depth: number): string {
	return depth % 2 === 0 ? CHARS.RAQUO.unicode : CHARS.LEFT_DOUBLE_QUOTE.unicode;
}

export function applyRuQuoteRules(text: string): string {
	if (!text.includes('"')) {
		return text;
	}

	const quoteCount = text.split('"').length - 1;
	let result = '';
	let depth = 0;
	let hasMatchedClosing = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		if (char !== '"') {
			result += char;
			continue;
		}

		let runLength = 1;
		while (text[index + runLength] === '"') {
			runLength += 1;
		}

		const previous = index > 0 ? text[index - 1] : undefined;
		const next = index + runLength < text.length ? text[index + runLength] : undefined;
		const previousSignificant = getPrevSignificantChar(text, index);
		const opening = isOpeningContext(previous, next);
		const closing =
			isClosingContext(previous, next) ||
			isSeparatedClosingContext(text, previous, next, index + runLength - 1);

		if (
			index + runLength === text.length &&
			depth === 0 &&
			isWhitespace(previous) &&
			(previousSignificant === '.' || isLetter(previousSignificant))
		) {
			for (let offset = 0; offset < runLength; offset += 1) {
				result += getOpeningQuote(depth);
				depth += 1;
			}

			index += runLength - 1;
			continue;
		}

		if (opening && !closing) {
			for (let offset = 0; offset < runLength; offset += 1) {
				result += getOpeningQuote(depth);
				depth += 1;
			}

			index += runLength - 1;
			continue;
		}

		if (closing && !opening) {
			for (let offset = 0; offset < runLength; offset += 1) {
				const quoteIndex = index + offset;
				const previousSignificantForQuote = getPrevSignificantChar(text, quoteIndex);
				const isMatchedClosing = depth > 0;
				const nextDepth = Math.max(depth - 1, 0);
				const closingQuote = getClosingQuote(nextDepth);

				if (
					quoteIndex === text.length - 1 &&
					previousSignificantForQuote === '.' &&
					result.endsWith('.') &&
					!result.endsWith('..')
				) {
					depth = nextDepth;
					result = `${result.slice(0, -1)}${closingQuote}.`;
					continue;
				}

				if (
					quoteIndex === text.length - 1 &&
					!isMatchedClosing &&
					quoteCount === 1 &&
					isLetter(text[quoteIndex - 1])
				) {
					result += closingQuote;
					continue;
				}

				if (quoteIndex === text.length - 1 && !isMatchedClosing && previousSignificantForQuote !== '.') {
					if (hasMatchedClosing && isLetter(previousSignificant)) {
						result += '"';
					}
					continue;
				}

				if (isMatchedClosing) {
					hasMatchedClosing = true;
				}
				depth = nextDepth;
				result += closingQuote;
			}

			index += runLength - 1;
			continue;
		}

		result += '"'.repeat(runLength);
		index += runLength - 1;
	}

	return result;
}
