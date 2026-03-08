import { CHARS } from '@src/config/chars';
import {
	LEGAL_ENTITY_ABBREVIATIONS,
	LEGAL_ENTITY_QUOTED_NAME_MAX_CHARS,
	LEGAL_ENTITY_QUOTED_NAME_MAX_WORDS,
} from '@src/languages/ru/data/legalEntities';
import { escapeRegex, makeAlternation } from '@src/languages/ru/utils/makeAlternation';

const ABBREVIATION_GLUE = '\uE000';
const UPPERCASE_WORD_PATTERN = /^\p{Lu}+$/u;
const TITLE_CASE_WORD_PATTERN = /^\p{Lu}\p{Ll}+$/u;
const LEGAL_ENTITY_QUOTE_PAIRS = [
	[CHARS.LAQUO.unicode, CHARS.RAQUO.unicode],
	[CHARS.LOW_DOUBLE_QUOTE.unicode, CHARS.LEFT_DOUBLE_QUOTE.unicode],
	[CHARS.LEFT_DOUBLE_QUOTE.unicode, CHARS.RIGHT_DOUBLE_QUOTE.unicode],
	['"', '"'],
] as const;

type RuAbbreviationConfig = {
	final: readonly string[];
	prepositional: readonly string[];
};

function normalizeAbbreviation(text: string, abbreviations: readonly string[]): string {
	let result = text;

	for (const abbreviation of [...abbreviations].sort((a, b) => b.length - a.length)) {
		if (!abbreviation.includes(' ')) {
			continue;
		}

		const pattern = new RegExp(
			`(?<![\\p{L}\\p{N}_])${escapeRegex(abbreviation).replace(/\\ /g, '\\s*')}(?=$|[^\\p{L}\\p{N}_])`,
			'giu',
		);
		result = result.replace(pattern, (match) => match.replace(/\s+/g, ABBREVIATION_GLUE));
	}

	return result;
}

function applyFinalAbbreviations(text: string, abbreviations: readonly string[]): string {
	const alternation = makeAlternation(
		abbreviations.map((abbreviation) => abbreviation.replace(/ /g, ABBREVIATION_GLUE)),
	);

	return text.replace(
		new RegExp(`(\\s+)(${alternation})(?=[.,!?]|\\s|$)`, 'giu'),
		`${CHARS.NBSP.unicode}$2`,
	);
}

function applyPrepositionalAbbreviations(text: string, abbreviations: readonly string[]): string {
	const alternation = makeAlternation(
		abbreviations.map((abbreviation) => abbreviation.replace(/ /g, ABBREVIATION_GLUE)),
	);

	return text.replace(
		new RegExp(`(?<![\\p{L}\\p{N}_])(${alternation})(\\s+)`, 'giu'),
		`$1${CHARS.NBSP.unicode}`,
	);
}

function classifyCompanyNameWord(word: string): 'uppercase' | 'title' | null {
	if (UPPERCASE_WORD_PATTERN.test(word)) {
		return 'uppercase';
	}

	if (TITLE_CASE_WORD_PATTERN.test(word)) {
		return 'title';
	}

	return null;
}

function countWords(text: string): number {
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		return 0;
	}

	return trimmed.split(/ +/).length;
}

function getClosingQuote(openingQuote: string): string | undefined {
	return LEGAL_ENTITY_QUOTE_PAIRS.find(([open]) => open === openingQuote)?.[1];
}

function applyLegalEntityQuotedNameSpacing(text: string): string {
	const legalEntityAlternation = makeAlternation(LEGAL_ENTITY_ABBREVIATIONS);
	const openingQuotes = LEGAL_ENTITY_QUOTE_PAIRS.map(([open]) => escapeRegex(open)).join('');
	const prefixPattern = new RegExp(
		`(?<![\\p{L}\\p{N}_])(${legalEntityAlternation})${CHARS.NBSP.unicode}([${openingQuotes}])`,
		'gu',
	);

	let result = '';
	let cursor = 0;

	for (const match of text.matchAll(prefixPattern)) {
		if (match.index === undefined) {
			continue;
		}

		const abbreviation = match[1];
		const openingQuote = match[2];
		const closingQuote = getClosingQuote(openingQuote);
		if (abbreviation === undefined || openingQuote === undefined || closingQuote === undefined) {
			continue;
		}

		const contentStart = match.index + match[0].length;
		const contentEnd = text.indexOf(closingQuote, contentStart);
		if (contentEnd === -1) {
			continue;
		}

		const content = text.slice(contentStart, contentEnd);
		if (
			content.length === 0 ||
			content.length > LEGAL_ENTITY_QUOTED_NAME_MAX_CHARS ||
			countWords(content) > LEGAL_ENTITY_QUOTED_NAME_MAX_WORDS
		) {
			continue;
		}

		result += text.slice(cursor, match.index);
		result += `${abbreviation}${CHARS.NBSP.unicode}${openingQuote}${content.replace(/ +/g, CHARS.NBSP.unicode)}${closingQuote}`;
		cursor = contentEnd + closingQuote.length;
	}

	result += text.slice(cursor);
	return result;
}

function applyLegalEntityNameSpacing(text: string): string {
	const legalEntityAlternation = makeAlternation(LEGAL_ENTITY_ABBREVIATIONS);
	const pattern = new RegExp(
		`(?<![\\p{L}\\p{N}_])(${legalEntityAlternation})${CHARS.NBSP.unicode}((?:\\p{L}+)(?: +\\p{L}+)*)`,
		'gu',
	);

	return text.replace(pattern, (_match, abbreviation: string, name: string) => {
		const words = name.split(' ');
		const style = classifyCompanyNameWord(words[0] ?? '');
		if (style === null) {
			return `${abbreviation}${CHARS.NBSP.unicode}${name}`;
		}

		let result = `${abbreviation}${CHARS.NBSP.unicode}${words[0]}`;
		let index = 1;

		while (index < words.length && classifyCompanyNameWord(words[index]) === style) {
			result += `${CHARS.NBSP.unicode}${words[index]}`;
			index += 1;
		}

		if (index < words.length) {
			result += ` ${words.slice(index).join(' ')}`;
		}

		return result;
	});
}

export function applyRuAbbreviationRules(text: string, config: RuAbbreviationConfig): string {
	let result = text;

	result = normalizeAbbreviation(result, config.final);
	result = normalizeAbbreviation(result, config.prepositional);
	result = applyFinalAbbreviations(result, config.final);
	result = applyPrepositionalAbbreviations(result, config.prepositional);
	result = applyLegalEntityQuotedNameSpacing(result);
	result = applyLegalEntityNameSpacing(result);

	return result.split(ABBREVIATION_GLUE).join(CHARS.THINSP.unicode);
}
