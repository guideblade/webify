import { CHARS } from '@src/config/chars';
import type { TupleRule } from '../contracts/options';
import { makeAlternation } from './makeAlternation';

const NUMBER_PATTERN = String.raw`(?:\d[\d.,]*|\b[IVXLCDM]+\b)`;

export function makeBindPreNumberRule(words: readonly string[]): TupleRule {
	const alt = makeAlternation(words);

	return [
		new RegExp(`(?<![\\p{L}\\p{N}_])(${alt})\\s+(${NUMBER_PATTERN})`, 'giu'),
		`$1${CHARS.NBSP.unicode}$2`,
	] as const;
}
