import { CHARS } from '@src/config/chars';
import type { TextReplacementRule } from '@src/core/contracts/options';

const UPPERCASE_INITIAL = '\\p{Lu}';
const TITLECASE_WORD = `${UPPERCASE_INITIAL}\\p{Ll}`;

export const DEFAULT_RU_REPLACEMENT_RULES: readonly TextReplacementRule[] = [
	{
		pattern: /(?<!\s)\.{3}|\.{3}(?!\s)/g,
		replace: CHARS.HELLIP.unicode,
		priority: 100,
	},
	{
		pattern: /\. - /g,
		replace: `. ${CHARS.MDASH.unicode}${CHARS.NBSP.unicode}`,
	},
	{
		pattern: /\. — /g,
		replace: `. ${CHARS.MDASH.unicode}${CHARS.NBSP.unicode}`,
	},
	{
		pattern: /, - /g,
		replace: `,${CHARS.NBSP.unicode}${CHARS.MDASH.unicode} `,
	},
	{
		pattern: /, — /g,
		replace: `,${CHARS.NBSP.unicode}${CHARS.MDASH.unicode} `,
	},
	{
		pattern: /\s-\s/g,
		replace: `${CHARS.NBSP.unicode}${CHARS.MDASH.unicode} `,
	},
	{
		pattern: / — /g,
		replace: `${CHARS.NBSP.unicode}${CHARS.MDASH.unicode} `,
	},
	{
		pattern: new RegExp(`(?<!${UPPERCASE_INITIAL})(${UPPERCASE_INITIAL})\\.\\s+(${UPPERCASE_INITIAL})\\.`, 'gu'),
		replace: `$1.${CHARS.THINSP.unicode}$2.`,
	},
	{
		pattern: new RegExp(`(?<!${UPPERCASE_INITIAL})(${UPPERCASE_INITIAL})\\.\\s+(?=${TITLECASE_WORD})`, 'gu'),
		replace: `$1.${CHARS.THINSP.unicode}`,
	},
	{
		pattern: /\((?:C|c)\)/g,
		replace: CHARS.COPYRIGHT.unicode,
		priority: 80,
	},
	{
		pattern: /\((?:R|r)\)/g,
		replace: CHARS.REGISTERED.unicode,
		priority: 80,
	},
	{
		pattern: /\((?:TM|tm)\)/g,
		replace: CHARS.TRADEMARK.unicode,
		priority: 80,
	},
	{
		pattern: /(?<=[\p{L}\p{N}])-(?=[\p{L}\p{N}])/gu,
		replace: CHARS.NBHYPHEN.unicode,
	},
	{
		pattern: /©\s+(\d+)/g,
		replace: `${CHARS.COPYRIGHT.unicode}${CHARS.NBSP.unicode}$1`,
		priority: 70,
	},
	{
		pattern: /(\d+)\s+(сотрудников)(?=$|[^\p{L}\p{N}_])/giu,
		replace: `$1${CHARS.NBSP.unicode}$2`,
	},
	{
		pattern: /даже\s+то/giu,
		replace: `даже${CHARS.NBSP.unicode}то`,
	},
];
