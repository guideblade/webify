import { CHARS } from '@src/config/chars';
import type { TextReplacementRule } from '@src/core/contracts/options';

export const EN_ELLIPSIS_REPLACEMENT_RULES: readonly TextReplacementRule[] = [
	{
		pattern: /\.{3}/g,
		replace: CHARS.HELLIP.unicode,
		priority: 100,
	},
];

export const EN_SYMBOL_SHORTHAND_REPLACEMENT_RULES: readonly TextReplacementRule[] = [
	{
		pattern: /\((?:C|c)\)/g,
		replace: CHARS.COPYRIGHT.unicode,
		priority: 90,
	},
	{
		pattern: /\((?:R|r)\)/g,
		replace: CHARS.REGISTERED.unicode,
		priority: 90,
	},
	{
		pattern: /\((?:TM|tm)\)/g,
		replace: CHARS.TRADEMARK.unicode,
		priority: 90,
	},
];

export const DEFAULT_EN_REPLACEMENT_RULES = EN_ELLIPSIS_REPLACEMENT_RULES;
