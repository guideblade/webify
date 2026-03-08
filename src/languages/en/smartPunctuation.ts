import {
	EN_DOUBLE_PRIME,
	EN_ELISION_TOKENS,
	EN_LEFT_DOUBLE_QUOTE,
	EN_LEFT_SINGLE_QUOTE,
	EN_PRIME,
	EN_RIGHT_DOUBLE_QUOTE,
	EN_RIGHT_SINGLE_QUOTE,
} from './data/constants';
import {
	getNextSignificantChar,
	getPrevSignificantChar,
	isBoundaryOrEnd,
	isDigit,
	isLetter,
	isNumericLike,
	isOpeningPunctuation,
	isStartishContext,
	isWhitespace,
	isWordLike,
	readLettersFrom,
} from './helpers';

type QuoteState = {
	doubleQuoteOpen: boolean;
	singleQuoteOpen: boolean;
};

function looksLikeOpeningQuote(prevSig: string | null, nextSig: string | null): boolean {
	return isStartishContext(prevSig) && nextSig !== null;
}

function looksLikeClosingQuote(prevSig: string | null, nextSig: string | null): boolean {
	return (isWordLike(prevSig) || isNumericLike(prevSig)) && isBoundaryOrEnd(nextSig);
}

function isLeadingApostropheContext(prev: string | null): boolean {
	return prev === null || isWhitespace(prev) || isOpeningPunctuation(prev);
}

function classifySingleQuote(text: string, index: number, state: QuoteState): string {
	const prev = index > 0 ? text[index - 1] : null;
	const next = index + 1 < text.length ? text[index + 1] : null;
	const prevSig = getPrevSignificantChar(text, index);
	const nextSig = getNextSignificantChar(text, index);

	if (isLetter(prev) && isLetter(next)) {
		return EN_RIGHT_SINGLE_QUOTE;
	}

	if (isLetter(prev) && (next === null || isWhitespace(next) || /[.,!?;:)\]}]/u.test(next))) {
		return EN_RIGHT_SINGLE_QUOTE;
	}

	if (isDigit(prev) && isLetter(next)) {
		return EN_RIGHT_SINGLE_QUOTE;
	}

	if (isLeadingApostropheContext(prev) && isDigit(next)) {
		return EN_RIGHT_SINGLE_QUOTE;
	}

	const nextWord = readLettersFrom(text, index + 1).toLowerCase();
	if (isLeadingApostropheContext(prev) && EN_ELISION_TOKENS.has(nextWord)) {
		return EN_RIGHT_SINGLE_QUOTE;
	}

	if (isNumericLike(prevSig)) {
		return EN_PRIME;
	}

	if (state.singleQuoteOpen && looksLikeClosingQuote(prevSig, nextSig)) {
		state.singleQuoteOpen = false;
		return EN_RIGHT_SINGLE_QUOTE;
	}

	if (looksLikeOpeningQuote(prevSig, nextSig)) {
		state.singleQuoteOpen = true;
		return EN_LEFT_SINGLE_QUOTE;
	}

	if (looksLikeClosingQuote(prevSig, nextSig)) {
		state.singleQuoteOpen = false;
		return EN_RIGHT_SINGLE_QUOTE;
	}

	if (state.singleQuoteOpen) {
		state.singleQuoteOpen = false;
		return EN_RIGHT_SINGLE_QUOTE;
	}

	state.singleQuoteOpen = true;
	return EN_LEFT_SINGLE_QUOTE;
}

function classifyDoubleQuote(text: string, index: number, state: QuoteState): string {
	const prevSig = getPrevSignificantChar(text, index);
	const nextSig = getNextSignificantChar(text, index);

	if (state.doubleQuoteOpen && looksLikeClosingQuote(prevSig, nextSig)) {
		state.doubleQuoteOpen = false;
		return EN_RIGHT_DOUBLE_QUOTE;
	}

	if (isNumericLike(prevSig)) {
		return EN_DOUBLE_PRIME;
	}

	if (looksLikeOpeningQuote(prevSig, nextSig)) {
		state.doubleQuoteOpen = true;
		return EN_LEFT_DOUBLE_QUOTE;
	}

	if (looksLikeClosingQuote(prevSig, nextSig)) {
		state.doubleQuoteOpen = false;
		return EN_RIGHT_DOUBLE_QUOTE;
	}

	if (state.doubleQuoteOpen) {
		state.doubleQuoteOpen = false;
		return EN_RIGHT_DOUBLE_QUOTE;
	}

	state.doubleQuoteOpen = true;
	return EN_LEFT_DOUBLE_QUOTE;
}

export function applySmartPunctuation(text: string): string {
	let result = '';
	const state: QuoteState = {
		doubleQuoteOpen: false,
		singleQuoteOpen: false,
	};

	for (let i = 0; i < text.length; i += 1) {
		const ch = text[i];
		if (ch === "'") {
			result += classifySingleQuote(text, i, state);
			continue;
		}

		if (ch === '"') {
			result += classifyDoubleQuote(text, i, state);
			continue;
		}

		result += ch;
	}

	return result;
}
