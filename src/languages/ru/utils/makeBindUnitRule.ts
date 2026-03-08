import { CHARS } from '@src/config/chars';
import type { TupleRule } from '@src/core/contracts/types';
import { makeAlternation } from '@src/languages/ru/utils/makeAlternation';

const NUMBER_PATTERN = String.raw`(?:\d[\d.,]*|\b[IVXLCDM]+\b)`;

export function makeBindUnitRule(words: readonly string[]): TupleRule {
	const alt = makeAlternation(words);

	return [
		new RegExp(`(${NUMBER_PATTERN})\\s+(${alt})(?=$|[^\\p{L}\\p{N}_])`, 'giu'),
		`$1${CHARS.NBSP.unicode}$2`,
	] as const;
}
