// DATA ONLY
import { CHARS } from '@src/config/chars';

export const EN_LEFT_DOUBLE_QUOTE = CHARS.LEFT_DOUBLE_QUOTE.unicode;
export const EN_RIGHT_DOUBLE_QUOTE = CHARS.RIGHT_DOUBLE_QUOTE.unicode;
export const EN_LEFT_SINGLE_QUOTE = CHARS.LEFT_SINGLE_QUOTE.unicode;
export const EN_RIGHT_SINGLE_QUOTE = CHARS.RIGHT_SINGLE_QUOTE.unicode;
export const EN_PRIME = CHARS.PRIME.unicode;
export const EN_DOUBLE_PRIME = CHARS.DOUBLE_PRIME.unicode;

export const EN_ELISION_TOKENS = new Set(['em', 'cause', 'twas', 'tis', 'til', 'n']);

export const EN_VULGAR_FRACTIONS = new Set([
	'\u00BC',
	'\u00BD',
	'\u00BE',
	'\u2150',
	'\u2151',
	'\u2152',
	'\u2153',
	'\u2154',
	'\u2155',
	'\u2156',
	'\u2157',
	'\u2158',
	'\u2159',
	'\u215A',
	'\u215B',
	'\u215C',
	'\u215D',
	'\u215E',
]);

export const EN_OPENING_PUNCTUATION = new Set([
	'(',
	'[',
	'{',
	'<',
	EN_LEFT_DOUBLE_QUOTE,
	EN_LEFT_SINGLE_QUOTE,
	CHARS.MDASH.unicode,
	CHARS.NDASH.unicode,
	'/',
	'\\',
]);

export const EN_CLOSING_PUNCTUATION = new Set([
	'.',
	',',
	'!',
	'?',
	':',
	';',
	')',
	']',
	'}',
	'>',
	EN_RIGHT_DOUBLE_QUOTE,
	EN_RIGHT_SINGLE_QUOTE,
	CHARS.MDASH.unicode,
	CHARS.NDASH.unicode,
]);
