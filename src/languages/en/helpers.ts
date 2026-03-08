import {
	EN_CLOSING_PUNCTUATION,
	EN_OPENING_PUNCTUATION,
	EN_VULGAR_FRACTIONS,
} from './data/constants';

export function isWhitespace(ch: string | null): boolean {
	return ch !== null && /\s/u.test(ch);
}

export function isLetter(ch: string | null): boolean {
	return ch !== null && /\p{L}/u.test(ch);
}

export function isDigit(ch: string | null): boolean {
	return ch !== null && /[0-9]/.test(ch);
}

export function isNumericLike(ch: string | null): boolean {
	return isDigit(ch) || (ch !== null && EN_VULGAR_FRACTIONS.has(ch));
}

export function isWordLike(ch: string | null): boolean {
	return isLetter(ch) || isDigit(ch) || ch === '_';
}

export function isOpeningPunctuation(ch: string | null): boolean {
	return ch !== null && EN_OPENING_PUNCTUATION.has(ch);
}

export function isClosingPunctuation(ch: string | null): boolean {
	return ch !== null && EN_CLOSING_PUNCTUATION.has(ch);
}

export function getPrevSignificantIndex(text: string, fromIndex: number): number {
	for (let i = fromIndex - 1; i >= 0; i -= 1) {
		if (!isWhitespace(text[i])) return i;
	}
	return -1;
}

export function getNextSignificantIndex(text: string, fromIndex: number): number {
	for (let i = fromIndex + 1; i < text.length; i += 1) {
		if (!isWhitespace(text[i])) return i;
	}
	return -1;
}

export function getPrevSignificantChar(text: string, fromIndex: number): string | null {
	const index = getPrevSignificantIndex(text, fromIndex);
	return index === -1 ? null : text[index];
}

export function getNextSignificantChar(text: string, fromIndex: number): string | null {
	const index = getNextSignificantIndex(text, fromIndex);
	return index === -1 ? null : text[index];
}

export function readLettersFrom(text: string, startIndex: number): string {
	let result = '';
	for (let i = startIndex; i < text.length; i += 1) {
		if (!isLetter(text[i])) break;
		result += text[i];
	}
	return result;
}

export function isBoundaryOrEnd(ch: string | null): boolean {
	return ch === null || isClosingPunctuation(ch);
}

export function isStartishContext(ch: string | null): boolean {
	return ch === null || isOpeningPunctuation(ch);
}
